import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay, forkJoin } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { ICity, ILedgerGroup, OutstandingReportLine, OutstandingReportServiceGetReportAsFile, PLedger } from 'src/server';
import { CityServiceService } from 'src/server/api/cityService.service';
import { LedgerGroupServiceService } from 'src/server/api/ledgerGroupService.service';
import { OutstandingReportServiceService } from 'src/server/api/outstandingReportService.service';

@Component({
  selector: 'app-outstandings-report',
  templateUrl: './outstandings-report.component.html',
  styleUrls: ['./outstandings-report.component.css']
})
export class OutstandingsReportComponent implements OnInit, AfterViewInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  outstandingsReportForm: FormGroup;
  isFormLoaded: boolean = false;
  ledger: PLedger;
  ledgerGroups : ILedgerGroup[];
  cities: ICity[];

  dataSource = new MatTableDataSource<OutstandingReportLine>([]); 
  @ViewChild(MatPaginator) paginator :any = MatPaginator; 

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['ledger', 
   'phoneNo', 
   'city', 
   'currentBalance'
  ];

  constructor(private breakpointObserver: BreakpointObserver, private formBuilder : FormBuilder,
    private overlayService :OverlayService, private customDateAdapterService  : CustomDateAdapterService,
    private ledgerGroupService : LedgerGroupServiceService, private cityServiceApi : CityServiceService,
    private outstandingsReportService: OutstandingReportServiceService, private downloadService : DownloadService) { }

  ngOnInit(): void {
    let txDate = new Date();

    this.overlayService.enableProgressSpinner();

    this.onPageLoadHttpRequests().subscribe({
      next: (data) => {
        this.ledgerGroups = data[0];
        this.cities = data[1];

        this.outstandingsReportForm = this.formBuilder.group({
          type: new FormControl('Receivable'),
          date: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
          group: new FormControl(Validators.required),
          city: new FormControl(),
          outstandingBalanceTo: new FormControl(),
          outstandingBalancefrom: new FormControl()
        });
    
        this.isFormLoaded = true;
        this.overlayService.disableProgressSpinner();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
    this.outstandingsReportForm.markAllAsTouched();

    if(this.outstandingsReportForm.valid) {

      this.overlayService.enableProgressSpinner();
      this.outstandingsReportService.getReportArg(this.outstandingsReportForm.value).subscribe({
        next: (data) => {
          this.dataSource.data = data.outstandingReportLines || [];

          this.overlayService.disableProgressSpinner();
        }
      });

    }
  }

  resetSearchForm() : void{
    this.outstandingsReportForm.reset();
  }

  download(type: string) : void {

    let model: OutstandingReportServiceGetReportAsFile  = {};
    model.type = type as OutstandingReportServiceGetReportAsFile.TypeEnum;
    model.arg = this.outstandingsReportForm.value;

    this.outstandingsReportService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == OutstandingReportServiceGetReportAsFile.TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }
}
