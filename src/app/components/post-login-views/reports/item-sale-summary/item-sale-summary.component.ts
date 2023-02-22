import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { ItemSaleSummaryReportLine, ItemSaleSummaryReportServiceGetReportAsFile } from 'src/server';
import { ItemSaleSummaryReportServiceService } from 'src/server/api/itemSaleSummaryReportService.service';

@Component({
  selector: 'app-item-sale-summary',
  templateUrl: './item-sale-summary.component.html',
  styleUrls: ['./item-sale-summary.component.css']
})
export class ItemSaleSummaryComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  itemSaleSummaryReportForm: FormGroup;
  isFormLoaded: boolean = false;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['item',
    'saleQuantity',
    'sampleQuantity',
    'schemeQuantity'
  ];
  dataSource = new MatTableDataSource<ItemSaleSummaryReportLine>([]);
  @ViewChild(MatPaginator) paginator: any = MatPaginator;

  totalItemQuantity : number = 0;

  constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder,
    private overlayService: OverlayService, private customDateAdapterService: CustomDateAdapterService,
    private itemSaleSummaryService : ItemSaleSummaryReportServiceService,
    private downloadService : DownloadService) { }

  ngOnInit(): void {
    let txDate = new Date();

    this.overlayService.enableProgressSpinner();
    this.itemSaleSummaryReportForm = this.formBuilder.group({
      dateFrom: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(), txDate.getMonth(), txDate.getDate())),
      dateTo: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(), txDate.getMonth(), txDate.getDate())),
    });

    this.showReport();
    this.isFormLoaded = true;
  }

  showReport(): void {

    this.overlayService.enableProgressSpinner();
    
    this.dataSource.data = [];
    this.totalItemQuantity = 0;

    this.itemSaleSummaryService.getReportArg(this.itemSaleSummaryReportForm.value).subscribe({
      next: (data) => {
        this.dataSource.data = data.lines || [];

        data.lines?.forEach((lineItem) => {
          if(lineItem.saleQuantity) {
            this.totalItemQuantity = this.totalItemQuantity + lineItem.saleQuantity;
          }
        });

        this.overlayService.disableProgressSpinner();
      }
    });
  }

  download(type: string) : void {

    let model: ItemSaleSummaryReportServiceGetReportAsFile  = {};
    model.type = type as ItemSaleSummaryReportServiceGetReportAsFile .TypeEnum;
    model.arg = this.itemSaleSummaryReportForm.value;

    this.itemSaleSummaryService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == ItemSaleSummaryReportServiceGetReportAsFile .TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }
}
