import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { LedgerPurchaseSummaryReportLineByIndex } from 'src/app/models/LedgerPurchaseSummaryReportLineByIndex';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { LedgerPurchaseSummaryReportArgument, LedgerPurchaseSummaryReportLine, LedgerPurchaseSummaryReportServiceGetReportAsFile, PLedgerMaster } from 'src/server';
import { LedgerPurchaseSummaryReportServiceService } from 'src/server/api/ledgerPurchaseSummaryReportService.service';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';

@Component({
  selector: 'app-ledger-purchase-summary',
  templateUrl: './ledger-purchase-summary.component.html',
  styleUrls: ['./ledger-purchase-summary.component.css']
})
export class LedgerPurchaseSummaryComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  public purchaseSummaryForm!: FormGroup;
  isFormLoaded : boolean = false;

  purchaseSummaryReportArg: LedgerPurchaseSummaryReportArgument;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['itemName', 
    'qty', 
    'unitDisplayName', 
    'amount'
  ];

  dataSource = new MatTableDataSource<LedgerPurchaseSummaryReportLine>([]);  
  reportLines : LedgerPurchaseSummaryReportLineByIndex[];
  @ViewChild(MatPaginator) paginator :any = MatPaginator;

  selectedItem : LedgerPurchaseSummaryReportLine | undefined;  
  selectedRowIndex = -1;  
  
  constructor(private breakpointObserver: BreakpointObserver,private customDateAdapterService  : CustomDateAdapterService,
    private formBuilder: FormBuilder, private ledgerSaleSummaryReportService : LedgerPurchaseSummaryReportServiceService,
    private ledgerService : LedgerServiceService, private overlayService : OverlayService, private downloadService : DownloadService) { 
      let txDate = new Date();
      this.reportLines = [];
  
      this.overlayService.enableProgressSpinner();
  
      this.ledgerService.getCashLedger().subscribe({
        next: (data) => {
          this.purchaseSummaryForm = this.formBuilder.group({
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
      this.getPurchaseSummaryReport();
    }
  
    
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    } 
  
    onFromLedgerSelection(selectedLedger: PLedgerMaster) : void {
  
      this.ledgerService.findById(selectedLedger.id).subscribe({
        next: (data) => {
          this.purchaseSummaryForm.patchValue({
            ledger: data,
            ledgerId: selectedLedger.id,
            ledgerName: selectedLedger.name
          });
        }
      });
    }

    getPurchaseSummaryReport() : void{
      this.reportLines = [];
      this.selectedRowIndex = -1;
  
      this.overlayService.enableProgressSpinner();
      this.ledgerSaleSummaryReportService.getReportArg(this.purchaseSummaryForm.value).subscribe({
        next: (data) => {
          data.reportLines?.forEach((element, index) => {
            let reportLineData : LedgerPurchaseSummaryReportLineByIndex  = element;
            reportLineData.rowId = index + 1;
  
            this.reportLines.push(reportLineData);
          });
          this.dataSource.data = this.reportLines || [];
  
          this.overlayService.disableProgressSpinner();
        }
      });
    }

    download(type: string) : void {

      let model: LedgerPurchaseSummaryReportServiceGetReportAsFile  = {};
      model.type = type as LedgerPurchaseSummaryReportServiceGetReportAsFile .TypeEnum;
      model.arg = this.purchaseSummaryForm.value;
  
      this.ledgerSaleSummaryReportService.getReportAsFile(model).subscribe({
        next: (data) => { 
          if(!!data.url) {
  
            let fileType =  model.type == LedgerPurchaseSummaryReportServiceGetReportAsFile.TypeEnum.PDF 
                            ? 'application/pdf' 
                            : 'application/vnd.ms-excel';
  
            this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
          }
        }
      });
    }
}
