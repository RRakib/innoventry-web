import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, forkJoin, map, shareReplay, startWith } from 'rxjs';
import { IdName } from 'src/app/models/IdName';
import { AreaServiceService, DatabaseServiceService, IContact, IContactAddress, ILedger, ITerms, LedgerServiceService, PCity, TermsServiceService } from 'src/server';

@Component({
  selector: 'app-order-description',
  templateUrl: './order-description.component.html',
  styleUrls: ['./order-description.component.css']
})
export class OrderDescriptionComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  states: string[] = [];
  cities: PCity[] = [];
  filteredDeliveryCities : Observable<PCity[]>;
  filteredBillingCities: Observable<PCity[]>;

  @Input("orderTxForm")
  orderTxForm : FormGroup;

  availableTerms : ITerms[];
  availableAddressList : IContactAddress[] | undefined;
  addressList: any[];
  
  constructor(private breakpointObserver: BreakpointObserver, private formBuilder : FormBuilder,
    private termsService : TermsServiceService, private dataBaseService : DatabaseServiceService,    
    private areaService : AreaServiceService, private ledgerService : LedgerServiceService) { }

  ngOnInit(): void {
    this.onPageLoadHttpRequests(this.orderTxForm.controls["ledgerId"].value).subscribe({
      next:  (data) => {
        this.availableTerms = data[0]; 
        if(this.orderTxForm.controls["termsId"].value) {
          let selectedTerm = this.availableTerms.filter((lT) => lT.id == this.orderTxForm.controls["termsId"].value);
          if(!!selectedTerm && selectedTerm.length == 1) {
            this.orderTxForm.patchValue({
              termsId : selectedTerm[0].id,
              termsName: selectedTerm[0].name
            });
          }
        }

        let ledger : ILedger = data[1];
        if(!!ledger && !!ledger.contact) {
          this.availableAddressList = ledger.contact.addressList;
          this.addressList = this.convertAddressList(ledger.contact.addressList);
        }

        this.states = data[2];        

        this.getCityList();

        this.stateChangeSubscribers();
    
      }
    });   

    this.orderTxForm.controls["ledgerId"].valueChanges.subscribe({
      next: (data) => {
        this.ledgerService.findById(data).subscribe({
          next: (ledger) => {
            if(!!ledger && !!ledger.contact) {
              this.availableAddressList = ledger.contact.addressList;
              this.addressList = this.convertAddressList(ledger.contact.addressList);
            }
          }
        });
      }
    }); 
  }

  private getCityList() {
    this.areaService.getCityList("INDIA", this.orderTxForm.controls["deliveryAddressState"].value).subscribe({
      next: (data) => {
        this.cities = data;
        this.filteredDeliveryCities = this.orderTxForm.controls["deliveryAddressCity"].valueChanges.pipe(
          startWith(this.orderTxForm.controls["deliveryAddressCity"].value), map(value => this._filterDeliveryCities(value || '')));
      }
    });

    this.areaService.getCityList("INDIA", this.orderTxForm.controls["billingAddressState"].value).subscribe({
      next: (data) => {
        this.cities = data;
        this.filteredBillingCities = this.orderTxForm.controls["billingAddressCity"].valueChanges.pipe(
          startWith(this.orderTxForm.controls["billingAddressCity"].value), map(value => this._filterBillingCities(value || '')));
      }
    });
  }

  private stateChangeSubscribers() {
    this.orderTxForm.controls["deliveryAddressState"].valueChanges.subscribe({
      next: (data) => {
        this.areaService.getCityList("INDIA", data).subscribe({
          next: (data) => {
            this.cities = data;
            this.filteredDeliveryCities = this.orderTxForm.controls["deliveryAddressCity"].valueChanges.pipe(
              startWith(this.orderTxForm.controls["deliveryAddressCity"].value), map(value => this._filterDeliveryCities(value || '')));
          }
        });
      }
    });

    this.orderTxForm.controls["billingAddressState"].valueChanges.subscribe({
      next: (data) => {
        this.areaService.getCityList("INDIA", data).subscribe({
          next: (data) => {
            this.cities = data;
            this.filteredDeliveryCities = this.orderTxForm.controls["billingAddressCity"].valueChanges.pipe(
              startWith(this.orderTxForm.controls["billingAddressCity"].value), map(value => this._filterBillingCities(value || '')));
          }
        });
      }
    });
  }

  public onPageLoadHttpRequests(ledgerId : number): Observable<any[]> {    
    let termsObjects$ : Observable<ITerms[]>  = this.termsService.getObjects();      
    let ledgerObject$ : Observable<ILedger> = this.ledgerService.findById(ledgerId);
    let states$ : Observable<string[]> = this.dataBaseService.getStateList("INDIA");


    return forkJoin([termsObjects$, ledgerObject$, states$]);
  }

  public convertAddressList(availableAddressList: IContactAddress[] | undefined) : IdName[]{
    let addressList : IdName[] = [];

    if(!!availableAddressList) {
      for(var availableAddress of availableAddressList) {
        let address : IdName =  {
          id: availableAddress?.id,
          name: availableAddress.addressTypeName + ' - ' + availableAddress.contactName
        };

        addressList = [...addressList, address];
      }
    }
    
    return addressList;
  }

  onAddressSelection(address : any) : void{
    // In case if IdName is selected
    if(!!address && !!address.id) {

      let selectedAddress = this.availableAddressList?.filter((address) => address.id == address.id);
      if(!!selectedAddress && selectedAddress.length > 0) {
        this.orderTxForm.patchValue({
          deliveryAddress:  selectedAddress[0].address1,
          deliveryAddress2:  selectedAddress[0].address2,
          deliveryAddress3:  selectedAddress[0].address3
        });
      }     
    }
  }


  private _filterDeliveryCities(value: string): PCity[] {

    //filter value will be null in new and actual value in edit mode.
    const filterValue = !!value ? value.toLowerCase() : '';

    if(filterValue.length == 0) {
      this.orderTxForm.patchValue({
        deliveryAddressCity: ''
      });
    }
    return this.cities.filter(option => option.cityName!.toLowerCase().includes(filterValue));
  }

  private _filterBillingCities(value: string): PCity[] {

    //filter value will be null in new and actual value in edit mode.
    const filterValue = !!value ? value.toLowerCase() : '';

    if(filterValue.length == 0) {
      this.orderTxForm.patchValue({
        billingAddressCity: ''
      });
    }
    return this.cities.filter(option => option.cityName!.toLowerCase().includes(filterValue));
  }

  onTermSelection(term : any) : void{   
    if(!!term && !!term.id) {
      let selectedTerm : ITerms[] = this.availableTerms.filter((localTerm) => localTerm.name == term.name);
      
      if(!!selectedTerm && selectedTerm.length == 1) {
        this.orderTxForm.patchValue({
          termsId : selectedTerm[0].id,
          termsName: selectedTerm[0].name
        });
      }else{
        this.orderTxForm.patchValue({
          termsId : '',
          termsName: ''
        });
      }
    }
  }

}
