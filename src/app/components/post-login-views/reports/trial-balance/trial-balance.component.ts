import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, shareReplay, forkJoin } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { OverlayService } from 'src/app/services/overlay.service';
import { PLedger, ILedgerGroup, ICity } from 'src/server';
import { CityServiceService } from 'src/server/api/cityService.service';
import { LedgerGroupServiceService } from 'src/server/api/ledgerGroupService.service';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialBalanceComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  reportForm: FormGroup;
  isFormLoaded: boolean = false;
  ledger: PLedger;
  ledgerGroups : ILedgerGroup[];
  cities: ICity[];


  constructor(private breakpointObserver: BreakpointObserver, private formBuilder : FormBuilder,
    private overlayService :OverlayService, private customDateAdapterService  : CustomDateAdapterService,
    private ledgerGroupService : LedgerGroupServiceService, private cityServiceApi : CityServiceService) { }

  ngOnInit(): void {
    let txDate = new Date();

    this.overlayService.enableProgressSpinner();

    this.onPageLoadHttpRequests().subscribe({
      next: (data) => {
        this.ledgerGroups = data[0];
        this.cities = data[1];

        this.reportForm = this.formBuilder.group({          
          filterLedgerGroupId: new FormControl(),
          city: new FormControl(),
          date: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())) 
        });
    
        this.isFormLoaded = true;
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
    let cityObject$ : Observable<ICity[]> = this.cityServiceApi.getObjects();

    return forkJoin([ledgerGroupObjects$, cityObject$]);
  }

  showReport() : void{
    
  }
}
