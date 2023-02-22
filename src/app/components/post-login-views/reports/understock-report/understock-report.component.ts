import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { IItemGroup, UnderstockReportLine, UnderstockReportServiceGetReportAsFile } from 'src/server';
import { ItemGroupServiceService } from 'src/server/api/itemGroupService.service';
import { UnderstockReportServiceService } from 'src/server/api/understockReportService.service';

@Component({
  selector: 'app-understock-report',
  templateUrl: './understock-report.component.html',
  styleUrls: ['./understock-report.component.css']
})
export class UnderstockReportComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  itemGroups: IItemGroup[];
  underStockReportForm: FormGroup
  isFormLoaded : boolean = false;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['itemName', 
    'minStock', 
    'currentStock', 
    'maxStock',
    'unitDisplayName'
  ];

  dataSource = new MatTableDataSource<UnderstockReportLine>([]);

  @ViewChild(MatPaginator) paginator :any = MatPaginator;

  constructor(private breakpointObserver: BreakpointObserver,private overlayService : OverlayService,  
    private itemGroupService : ItemGroupServiceService, private formBuilder: FormBuilder,
    private customDateAdapterService : CustomDateAdapterService, private understockService: UnderstockReportServiceService,
    private downloadService : DownloadService) { }

  ngOnInit(): void {
    let txDate = new Date();

    this.underStockReportForm = this.formBuilder.group({
      itemGroup: new FormControl('', [Validators.required]),
      date: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
    });

    this.overlayService.enableProgressSpinner();

    this.itemGroupService.getObjects().subscribe({
      next: (data) => {
        this.itemGroups = data;
        this.isFormLoaded = true;

        this.overlayService.disableProgressSpinner();
      }
    });
  }


  public getUnderStockReport() : void{
    this.underStockReportForm.markAllAsTouched();

    if(this.underStockReportForm.valid) {
      this.overlayService.enableProgressSpinner();
      this.understockService.getReportArg(this.underStockReportForm.value).subscribe({
        next: (data) => {
          this.dataSource.data  = data.understockReportLine || [];
          this.overlayService.disableProgressSpinner();
        }
      });
    }
  }

  download(type: string) : void {

    let model: UnderstockReportServiceGetReportAsFile  = {};
    model.type = type as UnderstockReportServiceGetReportAsFile.TypeEnum;
    model.arg = this.underStockReportForm.value;

    this.understockService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == UnderstockReportServiceGetReportAsFile.TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }
}
