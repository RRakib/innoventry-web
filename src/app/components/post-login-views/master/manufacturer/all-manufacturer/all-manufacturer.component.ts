import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OverlayService } from 'src/app/services/overlay.service';
import { GetObjectsArgument, IManufacturer } from 'src/server';
import { ManufacturerServiceService } from 'src/server/api/manufacturerService.service';

@Component({
  selector: 'app-all-manufacturer',
  templateUrl: './all-manufacturer.component.html',
  styleUrls: ['./all-manufacturer.component.css']
})
export class AllManufacturerComponent implements OnInit, AfterViewInit {

  getObjectsArgument: GetObjectsArgument;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['name','description'];

  private allManufacturer : IManufacturer[] | undefined;
  public dataSource = new MatTableDataSource<IManufacturer>([]);
  
  selectedRowIndex = -1;

  @ViewChild('filterInput') 
  filterInput: ElementRef;

  @ViewChild(MatPaginator) 
  paginator: any = MatPaginator;


  constructor(private manufacturerServiceApi : ManufacturerServiceService, private overlayService : OverlayService, private router: Router) {
    this.getObjectsArgument = {};
    this.getObjectsArgument.startPageIndex = 0;
    this.getObjectsArgument.genericSearch = false;
   }

  ngOnInit(): void {
    this.getAllManufacturers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllManufacturers() : void {
    
    this.overlayService.enableProgressSpinner();
    this.manufacturerServiceApi.getObjectsSearchArg(this.getObjectsArgument).subscribe({
      next: (data) => {
          this.allManufacturer = !!data.objects  ? data.objects : [];  
          this.dataSource.data = this.allManufacturer;
          this.filterInput.nativeElement.focus();
          this.overlayService.disableProgressSpinner();
      }
    });
  }

  addNewManufacturer() : void{
    this.router.navigate(['main/master/newManufacturer']);
  }

  editManufacturer() : void{
    this.router.navigate(['main/master/editManufacturer', this.selectedRowIndex]);
  }

  deleteSelectedManufacturer() : void{

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  highlight(row : IManufacturer){
    this.selectedRowIndex = row.id || -1;
  }
}
