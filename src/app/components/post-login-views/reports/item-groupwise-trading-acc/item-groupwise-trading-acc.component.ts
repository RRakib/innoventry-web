import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import {
  PLedger,
  TradingItemReportServiceService,
  TradingItemReportLine,
  TradingItemReportArgument,
  TradingItemReportServiceGetReportAsFile,
  ItemGroupWiseTradingAccountReportServiceService,
  ItemGroupWiseTradingAccountReportArgument,
  ItemGroupWiseTradingAccountReportServiceGetReportAsFile,
  ItemGroupWiseTradingAccountReportLine, ItemGroupWiseTradingAccountReport
} from 'src/server';
import { InActiveLedgersReportServiceService } from 'src/server/api/inActiveLedgersReportService.service';

@Component({
  selector: 'app-trading-item-report',
  templateUrl: './item-groupwise-trading-acc.component.html',
  styleUrls: ['./item-groupwise-trading-acc.component.css']
})
export class ItemGroupwiseTradingAccComponent implements OnInit, AfterViewInit {

  public startDate!: FormControl;
  public endDate!: FormControl;
  public showItem = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isFormLoaded: boolean = false;
  tradingItemReport: TradingItemReportLine[];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['' +
    'item',
    'openingQty',
    'openingValue',
    'purchaseQty',
    'purchaseValue',
    'salesQty',
    'salesValue',
    'closingQty',
    'closingValue',
    'profit',
  ];
  responseReport:ItemGroupWiseTradingAccountReport | null  = null;
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: any = MatPaginator;


  constructor(
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private overlayService: OverlayService,
    private customDateAdapterService: CustomDateAdapterService,
    private itemGroupWiseTradingAccService: ItemGroupWiseTradingAccountReportServiceService,
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

    let reportArgument: ItemGroupWiseTradingAccountReportArgument = {};
    this.dataSource.data = [];
    this.responseReport = null;

    reportArgument.dateFrom = this.startDate.value;
    reportArgument.dateTo = this.endDate.value;
    reportArgument.btnShowItem = this.showItem;

    this.overlayService.enableProgressSpinner();
    this.itemGroupWiseTradingAccService.getReportArg(reportArgument).subscribe({
      next: (data) => {
        this.responseReport = data;
        this.dataSource.data = data.reportLines || [];
        this.overlayService.disableProgressSpinner();
      },
      error: (err) => {
        this.overlayService.disableProgressSpinner();
      }
    });
  }

  download(type: string) : void {

    let model: ItemGroupWiseTradingAccountReportServiceGetReportAsFile  = {};
    model.type = type as ItemGroupWiseTradingAccountReportServiceGetReportAsFile .TypeEnum;

    let reportArgument: TradingItemReportArgument = {};
    reportArgument.dateFrom = this.startDate.value;
    reportArgument.dateTo = this.endDate.value;
    reportArgument.btnShowOnlyWithNegativeProfit = this.showItem;

    model.arg = reportArgument;

    this.itemGroupWiseTradingAccService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == ItemGroupWiseTradingAccountReportServiceGetReportAsFile .TypeEnum.PDF
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
}

}
