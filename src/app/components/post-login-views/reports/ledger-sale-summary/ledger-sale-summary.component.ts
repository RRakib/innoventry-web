import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { LedgerSaleSummaryReportLineByIndex } from 'src/app/models/LedgerSaleSummaryReportLineByIndex';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { LedgerSaleSummaryReportArgument, LedgerSaleSummaryReportLine, LedgerSaleSummaryReportServiceGetReportAsFile, PLedgerMaster } from 'src/server';
import { LedgerSaleSummaryReportServiceService } from 'src/server/api/ledgerSaleSummaryReportService.service';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';

@Component({
  selector: 'app-ledger-sale-summary',
  templateUrl: './ledger-sale-summary.component.html',
  styleUrls: ['./ledger-sale-summary.component.css']
})
export class LedgerSaleSummaryComponent implements OnInit, AfterViewInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  public saleSummaryForm!: FormGroup;
  isFormLoaded : boolean = false;
  
  saleSummaryReportArg: LedgerSaleSummaryReportArgument;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['itemName', 
    'qty', 
    'unitDisplayName', 
    'amount'
  ];

  dataSource = new MatTableDataSource<LedgerSaleSummaryReportLine>([]);  
  reportLines : LedgerSaleSummaryReportLineByIndex[];
  @ViewChild(MatPaginator) paginator :any = MatPaginator;

  selectedItem : LedgerSaleSummaryReportLine | undefined;  
  selectedRowIndex = -1;  
  
  constructor(private breakpointObserver: BreakpointObserver,private customDateAdapterService  : CustomDateAdapterService,
    private formBuilder: FormBuilder, private ledgerSaleSummaryReportService : LedgerSaleSummaryReportServiceService,
    private ledgerService : LedgerServiceService, private overlayService : OverlayService, private downloadService : DownloadService) {
    let txDate = new Date();
    this.reportLines = [];

    this.overlayService.enableProgressSpinner();

    this.ledgerService.getCashLedger().subscribe({
      next: (data) => {
        this.saleSummaryForm = this.formBuilder.group({
          ledger : new FormControl(data),
          ledgerId: new FormControl(data.id),
          ledgerName : new FormControl(data.name),
          dateFrom : new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
          dateTo : new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate()))
        }); 
    
        this.isFormLoaded = true;
        this.overlayService.disableProgressSpinner();
      }
    });
   
   }

  ngOnInit(): void {
    this.getSaleSummaryReport();
  }

  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  } 

  onFromLedgerSelection(selectedLedger: PLedgerMaster) : void {

    this.ledgerService.findById(selectedLedger.id).subscribe({
      next: (data) => {
        this.saleSummaryForm.patchValue({
          ledger: data,
          ledgerId: selectedLedger.id,
          ledgerName: selectedLedger.name
        });
      }
    });    
   
  }

  getSaleSummaryReport() : void{
    this.reportLines = [];
    this.selectedRowIndex = -1;

    this.overlayService.enableProgressSpinner();
    this.ledgerSaleSummaryReportService.getReportArg(this.saleSummaryForm.value).subscribe({
      next: (data) => {
        data.reportLines?.forEach((element, index) => {
          let reportLineData : LedgerSaleSummaryReportLineByIndex  = element;
          reportLineData.rowId = index + 1;

          this.reportLines.push(reportLineData);
        });
        this.dataSource.data = this.reportLines || [];

        this.overlayService.disableProgressSpinner();
      }
    });
  }

  download(type: string) : void {

    let model: LedgerSaleSummaryReportServiceGetReportAsFile  = {};
    model.type = type as LedgerSaleSummaryReportServiceGetReportAsFile .TypeEnum;
    model.arg = this.saleSummaryForm.value;

    this.ledgerSaleSummaryReportService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == LedgerSaleSummaryReportServiceGetReportAsFile .TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }
}
