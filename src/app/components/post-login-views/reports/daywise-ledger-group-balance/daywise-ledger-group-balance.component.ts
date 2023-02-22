import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { PLedger, ILedgerGroup, DayWiseLedgerGroupBalanceReportLine, DayWiseLedgerGroupBalanceReportServiceGetReportAsFile } from 'src/server';
import { DayWiseLedgerGroupBalanceReportServiceService } from 'src/server/api/dayWiseLedgerGroupBalanceReportService.service';
import { LedgerGroupServiceService } from 'src/server/api/ledgerGroupService.service';

@Component({
  selector: 'app-daywise-ledger-group-balance',
  templateUrl: './daywise-ledger-group-balance.component.html',
  styleUrls: ['./daywise-ledger-group-balance.component.css']
})
export class DaywiseLedgerGroupBalanceComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  dayWiseLedgerGroupReportForm: FormGroup;
  isFormLoaded: boolean = false;

   /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
   displayedColumns = ['date', 
   'debit', 
   'credit',
   'balance'
  ];
  
  ledgerGroups : ILedgerGroup[];

  dataSource = new MatTableDataSource<DayWiseLedgerGroupBalanceReportLine>([]); 
  @ViewChild(MatPaginator) paginator :any = MatPaginator; 

  constructor(private breakpointObserver: BreakpointObserver, private formBuilder : FormBuilder,
    private overlayService :OverlayService,  private customDateAdapterService  : CustomDateAdapterService,
    private ledgerGroupService : LedgerGroupServiceService,private daywiseLedgerGroupService : DayWiseLedgerGroupBalanceReportServiceService,
    private downloadService : DownloadService) { }

  ngOnInit(): void {

    let txDate = new Date();

    this.overlayService.enableProgressSpinner();

    this.ledgerGroupService.getObjects().subscribe({
      next: (data) => {
        this.ledgerGroups = data;

        this.dayWiseLedgerGroupReportForm = this.formBuilder.group({
          ledgerGroup: new FormControl(),
          dateFrom:  new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
          dateTo:  new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
          showZeroBalance: new FormControl(true)
        });

        this.overlayService.disableProgressSpinner();
        this.isFormLoaded = true;

      }
    });
  }


  getDayWiseLedgerGroupBalanceReport() : void{
    this.overlayService.enableProgressSpinner();

    this.daywiseLedgerGroupService.getReportArg(this.dayWiseLedgerGroupReportForm.value).subscribe({
      next: (data) => {
        this.dataSource.data = data.reportLines || [];
        this.overlayService.disableProgressSpinner();
      }
    });
  }

  download(type: string) : void {

    let model: DayWiseLedgerGroupBalanceReportServiceGetReportAsFile = {};
    model.type = type as DayWiseLedgerGroupBalanceReportServiceGetReportAsFile.TypeEnum;
    model.arg = this.dayWiseLedgerGroupReportForm.value;

    this.daywiseLedgerGroupService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == DayWiseLedgerGroupBalanceReportServiceGetReportAsFile.TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
}


}
