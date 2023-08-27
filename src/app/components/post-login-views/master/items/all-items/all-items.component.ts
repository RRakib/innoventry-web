import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { BreakPointService } from 'src/app/services/breakpoint.service';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { GetObjectsArgument, PItemMaster } from 'src/server';
import { ItemServiceService } from 'src/server/api/itemService.service';
import { ItemServiceGetReportAsFile } from 'src/server/model/itemServiceGetReportAsFile';


@Component({
  selector: 'app-all-items',
  templateUrl: './all-items.component.html',
  styleUrls: ['./all-items.component.css']
})
export class AllItemsComponent implements OnInit, AfterViewInit {

  Breakpoints = Breakpoints; // To be used in template html
  currentBreakpoint : string = '';

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns : Array<string> = ['name',
    'productCode',
    'groupName',
    'unitName',
    'mrp',
    'sellingPrice',
    'taxClassName',
    'hsnCode'
  ];

  getItemsByCriteria : GetObjectsArgument = {}

  public dataSource = new MatTableDataSource<PItemMaster>([]);
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  selectedRowIndex = -1;
  totalRowCount = 0;
  currentPage = 0;

  @ViewChild('filterInput') 
  filterInput: ElementRef;

  constructor(private router: Router, private itemServiceApi : ItemServiceService, private overlayService : OverlayService, 
    private downloadService : DownloadService,
    private breakPointService: BreakPointService) {    
  }

  ngOnInit(): void {
    this.getItemsByCriteria.startPageIndex = 0;
    this.getItemsByCriteria.pageSize = 200;
    this.getItemsByCriteria.genericSearch = false; 

    this.getItems();

    this.breakPointService.breakpointObservable$.subscribe({
      next: (data) => {
        this.currentBreakpoint = data;
      }
    });
  }



  private getItems(): void {

    this.dataSource.data  = [];
    this.overlayService.enableProgressSpinner();

    this.itemServiceApi.getPItemMasterList(this.getItemsByCriteria).subscribe({
      next: (data) => {                
        this.dataSource.data = data.objects || [];

        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = data.count;
        });

        // this.filterInput.nativeElement.focus();

        this.overlayService.disableProgressSpinner();
      },
      error: () => { this.overlayService.disableProgressSpinner(); }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    //this.dataSource.filter = filterValue.trim().toLowerCase();
    this.getItemsByCriteria.nameSearchText = filterValue;
    this.getItemsByCriteria.startPageIndex = 0;

    this.itemServiceApi.getPItemMasterList(this.getItemsByCriteria).subscribe({
      next: (data) => {                
        this.dataSource.data = data.objects || [];

        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = data.count;
        });

        this.filterInput.nativeElement.focus();
      },
      error: () => {  }
    });

  }

  addNewItem() : void {
    this.router.navigate(['main/master/newItem']);
  }

  public editItem() : void {
    this.router.navigate(['main/master/editItem', this.selectedRowIndex]);
  }

  public deleteSelectedItem() : void {
    if (window.confirm('Are you sure want to delete this item ?')) {
        this.itemServiceApi._delete(this.selectedRowIndex)
        .subscribe({
          next: (data) => {
            this.filterInput.nativeElement.value = '';          
            this.getItems();
          }
        });
    }
  }

  highlight(row : PItemMaster){
    this.selectedRowIndex = row.id || -1;
  }

  pageChanged(event: PageEvent) {    
    this.getItemsByCriteria.startPageIndex = event.pageIndex;
    this.getItemsByCriteria.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.getItems();
  }


  download(type: string) : void {

    let model: ItemServiceGetReportAsFile = {};
    model.type = type as ItemServiceGetReportAsFile.TypeEnum;

    this.itemServiceApi.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == ItemServiceGetReportAsFile.TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }
}


