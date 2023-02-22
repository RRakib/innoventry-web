import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, map, shareReplay, forkJoin, startWith } from 'rxjs';
import { OverlayService } from 'src/app/services/overlay.service';
import { ILedgerGroup, PCity, PCountry, PLedger, PState } from 'src/server';
import { AreaServiceService } from 'src/server/api/areaService.service';
import { LedgerGroupServiceService } from 'src/server/api/ledgerGroupService.service';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';
import { StateServiceService } from 'src/server/api/stateService.service';

@Component({
  selector: 'app-new-edit-ledger',
  templateUrl: './new-edit-ledger.component.html',
  styleUrls: ['./new-edit-ledger.component.css']
})
export class NewEditLedgerComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  public ledgerForm: FormGroup;
  isFormLoaded : boolean = false;

  ledgerType : string = 'Ledger'; // Ledger, Customer , Supplier

  ledger: PLedger;
  ledgerGroups : ILedgerGroup[];

  countries : PCountry[];
  states: PState[] = [];
  cities: PCity[] = [];
  filteredCities : Observable<PCity[]>;


  gstinPattern = "^([0][1-9]|[1-2][0-9]|[3][0-5])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$";
  panPattern = /^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/;


  constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder,
    private overlayService : OverlayService,
    private router: Router,
    private route: ActivatedRoute,
    private ledgerServiceApi : LedgerServiceService,
    private ledgerGroupService : LedgerGroupServiceService,
    private areaService : AreaServiceService,
    private stateService : StateServiceService) { }

  ngOnInit(): void {
    this.ledger = {};

    this.cities = [];

    this.overlayService.enableProgressSpinner();

    this.onPageLoadHttpRequests().subscribe({
      next: (data) => {

        this.ledgerGroups = data[0];
        this.countries = data[1];
        
        this.route.params.subscribe(params => { 
          if (params['ledgerId']) {

            this.ledgerServiceApi.getPLedgerFromId(params['ledgerId']).subscribe({
              next: (data) => {
                this.ledger = data;
                this.initializeLedgerForm();                
              }
            });
                
          }else{
            this.initializeLedgerForm();

            let sundryDrCrLedgerGroup : ILedgerGroup | undefined = {};
            this.ledgerType = params['type'];
            if(['ledger','customer'].includes(this.ledgerType)) {
              sundryDrCrLedgerGroup = this.ledgerGroups.find((ledgerGroup) => ledgerGroup.name == 'Sundry Debtors');   
              this.ledgerForm.patchValue({                
                openingBalType: 'DR'
              });           
            }else{
              sundryDrCrLedgerGroup = this.ledgerGroups.find((ledgerGroup) => ledgerGroup.name == 'Sundry Creditors');
              this.ledgerForm.patchValue({                
                openingBalType: 'CR'
              });
            }

            if(!!sundryDrCrLedgerGroup) {
              this.ledgerForm.patchValue({
                ledgerGroupId: sundryDrCrLedgerGroup.id,
                ledgerGroupName: sundryDrCrLedgerGroup.name
              });
            }
            
          }
        });
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
    let ledgerGroupObjects$ : Observable<ILedgerGroup[]>  = this.ledgerGroupService.getObjects();
    let countries$ : Observable<PCountry[]> = this.areaService.getCountryList();

    return forkJoin([ledgerGroupObjects$, countries$]);
  }

  private initializeLedgerForm() : void{
    this.ledgerForm = this.formBuilder.group({
      id: new FormControl(this.ledger.id),
      name: new FormControl({value : this.ledger.name, disabled: this.ledger.systemGenerated} , [Validators.required]),
      printName: new FormControl(this.ledger.printName , [Validators.required]),
      ledgerGroupId : new FormControl(this.ledger.ledgerGroupId),
      ledgerGroupName : new FormControl(this.ledger.ledgerGroupName),
      openingBal: new FormControl(!!this.ledger.openingBal && this.ledger.openingBal < 0 ? 
        Math.abs(this.ledger.openingBal) : 
        this.ledger.openingBal),
      openingBalType: new FormControl(!!this.ledger.openingBal && this.ledger.openingBal < 0 ? 'DR' : 'CR'),
      bankName: new FormControl(this.ledger.bankName),
      branchName: new FormControl(this.ledger.branchName),
      bankIfscCode: new FormControl(this.ledger.bankIfscCode),
      bankAcNo: new FormControl(this.ledger.bankAcNo),
      gstin: new FormControl(this.ledger.gstin, [Validators.pattern(this.gstinPattern)]),
      //gstin: new FormControl(this.ledger.gstin), // Un-comment this for testing purpose.
      gstType: new FormControl(!!this.ledger.gstType ? this.ledger.gstType : 'Unregistered'),
      panNumber: new FormControl(this.ledger.panNumber, [Validators.pattern(this.panPattern)]),
      email: new FormControl(this.ledger.panNumber),      
      countryName: new FormControl("India"),
      stateId: new FormControl(this.ledger.stateId),
      stateName: new FormControl(this.ledger.stateName),
      cityId: new FormControl(this.ledger.cityId),
      cityName: new FormControl(this.ledger.cityName),
      mobile: new FormControl(this.ledger.mobile, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      alternateNo1: new FormControl(this.ledger.alternateNo1, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      faxNo: new FormControl(this.ledger.faxNo),
    });

    // Load default states of selected country
    this.areaService.getStateList(this.ledgerForm.controls["countryName"].value).subscribe({
      next: (data) => {
        this.states = data;
      }
    });

    // Load default cities of selected country and selected state
    // It will work in edit mode.
    if(!!this.ledgerForm.controls["countryName"].value && !!this.ledgerForm.controls["stateName"].value) {    
      this.areaService.getCityList(this.ledgerForm.controls["countryName"].value, this.ledgerForm.controls["stateName"].value).subscribe({
        next: (data) => {
          this.cities = data;
          this.filteredCities = this.ledgerForm.controls["cityName"].valueChanges.pipe(startWith(this.ledgerForm.controls["cityName"].value), map(value => this._filterCities(value || '')));
        }
      });
    }

    // Update Country name as per the selected state.
    if(!!this.ledgerForm.controls["stateName"].value) {
      this.stateService.findByName(this.ledgerForm.controls["stateName"].value).subscribe({
        next: (data) => {
          if(!!data && !!data.id) {
            this.ledgerForm.patchValue({
              countryName: data.countryName
            });
          }
        }
      });
    }

    this.ledgerForm.controls["countryName"].valueChanges.subscribe({
      next: (data) => {
        this.areaService.getStateList(data).subscribe({
          next: (data) => {
            this.states = data;
          }
        });
      }
    });

    this.ledgerForm.controls["stateId"].valueChanges.subscribe({
      next: (data) => {
        let selectedState = this.states.find((state) => state.stateId == data);
        this.ledgerForm.controls["cityName"].setValue("");
        this.areaService.getCityList(this.ledgerForm.controls["countryName"].value, selectedState?.stateName).subscribe({
          next: (data) => {
            this.cities = data;

            this.filteredCities = this.ledgerForm.controls["cityName"].valueChanges.pipe(startWith(this.ledgerForm.controls["cityName"].value), map(value => this._filterCities(value || '')));
          }
        });
      }
    });

    
    
    this.overlayService.disableProgressSpinner();
    this.isFormLoaded = true;
  }

   /**
   * This function is executed when user enters any text for searching item groups.
   * The input element is bind with valueChanges event in function getItemGroups()
   * @param value User Input
   * @returns 
   */
  private _filterCities(value: string): PCity[] {

    //filter value will be null in new and actual value in edit mode.
    const filterValue = !!value ? value.toLowerCase() : '';

    if(filterValue.length == 0) {
      this.ledgerForm.patchValue({
        cityId: 0
      });
    }
    return this.cities.filter(option => option.cityName!.toLowerCase().includes(filterValue));
  }

  public onCitySelectionChanged(event : MatAutocompleteSelectedEvent) { 
    const filterValue = event.option.value.toLowerCase();

    let selectedCity  = this.cities.find((city) => city.cityName?.toLowerCase().includes(filterValue));

    if(!!selectedCity){
      this.ledgerForm.patchValue({
        cityId: selectedCity.citytId,
        cityName: selectedCity.cityName
      });
    }
  }


  viewAllLedgers() : void{
    this.router.navigate(['main/master/allLedgers']);
  }

  saveLedger(): void {

    this.ledgerForm.markAllAsTouched();

    if(this.ledgerForm.valid) {

      if(this.ledgerForm.controls["openingBalType"].value === 'DR') {

        this.ledgerForm.patchValue({
          openingBal : 0 - this.ledgerForm.controls["openingBal"].value
        });
      }

      this.ledgerForm.removeControl("openingBalType");
      this.ledgerForm.removeControl("countryName");

      this.ledgerServiceApi.savePLedger(this.ledgerForm.getRawValue()).subscribe({
        next: (data) => {
          this.viewAllLedgers();
        }
      });
    }    
  }
}
