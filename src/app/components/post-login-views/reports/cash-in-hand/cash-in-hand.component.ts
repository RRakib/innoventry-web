import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { CashInHandReportInput, CashInHandReportLine, CashInHandReportServiceService } from 'src/server';
import { FormControl } from '@angular/forms';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { CashInHandReportServiceGetReportAsFile } from 'src/server/model/cashInHandReportServiceGetReportAsFile';

@Component({
  selector: 'app-cash-in-hand',
  templateUrl: './cash-in-hand.component.html',
  styleUrls: ['./cash-in-hand.component.css']
})
export class CashInHandComponent implements OnInit, AfterViewInit{

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['date', 
    'openingBalance', 
    'debit', 
    'credit',
    'todayBalance',
    'closingBalance'
  ];

  /** Below section for variables in search criteria */
  public startDate!: FormControl;
  public endDate!: FormControl;
  private cashInHandReportInput!: CashInHandReportInput;  

  public totalDebitAmount: number | undefined;
  public  totalCreditAmount: number | undefined;
  
  dataSource = new MatTableDataSource<CashInHandReportLine>([]);

  @ViewChild(MatPaginator) paginator :any = MatPaginator;

  constructor(private breakpointObserver: BreakpointObserver, private cashInHandService : CashInHandReportServiceService, 
    private customDateAdapterService  : CustomDateAdapterService, private downloadService : DownloadService) {   

    let txDate = new Date();

    this.startDate = new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate()));
    this.endDate = new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate()));

  }

  ngOnInit(): void {    
   this.getCashInHandReport();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public getCashInHandReport() : void {
    this.cashInHandReportInput = {};
    
    this.cashInHandReportInput.dateFrom = this.startDate.value;
    this.cashInHandReportInput.dateTo = this.endDate.value;

    this.cashInHandService.getReportArg(this.cashInHandReportInput)
      .subscribe({
        next: (data) => {          
          this.dataSource.data = data.reportLines || [];
          this.totalCreditAmount = data.totalCredit;  
          this.totalDebitAmount = data.totalCredit; 
        },
        error: () => { }
      }
    );
  }

  
download(type: string) : void {

  let model: CashInHandReportServiceGetReportAsFile = {};
  model.type = type as CashInHandReportServiceGetReportAsFile.TypeEnum;
  model.arg = this.cashInHandReportInput;

  this.cashInHandService.getReportAsFile(model).subscribe({
    next: (data) => { 
      if(!!data.url) {

        let fileType =  model.type == CashInHandReportServiceGetReportAsFile.TypeEnum.PDF 
                        ? 'application/pdf' 
                        : 'application/vnd.ms-excel';

        this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
      }
    }
  });
}
}
