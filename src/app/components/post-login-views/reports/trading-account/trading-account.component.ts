import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {map, Observable, shareReplay} from 'rxjs';
import {CustomDateAdapterService} from 'src/app/services/date-adaptor';
import {DownloadService} from 'src/app/services/download.service';
import {OverlayService} from 'src/app/services/overlay.service';
import {
  DateIntervalReportArgument,
  TradingAccountReportLine, TradingAccountReportServiceGetReportAsFile,
  TradingAccountReportServiceService,
  TradingItemReportArgument,
  TradingItemReportServiceGetReportAsFile
} from 'src/server';

@Component({
  selector: 'app-trading-item-report',
  templateUrl: './trading-account.component.html',
  styleUrls: ['./trading-account.component.css']
})
export class TradingAccountComponent implements OnInit, AfterViewInit {

  public startDate!: FormControl;
  public endDate!: FormControl;
  public showItem = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isFormLoaded: boolean = false;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['' +
    'name',
    'balance',
    'groupBalance',
  ];
  dataSource = new MatTableDataSource<any>([]);
  dataSource2 = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: any = MatPaginator;


  constructor(
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private overlayService: OverlayService,
    private customDateAdapterService: CustomDateAdapterService,
    private tradingAccountReportService: TradingAccountReportServiceService,
    private downloadService : DownloadService) {
    let txDate = new Date();
    this.startDate = new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate()));
    this.endDate = new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate()));
  }

  ngOnInit(): void {
    let txDate = new Date();

    // this.showReport();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  showReport(): void {

    let reportArgument: DateIntervalReportArgument = {};
    this.dataSource.data = [];
    this.dataSource2.data = [];

    reportArgument.dateFrom = this.startDate.value;
    reportArgument.dateTo = this.endDate.value;
    reportArgument.showAccountWithZeroBalance = this.showItem;

    this.overlayService.enableProgressSpinner();
    this.tradingAccountReportService.getReportArg(reportArgument).subscribe({
      next: (data) => {
        data.assetsReportLines?.length ? data.assetsReportLines?.forEach(item => {
          this.dataSource.data = [...this.dataSource.data, {group: item.group, groupBalance: item.groupBalance}, ...item.detailReportLines]
        }) : this.dataSource.data = [];

        data.liabilitiesReportLines?.length ? data.liabilitiesReportLines?.forEach(item => {
          this.dataSource2.data = [...this.dataSource2.data, {group: item.group, groupBalance: item.groupBalance}, ...item.detailReportLines]
        }) : this.dataSource2.data = [];
        this.overlayService.disableProgressSpinner();
      },
      error: (err) => {
        this.overlayService.disableProgressSpinner();
      }
    });
  }

  processData(data: any, name: string | null = null): any {
    switch(name) {
      case 'name':
        return data.hasOwnProperty('ledgerPrintName') ? data.ledgerPrintName : data.group;
      case 'balance':
        return data.hasOwnProperty('ledgerBalance') ? data.ledgerBalance : '';
      case 'groupBalance':
        return data.hasOwnProperty('groupBalance') ? data.groupBalance : '';
    }
    return data;
  }

  download(type: string) : void {

    let model: TradingAccountReportServiceGetReportAsFile  = {};
    model.type = type as TradingAccountReportServiceGetReportAsFile .TypeEnum;

    let reportArgument: TradingItemReportArgument = {};
    reportArgument.dateFrom = this.startDate.value;
    reportArgument.dateTo = this.endDate.value;
    reportArgument.btnShowOnlyWithNegativeProfit = this.showItem;

    model.arg = reportArgument;

    this.tradingAccountReportService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == TradingAccountReportServiceGetReportAsFile .TypeEnum.PDF
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
}

}
