import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, forkJoin, map, Observable, shareReplay } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { CommonUtils } from 'src/app/shared/utils/commonUtils';
import { OverlayService } from 'src/app/services/overlay.service';
import { AttributeGroupServiceService, GetObjectsArgument, IAttributeGroup, IItem, IItemGroup, ILedger, ILedgerGroup, ITaxClass, IUnit, PItem } from 'src/server';
import { ItemGroupServiceService } from 'src/server/api/itemGroupService.service';
import { ItemServiceService } from 'src/server/api/itemService.service';
import { LedgerGroupServiceService } from 'src/server/api/ledgerGroupService.service';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';
import { TaxClassServiceService } from 'src/server/api/taxClassService.service';
import { UnitServiceService } from 'src/server/api/unitService.service';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.css']
})
export class NewItemComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  // Item Units and Search with auto-complete
  itemUnits:  Observable<IUnit[]>;
  getAvailableUnitsByCriteria : GetObjectsArgument = {};

  // Item Groups and Search with auto-complete
  itemGroups: IItemGroup[];
  filteredItemGroups : Observable<IItemGroup[]>;  
  itemGroupSelected : boolean = false;

  // Sale accounts with auto-complete
  ledgerGroups : ILedgerGroup[];
  saleAccounts : ILedger[];
  filteredSaleAccounts : Observable<ILedger[]>;

  // Purchase accounts with auto-complete
  purchaseAccounts : ILedger[];
  filteredPurchaseAccounts : Observable<ILedger[]>;

  // Tax Class with auto-complete
  taxClasses : ITaxClass[];
  filteredTaxClass : Observable<ITaxClass[]>;

  allAttributeGroups : IAttributeGroup[] | undefined;

  public itemForm!: FormGroup;
  isFormLoaded : boolean = false;
  item: IItem;

  constructor(private breakpointObserver: BreakpointObserver,private route: ActivatedRoute, 
    private router: Router,
    private formBuilder: FormBuilder, 
    private overlayService : OverlayService,
    private unitService :  UnitServiceService,
    private itemService : ItemServiceService,
    private itemGroupService : ItemGroupServiceService,
    private ledgerGroupService : LedgerGroupServiceService,
    private ledgerService : LedgerServiceService,
    private taxClassService : TaxClassServiceService,
    private attributeGroupApi : AttributeGroupServiceService,
    private commonUtils: CommonUtils) { 
      
  }

  ngOnInit(): void {

    this.item = {};

    this.overlayService.enableProgressSpinner();

    this.route.params.subscribe(params => {
      if (params['itemId']) {
          this.itemService.findById(params['itemId']).subscribe({
              next: (data) => {
                this.item = data;
                this.initializeItemForm(false);                          
              },
              error: () =>{}
            }
          );
      }else {
        this.initializeItemForm(true);
      }
    });    
  }
  
  private initializeItemForm(isNewItem : boolean) {
    
    this.onPageLoadHttpRequests().subscribe({
      next: (data) => {

        this.itemGroups = data[0];
        this.taxClasses = data[2];
        this.allAttributeGroups = data[3];

        this.getSalePurchaseAccounts$(data[1]).subscribe({
          next: (data) => {
             this.purchaseAccounts = data[0];
             this.saleAccounts = data[1];

             this.itemForm = this.formBuilder.group({
              jacksontype : 'ItemImpl',
              id: [this.item.id],
              name: [this.item.name, Validators.required],
              productCode: [this.item.productCode],
              hsnCode: [this.item.hsnCode],
              unitId: [this.item.unitId, Validators.required],
              unitName: [this.item.unitName, { validators: [Validators.required]}],
              mrp: [this.item.mrp],
              sellingPrice: [this.item.sellingPrice],
              minStock: [this.item.minStock],
              maxStock: [this.item.maxStock],
              openingStock: [this.item.openingStock],
              openingRate: [this.item.openingRate],
              itemgroupId: [this.item.itemgroupId, Validators.required],
              itemgroupName: [this.item.itemgroupName, [Validators.required,
                this.commonUtils.typingValidator()]],
              taxClassId: [this.item.taxClassId],
              taxClassName: [this.item.taxClassName],
              purchaseAccountLedgerId: [this.item.purchaseAccountLedgerId, Validators.required],
              purchaseAccountLedgerName: [this.item.purchaseAccountLedgerName, [Validators.required, 
                this.commonUtils.forbiddenNamesValidator(this.purchaseAccounts)]],
              ledgerId: [this.item.ledgerId, Validators.required],
              ledgerName: [this.item.ledgerName, [Validators.required,
                this.commonUtils.forbiddenNamesValidator(this.saleAccounts)]],
              maintainStock: [isNewItem ? true : this.item.maintainStock],
              service: [false],
              itemAttributeGroupId: [this.item.itemAttributeGroupId], // Stock Attribute Group Id
              itemAttributeGroupName : [this.item.itemAttributeGroupName],
              tradeItemGroupId: [this.item.tradeItemGroupId], // Item Attribute Group Id
              tradeItemGroupName: [this.item.tradeItemGroupName]
            });
        
            this.getAvailableUnitsByCriteria.genericSearch = false; 
    
            //start with the value available in form i.e in New it will be null 
            //and Edit it will be searched with actual item unit  
            this.itemUnits = this.itemForm.controls["unitName"].valueChanges.pipe(startWith(this.itemForm.controls["unitName"].value), switchMap(value => this._filterUnits(value)));     
            this.filteredPurchaseAccounts = this.itemForm.controls["purchaseAccountLedgerName"].valueChanges.pipe(startWith(this.itemForm.controls["purchaseAccountLedgerName"].value), map(value => this._filterPurchaseAccounts(value || '')));
            this.filteredSaleAccounts = this.itemForm.controls["ledgerName"].valueChanges.pipe(startWith(this.itemForm.controls["ledgerName"].value), map(value => this._filterSaleAccounts(value || '')));
            this.filteredTaxClass = this.itemForm.controls["taxClassName"].valueChanges.pipe(startWith(this.itemForm.controls["taxClassName"].value), map(value => this._filterTaxClass(value || '')));
    
            this.getItemGroups();                
            this.overlayService.disableProgressSpinner();
            
            this.isFormLoaded = true;
          }
        });
        
      },
      error: () => {
        this.overlayService.disableProgressSpinner();
        this.isFormLoaded = true;
      }
    });

  }

  /**
   * This function returns all the observables required on page load.
   * @returns 
   */
  public onPageLoadHttpRequests(): Observable<any[]> {
    let itemGroupObject$ :  Observable<IItemGroup[]> = this.itemGroupService.getObjects();
    let ledgerGroupObjects$ : Observable<ILedgerGroup[]>  = this.ledgerGroupService.getObjects();
    let taxClassObjects$ : Observable<ITaxClass[]>  =  this.taxClassService.getObjects();
    let attributeGroupObjects$ : Observable<IAttributeGroup[]> = this.attributeGroupApi.getObjects();

    return forkJoin([itemGroupObject$, ledgerGroupObjects$, taxClassObjects$, attributeGroupObjects$]);
  }

  /**
   * This function get all the available item groups
   * And bind the auto-complete textbox with the valueChanges event.
   */
   private getItemGroups() : void {
    this.filteredItemGroups = this.itemForm.controls["itemgroupName"].valueChanges.pipe(startWith(this.itemForm.controls["itemgroupName"].value), map(value => this._filterItemGroups(value || '')));
  }

  
  private getSalePurchaseAccounts$(data : ILedgerGroup[]) : Observable<any[]> {
    
    let purchaseAccountsLedgerGroup = data.find((ledgerGroup) => ledgerGroup.name == 'Purchase Accounts');
    let saleAccountsLedgerGroup = data.find((ledgerGroup) => ledgerGroup.name == 'Sale Accounts');

    let purchaseAccountObjects$ :  Observable<ILedger[]> = this.ledgerService.getLedgersFromGroup(purchaseAccountsLedgerGroup?.id);
    let saleAccountObjects$ :  Observable<ILedger[]> =this.ledgerService.getLedgersFromGroup(saleAccountsLedgerGroup?.id);

    return forkJoin([purchaseAccountObjects$, saleAccountObjects$]);
  }


  /**
   * This function is executed when the item unit is selected
   * The selected unit displayname is used to get the selected unit ID to set in the FormGroup.
   * @param event 
   */
  public onUnitSelectionChanged(event : MatAutocompleteSelectedEvent) {    
    const filterValue = event.option.value.toLowerCase();

    this.itemUnits.pipe(
      map((data) => {
        return data!.filter(option => option.name!.toLowerCase().includes(filterValue))
      })
    ).subscribe((data) => {
      if(!!data) {
        this.itemForm.patchValue({
          unitId: data[0].id
        });     
      }      
    });
  }

  /**
   * This function is executed when the item group is selected
   * The selected unit displayname is used to get the selected unit ID to set in the FormGroup.
   * @param event 
   */
   public onItemGroupSelectionChanged(event : MatAutocompleteSelectedEvent) {    
    const filterValue = event.option.value.toLowerCase();

    let selectedItemGroup  = this.itemGroups.find((itemGroup) => itemGroup.name?.toLowerCase().includes(filterValue));

    if(!!selectedItemGroup){
      this.itemGroupSelected = true;
      this.itemForm.controls["itemgroupName"].setErrors(null);
       
      this.itemForm.patchValue({
        itemgroupId: selectedItemGroup.id
      });
    }

  
  }

   /**
   * This function is executed when the Sale Account is selected
   * The selected unit displayname is used to get the selected unit ID to set in the FormGroup.
   * @param event 
   */
  public onSaleAccountSelectionChanged(event : MatAutocompleteSelectedEvent) {
    const filterValue = event.option.value.toLowerCase();

    let saleAccount  = this.saleAccounts.find((saleAccount) => saleAccount.name?.toLowerCase().includes(filterValue));

    if(!!saleAccount){
      this.itemForm.patchValue({
        ledgerId: saleAccount.id
      });
    }
  }

   /**
   * This function is executed when the purchase account is selected
   * The selected unit displayname is used to get the selected unit ID to set in the FormGroup.
   * @param event 
   */
  public onPurchaseAccountSelectionChanged(event : MatAutocompleteSelectedEvent) {
    const filterValue = event.option.value.toLowerCase();

    let purchaseAccount  = this.purchaseAccounts.find((itemGroup) => itemGroup.name?.toLowerCase().includes(filterValue));

    if(!!purchaseAccount){
      this.itemForm.patchValue({
        purchaseAccountLedgerId: purchaseAccount.id
      });
    }
  }

   /**
   * This function is executed when the tax class is selected
   * The selected unit displayname is used to get the selected unit ID to set in the FormGroup.
   * @param event 
   */
  public onTaxClassSelectionChanged(event : MatAutocompleteSelectedEvent) {
    const filterValue = event.option.value.toLowerCase();

    let taxClass  = this.taxClasses.find((itemGroup) => itemGroup.name?.toLowerCase().includes(filterValue));

    if(!!taxClass){
      this.itemForm.patchValue({
        taxClassId: taxClass.id
      });
    }
  }

  

  /**
   * This function filters the units on key input
   * @param value Searched String.
   * @returns 
   */
   private _filterUnits(value: string) : Observable<IUnit[]>{  
    
    //filter value will be null in new and actual value in edit mode.
    const filterValue = !!value ? value.toLowerCase() : '';
    this.getAvailableUnitsByCriteria.nameSearchText = filterValue;

    // Set the unit id as null when no unit is selected.
    if(filterValue.length == 0){
      this.itemForm.patchValue({
        unitId: null
      });
    }

    return this.unitService.getObjectsSearchArg(this.getAvailableUnitsByCriteria).pipe(
      filter(data => !!data),
      map((data) => {        
        return data.objects!.filter(option => option.name!.toLowerCase().includes(filterValue))
      })
    )
  }

  /**
   * This function is executed when user enters any text for searching item groups.
   * The input element is bind with valueChanges event in function getItemGroups()
   * @param value User Input
   * @returns 
   */
   private _filterItemGroups(value: string): IItemGroup[] {

    //filter value will be null in new and actual value in edit mode.
    const filterValue = !!value ? value.toLowerCase() : '';

    if(filterValue.length == 0) {
      this.itemForm.patchValue({
        groupId: null
      });
    }
    return this.itemGroups.filter(option => option.name!.toLowerCase().includes(filterValue));
  }


  private _filterSaleAccounts(value: string): IItemGroup[] {
    
    //filter value will be null in new and actual value in edit mode.
    const filterValue = !!value ? value.toLowerCase() : '';

    if(filterValue.length == 0) {
      this.itemForm.patchValue({
        ledgerSaleAccountId: null
      });
    }
        
    return this.saleAccounts.filter(option => option.name!.toLowerCase().includes(filterValue));
  }

  private _filterPurchaseAccounts(value: string): IItemGroup[] {
    
    //filter value will be null in new and actual value in edit mode.
    const filterValue = !!value ? value.toLowerCase() : '';

    if(filterValue.length == 0) {
      this.itemForm.patchValue({
        ledgerPurchaseAccountId: null
      });
    }
      
    return this.purchaseAccounts.filter(option => option.name!.toLowerCase().includes(filterValue));
  }

  private _filterTaxClass(value: string): ITaxClass[] {
    
    //filter value will be null in new and actual value in edit mode.
    const filterValue = !!value ? value.toLowerCase() : '';

    if(filterValue.length == 0) {
      this.itemForm.patchValue({
        taxClassId: null
      });
    }

    return this.taxClasses.filter(option => option.name!.toLowerCase().includes(filterValue));
  }

  public viewAllItems() : void {
    this.router.navigate(['main/master/allItems']);
  }

  public saveItem() : void {    
    if(this.itemForm.valid) {
      this.overlayService.enableProgressSpinner();
      this.itemService.save(this.itemForm.value).subscribe({
        next: (data) => {
          this.overlayService.disableProgressSpinner();
          this.viewAllItems();
        },
        error: () => {this.overlayService.disableProgressSpinner();}
      });
    }    
  }  

  /** It is executed when user move out of the textbox */
  blurItemGroupSelection(event : any) : void{
    if(!this.itemGroupSelected && this.itemForm.controls["groupName"].hasError('forbiddenNames')){
      this.itemForm.controls["groupName"].setErrors({forbiddenNames: { value: 'Please click on any suggestion to select'}});    
    }
  }
}
