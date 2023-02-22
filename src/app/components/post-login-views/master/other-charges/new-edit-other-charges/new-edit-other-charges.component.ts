import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, map, shareReplay, forkJoin, startWith } from 'rxjs';
import { OverlayService } from 'src/app/services/overlay.service';
import { ILedger, ILedgerGroup, IOtherCharges } from 'src/server';
import { LedgerGroupServiceService } from 'src/server/api/ledgerGroupService.service';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';
import { OtherChargesServiceService } from 'src/server/api/otherChargesService.service';

@Component({
  selector: 'app-new-edit-other-charges',
  templateUrl: './new-edit-other-charges.component.html',
  styleUrls: ['./new-edit-other-charges.component.css']
})
export class NewEditOtherChargesComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  public otherChargesForm: FormGroup;
  isFormLoaded : boolean = false;
  otherCharges: IOtherCharges;


  //Available Accounts with auto-complete
  availableAccountLedgers : ILedger[];
  filteredAvailableAccountLedgers : Observable<ILedger[]>;
  

  constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder,
    private overlayService : OverlayService,
    private router: Router,
    private route: ActivatedRoute,
    private otherChargesApi : OtherChargesServiceService,
    private ledgerService : LedgerServiceService,
    private ledgerGroupService : LedgerGroupServiceService) { }

  ngOnInit(): void {
    this.otherCharges = {};

    this.route.params.subscribe(params => { 
      if (params['chargesId']) {
        this.overlayService.enableProgressSpinner();

            this.otherChargesApi.findById(params['chargesId']).subscribe({
              next: (data) => {
                this.otherCharges = data;
                this.initializeOtherChargesForm();
                this.doPageLoadRequests();
                this.isFormLoaded = true;
              }
            });
      }else{
        this.initializeOtherChargesForm();
        this.doPageLoadRequests();
        this.isFormLoaded = true;        
      }
    });
  }

  /**
   * This function subscribe all the on page load HTTP Requests.
   */
   private doPageLoadRequests() {
    this.onPageLoadHttpRequests().subscribe({
      next: (data) => {
        this.getAvailableAccounts(data[0], data[1]);
        this.isFormLoaded = true; 
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
    let ledgerObjects$ : Observable<ILedger[]> = this.ledgerService.getObjects();
    let ledgerGroupObjects$ : Observable<ILedgerGroup[]> = this.ledgerGroupService.getObjects();
    

    return forkJoin([ ledgerObjects$, ledgerGroupObjects$]);
  }

  private initializeOtherChargesForm() {
    this.otherChargesForm = this.formBuilder.group({
      jacksontype: 'OtherChargesImpl',
      id: new FormControl(this.otherCharges.id),
      name: new FormControl(this.otherCharges.name, [Validators.required]),    
      type: new FormControl(this.otherCharges.type),
      value: new FormControl([Validators.required]),
      description: new FormControl(this.otherCharges.description),
      ledgerId: new FormControl(this.otherCharges.ledgerId),
      ledgerName: new FormControl(this.otherCharges.ledgerName),
      discount: new FormControl()
    });

    if(this.otherCharges.discount) {
      this.otherChargesForm.patchValue({
        discount: 'true'
      });

      if(!!this.otherCharges.value) {
        this.otherChargesForm.patchValue({
          value: Math.abs(this.otherCharges.value)
        });
      }
    }else{
      this.otherChargesForm.patchValue({
        discount: 'false',
        value: this.otherCharges.value
      });
    }

    this.isFormLoaded = true;
  }


  /**
   * This function updates the available ledger selection changed.
   * @param event 
   */
   onAvailableLedgerSelectionChanged(event : MatAutocompleteSelectedEvent) : void{
    const filterValue = event.option.value.toLowerCase();

    let availableAccount  = this.availableAccountLedgers.find((availableAccount) => availableAccount.name?.toLowerCase().includes(filterValue));

    if(!!availableAccount){
      this.otherChargesForm.patchValue({
        ledgerId: availableAccount.id,
        ledgerName: availableAccount.name
      });
    }
  }


   /**
   * This function fetches all the available purchase accounts.
   * @param ledgers : All Ledgers
   * @param ledgerGroups : All Ledger Groups
  */
  private getAvailableAccounts(ledgers : ILedger[], ledgerGroups : ILedgerGroup[]) : void{

    // Get unique ledger group names
    let uniqueLedgerGroupNames : (string | undefined)[] = ledgers.map((ledger) => {
      return ledger.ledgerGroupName
    })
    .filter((ledgerGroupName, index, self) => self.indexOf(ledgerGroupName) === index);

    // Get unique expenses ledger group names.
    let incomeExpensesLedgerGroupNames = ledgerGroups.filter((ledgerGroup) => ledgerGroup.type === ILedgerGroup.TypeEnum.INCOME 
                                                                      || ledgerGroup.type === ILedgerGroup.TypeEnum.EXPENSES)
            .filter((expensesLedgerGroup) =>  uniqueLedgerGroupNames.includes(expensesLedgerGroup.name))
            .map((expensesLedgerGroup) =>{
              return expensesLedgerGroup.name;
            });

    // Filter all ledger with unique expenses ledger groups.
    this.availableAccountLedgers = ledgers.filter((ledger) => incomeExpensesLedgerGroupNames.includes(ledger.ledgerGroupName));

    // Bind the autocomplete purchase accounts control with purchase accounts.
    this.filteredAvailableAccountLedgers = this.otherChargesForm.controls["ledgerName"].valueChanges
      .pipe(startWith(this.otherChargesForm.controls["ledgerName"].value), map(value => this._filterAvailableAccounts(value || '')));

  }

  private _filterAvailableAccounts(value: string): ILedger[] {
    
    //filter value will be null in new and actual value in edit mode.
    const filterValue = !!value ? value.toLowerCase() : '';

    if(filterValue.length == 0) {
      this.otherChargesForm.patchValue({
        purchaseAccountId: null
      });
    }

    return this.availableAccountLedgers.filter(option => option.name!.toLowerCase().includes(filterValue));
  }


  viewAllOtherCharges() : void{
    this.router.navigate(['main/master/allOtherCharges']);
  }

  saveOtherCharge(): void {

    this.otherChargesForm.markAllAsTouched();
    
    if(this.otherChargesForm.valid) {

      if(this.otherChargesForm.controls["discount"].value == 'true') {
        this.otherChargesForm.patchValue({
          discount: true,
          value: -(this.otherChargesForm.controls["value"].value)
        });
      }else{
        this.otherChargesForm.patchValue({
          discount: false,
        })
      }

      if(!!this.otherChargesForm.controls["id"].value) {
        
        this.otherChargesApi.update(this.otherChargesForm.getRawValue()).subscribe({
          next: (data) => {
            this.viewAllOtherCharges();
          }
        });
      }else{
        this.otherChargesApi.save(this.otherChargesForm.getRawValue()).subscribe({
          next: (data) => {
            this.viewAllOtherCharges();
          }
        });
      }
    }    
  }
}
