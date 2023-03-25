import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, shareReplay, forkJoin, startWith } from 'rxjs';
import { CommonUtils } from 'src/app/shared/utils/commonUtils';
import { OverlayService } from 'src/app/services/overlay.service';
import { IChoice, IChoiceList, ILedger, ILedgerGroup, IServiceGroup, IServiceMaster, ITaxClass, PLedger, PLedgerMaster } from 'src/server';
import { ChoiceListServiceService } from 'src/server/api/choiceListService.service';
import { LedgerGroupServiceService } from 'src/server/api/ledgerGroupService.service';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';
import { ServiceGroupServiceService } from 'src/server/api/serviceGroupService.service';
import { ServiceServiceService } from 'src/server/api/serviceService.service';
import { TaxClassServiceService } from 'src/server/api/taxClassService.service';

@Component({
  selector: 'app-new-edit-service',
  templateUrl: './new-edit-service.component.html',
  styleUrls: ['./new-edit-service.component.css']
})
export class NewEditServiceComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  public serviceForm!: FormGroup;
  isFormLoaded : boolean = false;
  service: IServiceMaster;

  // Tax Class with auto-complete
  taxClasses : ITaxClass[];
  filteredTaxClass : Observable<ITaxClass[]>;

  // Purchase Accounts with auto-complete
  purchaseAccountLedgers : ILedger[];
  filteredPurchaseAccountLedgers : Observable<ILedger[]>;

  serviceGroups : IServiceGroup[];
  gstUnits : IChoice[];

  constructor(private breakpointObserver: BreakpointObserver,private route: ActivatedRoute, 
    private router: Router,
    private formBuilder: FormBuilder, 
    private overlayService : OverlayService,
    private serviceApi : ServiceServiceService,
    private taxClassService : TaxClassServiceService,
    private ledgerService : LedgerServiceService,
    private ledgerGroupService : LedgerGroupServiceService,
    private serviceGroupApi : ServiceGroupServiceService,
    private choiceListServiceApi : ChoiceListServiceService,
    private commonUtils: CommonUtils) { }

  ngOnInit(): void {
    this.service = {};
    this.serviceGroups = [];
    this.gstUnits= [];

    this.overlayService.enableProgressSpinner();

    this.onPageLoadHttpRequests().subscribe({
      next: (data) => {

        this.taxClasses = data[0];        
        this.getPurchaseAccounts(data[1], data[2]);
        this.getServiceGroups(data[3]);
        this.gstUnits = data[4].choices;

        this.route.params.subscribe(params => {
          if (params['serviceId']) {
              this.serviceApi.findById(params['serviceId']).subscribe({
                  next: (data) => {
                    this.service = data;
                    this.initializeServiceForm();                    
                  },
                  error: () =>{
                    this.overlayService.disableProgressSpinner();
                  }
                }
              );
          }else {
            this.initializeServiceForm();        
          }
        });          
        this.overlayService.disableProgressSpinner();
      },
      error: () => {
        this.overlayService.disableProgressSpinner();
      }
    });

    
    
  }
    
  /**
   * This function returns all the observables required on page load.
   * @returns 
   */
   public onPageLoadHttpRequests(): Observable<any[]> {
    let taxClassObjects$ : Observable<ITaxClass[]>  =  this.taxClassService.getObjects();
    let ledgerObjects$ : Observable<ILedger[]> = this.ledgerService.getObjects();
    let ledgerGroupObjects$ : Observable<ILedgerGroup[]> = this.ledgerGroupService.getObjects();
    let serviceGroupObjects$ : Observable<IServiceGroup[]> = this.serviceGroupApi.getObjects();
    let gstUnitObjects$ : Observable<IChoiceList>  = this.choiceListServiceApi.findByName('GST Units');

    return forkJoin([taxClassObjects$, ledgerObjects$, ledgerGroupObjects$, serviceGroupObjects$, gstUnitObjects$]);
  }

  initializeServiceForm() : void{
    this.serviceForm = this.formBuilder.group({
      jacksontype: 'ServiceImpl',
      id: new FormControl(this.service.id),
      name: new FormControl(this.service.name, [Validators.required]),  
      ledgerId: new FormControl(this.service.ledgerId),
      ledgerName:new FormControl(this.service.ledgerName, [Validators.required]),
      taxClassId: new FormControl(this.service.taxClassId),
      taxClassName: new FormControl(this.service.taxClassName),
      purchaseAccountId: new FormControl(this.service.purchaseAccountId),
      purchaseAccountName: new FormControl(this.service.purchaseAccountName, [Validators.required,
          this.commonUtils.forbiddenNamesValidator(this.purchaseAccountLedgers)]),
      serviceGroupId:  new FormControl(this.service.serviceGroupId),
      serviceGroupName: new FormControl(this.service.serviceGroupName),
      unit: new FormControl(this.service.unit),
      rate: new FormControl(this.service.rate),
      sacCode: new FormControl(this.service.sacCode),
      gstUnit: new FormControl(this.service.gstUnit),  
      description: new FormControl(this.service.description),
      percentage : new FormControl(this.service.percentage)
    });

    this.filteredTaxClass = this.serviceForm.controls["taxClassName"].valueChanges.pipe(startWith(this.serviceForm.controls["taxClassName"].value), map(value => this._filterTaxClass(value || '')));

     // Bind the autocomplete purchase accounts control with purchase accounts.
     this.filteredPurchaseAccountLedgers = this.serviceForm.controls["purchaseAccountName"].valueChanges
     .pipe(startWith(this.serviceForm.controls["purchaseAccountName"].value), map(value => this._filterPurchaseAccounts(value || '')));

    this.isFormLoaded = true;
  }

  
  //This will also executed in edit of any new added entry only.
  onLedgerSelectionChange(selectedLedger : PLedgerMaster) : void {
    this.serviceForm.patchValue({
      ledgerName: selectedLedger.name,
      ledgerId: selectedLedger.id
    });
  }

  /**
   * This function updates the purchase ledger selection changed.
   * @param event 
   */
  onPurchaseLedgerSelectionChanged(event : MatAutocompleteSelectedEvent) : void{
    const filterValue = event.option.value.toLowerCase();

    let purchaseAccount  = this.purchaseAccountLedgers.find((purchaseAccount) => purchaseAccount.name?.toLowerCase().includes(filterValue));

    if(!!purchaseAccount){
      this.serviceForm.patchValue({
        purchaseAccountId: purchaseAccount.id,
        purchaseAccountName: purchaseAccount.name
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

    let taxClass  = this.taxClasses.find((taxClass) => taxClass.name?.toLowerCase().includes(filterValue));

    if(!!taxClass){
      this.serviceForm.patchValue({
        taxClassId: taxClass.id,
        taxClassName: taxClass.name
      });
    }
  }


  /**
   * This function fetches all the available purchase accounts.
   * @param ledgers : All Ledgers
   * @param ledgerGroups : All Ledger Groups
   */
  private getPurchaseAccounts(ledgers : ILedger[], ledgerGroups : ILedgerGroup[]) : void{

    // Get unique ledger group names
    let uniqueLedgerGroupNames : (string | undefined)[] = ledgers.map((ledger) => {
                                return ledger.ledgerGroupName
                          })
                          .filter((ledgerGroupName, index, self) => self.indexOf(ledgerGroupName) === index);

    // Get unique expenses ledger group names.
    let expensesLedgerGroupNames = ledgerGroups.filter((ledgerGroup) => ledgerGroup.type === ILedgerGroup.TypeEnum.EXPENSES)
                                  .filter((expensesLedgerGroup) =>  uniqueLedgerGroupNames.includes(expensesLedgerGroup.name))
                                  .map((expensesLedgerGroup) =>{
                                    return expensesLedgerGroup.name;
                                  });

    // Filter all ledger with unique expenses ledger groups.
    this.purchaseAccountLedgers = ledgers.filter((ledger) => expensesLedgerGroupNames.includes(ledger.ledgerGroupName));
  }

  /**
   * This function changes the service group id and name into the service form on change.
   */
  changeServiceGroup() : void{
    let selectedServiceGroupId = this.serviceForm.controls["serviceGroupId"].value;

    let selectedServiceGroup = this.serviceGroups.find((serviceGroup) => serviceGroup.id == selectedServiceGroupId);
    this.serviceForm.patchValue({
      serviceGroupId: selectedServiceGroupId,
      serviceGroupName: selectedServiceGroup?.name
    });
  }

  getServiceGroups(serviceGroups: IServiceGroup[]) : void{
    this.serviceGroups = serviceGroups;
  }

  viewAllServices() : void{
    this.router.navigate(['main/master/allServices']);
  }


  private _filterTaxClass(value: string): ITaxClass[] {
    
    //filter value will be null in new and actual value in edit mode.
    const filterValue = !!value ? value.toLowerCase() : '';

    if(filterValue.length == 0) {
      this.serviceForm.patchValue({
        taxClassId: null
      });
    }

    return this.taxClasses.filter(option => option.name!.toLowerCase().includes(filterValue));
  }


  private _filterPurchaseAccounts(value: string): ILedger[] {
    
    //filter value will be null in new and actual value in edit mode.
    const filterValue = !!value ? value.toLowerCase() : '';

    if(filterValue.length == 0) {
      this.serviceForm.patchValue({
        purchaseAccountId: null
      });
    }

    return this.purchaseAccountLedgers.filter(option => option.name!.toLowerCase().includes(filterValue));
  }

  saveService() : void{
    this.serviceForm.markAllAsTouched();

    if(this.serviceForm.valid) {

      if(this.serviceForm.controls["id"].value) {
        this.serviceApi.update(this.serviceForm.getRawValue()).subscribe({
          next: (data) => {
            this.viewAllServices();
          }
        });
      }else{
        this.serviceApi.save(this.serviceForm.getRawValue()).subscribe({
          next: (data) => {
            this.viewAllServices();
          }
        });
      }

    }
  }
  
}
