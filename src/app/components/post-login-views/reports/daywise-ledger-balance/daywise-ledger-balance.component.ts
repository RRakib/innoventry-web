import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { DayWiseLedgerBalanceReportLine, DayWiseLedgerBalanceReportServiceGetReportAsFile, OutstandingReportLine, PLedgerMaster } from 'src/server';
import { DayWiseLedgerBalanceReportServiceService } from 'src/server/api/dayWiseLedgerBalanceReportService.service';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';

@Component({
  selector: 'app-daywise-ledger-balance',
  templateUrl: './daywise-ledger-balance.component.html',
  styleUrls: ['./daywise-ledger-balance.component.css']
})
export class DaywiseLedgerBalanceComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  dayWiseLedgerReportForm: FormGroup;
  isFormLoaded: boolean = false;

   /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
   displayedColumns = ['date', 
   'openingBalance', 
   'debit', 
   'credit',
   'netBalance',
   'closingBalance'
  ];
  dataSource = new MatTableDataSource<DayWiseLedgerBalanceReportLine>([]); 
  @ViewChild(MatPaginator) paginator :any = MatPaginator; 

  constructor(private breakpointObserver: BreakpointObserver, private formBuilder : FormBuilder,
    private overlayService :OverlayService,  private customDateAdapterService  : CustomDateAdapterService,
    private ledgerServiceApi : LedgerServiceService, private daywiseLedgerBalanceService : DayWiseLedgerBalanceReportServiceService,
    private downloadService : DownloadService) { }

  ngOnInit(): void {

    let txDate = new Date();

    this.overlayService.enableProgressSpinner();

    this.dayWiseLedgerReportForm = this.formBuilder.group({
      ledgerId: new FormControl(),
      ledgerName: new FormControl(),
      dateFrom : new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
      dateTo: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),      
      showZeroBalance: new FormControl(true)
    });

    this.isFormLoaded = true;
    this.overlayService.disableProgressSpinner();
  }

  onLedgerSelection(selectedLedger : PLedgerMaster) {
    this.dayWiseLedgerReportForm.patchValue({
      ledgerId : selectedLedger.id,
      ledgerName: selectedLedger.name
    });
  }

  getDayWiseLedgerBalanceReport() : void{

    this.overlayService.enableProgressSpinner();

    this.daywiseLedgerBalanceService.getReportArg(this.dayWiseLedgerReportForm.value).subscribe({
      next: (data) => {
        this.dataSource.data = data.reportLines || [];
        this.overlayService.disableProgressSpinner();
      }
    });
  }
  
  
download(type: string) : void {

  let model: DayWiseLedgerBalanceReportServiceGetReportAsFile = {};
  model.type = type as DayWiseLedgerBalanceReportServiceGetReportAsFile.TypeEnum;
  model.arg = this.dayWiseLedgerReportForm.value;

  this.daywiseLedgerBalanceService.getReportAsFile(model).subscribe({
    next: (data) => { 
      if(!!data.url) {

        let fileType =  model.type == DayWiseLedgerBalanceReportServiceGetReportAsFile.TypeEnum.PDF 
                        ? 'application/pdf' 
                        : 'application/vnd.ms-excel';

        this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
      }
    }
  });
}
}
