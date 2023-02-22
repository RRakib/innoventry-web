import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverStockReportArgument, OverstockReportLine, OverstockReportServiceGetReportAsFile } from 'src/server';
import { OverstockReportServiceService } from 'src/server/api/overstockReportService.service';

@Component({
  selector: 'app-overstock-report',
  templateUrl: './overstock-report.component.html',
  styleUrls: ['./overstock-report.component.css']
})
export class OverstockReportComponent implements OnInit, AfterViewInit{

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    displayedColumns = ['itemName',
    'currentStock', 
    'maxStock', 
    'unitDisplayName'
  ];
  public summaryDate!: FormControl;
  private overStockReportInput: OverStockReportArgument;

  dataSource = new MatTableDataSource<OverstockReportLine>([]);
  @ViewChild(MatPaginator) paginator :any = MatPaginator;

  @ViewChild('filterInput', {static : true})
  filterInput: ElementRef;

  constructor(private breakpointObserver: BreakpointObserver,private overstockReportService: OverstockReportServiceService,
    private customDateAdapterService  : CustomDateAdapterService, private downloadService : DownloadService) {
    let txDate = new Date();

    this.summaryDate = new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate()));    
  }

  ngOnInit(): void {
    this.filterInput.nativeElement.focus();
    this.getOverstockReport();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  getOverstockReport() : void{ 
    this.overStockReportInput = {};
    
    this.overStockReportInput.date = this.summaryDate.value;

    this.overstockReportService.getReportArg(this.overStockReportInput)
    .subscribe({
      next: (data) => {      
       this.dataSource.data = data.overstockReportLine || [];      
      },
      error: () => { }
    }
  );

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  download(type: string) : void {

    let model: OverstockReportServiceGetReportAsFile  = {};
    model.type = type as OverstockReportServiceGetReportAsFile.TypeEnum;
    model.arg = this.overStockReportInput;

    this.overstockReportService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == OverstockReportServiceGetReportAsFile.TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }
}
