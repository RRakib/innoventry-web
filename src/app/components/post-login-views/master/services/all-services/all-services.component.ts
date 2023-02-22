import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OverlayService } from 'src/app/services/overlay.service';
import { GetObjectsArgument, IServiceMaster } from 'src/server';
import { ServiceServiceService } from 'src/server/api/serviceService.service';

@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.component.html',
  styleUrls: ['./all-services.component.css']
})
export class AllServicesComponent implements OnInit, AfterViewInit {

  getObjectsArgument: GetObjectsArgument;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['name','serviceGroupName', 'unit' , 'rate' , 'percentage', 
    'taxClassName' , 'description'];
    
  private allServices : IServiceMaster[] | undefined;
  public dataSource = new MatTableDataSource<IServiceMaster>([]);
  
  selectedRowIndex = -1;

  @ViewChild('filterInput') 
  filterInput: ElementRef;

  @ViewChild(MatPaginator) 
  paginator: any = MatPaginator;


  constructor(private serviceApi : ServiceServiceService, private overlayService : OverlayService, private router: Router) {
    this.getObjectsArgument = {};
    this.getObjectsArgument.startPageIndex = 0;
    this.getObjectsArgument.genericSearch = false;
   }


  ngOnInit(): void {
    this.getAllServices();
  }
 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllServices() {
    this.overlayService.enableProgressSpinner();
    this.serviceApi.getObjectsSearchArg(this.getObjectsArgument).subscribe({
      next: (data) => {
          this.allServices = !!data.objects  ? data.objects : [];  
          this.dataSource.data = this.allServices;
          this.filterInput.nativeElement.focus();
          this.overlayService.disableProgressSpinner();
      }
    });
  }

  addNewService() : void{
    this.router.navigate(['main/master/newService']);
  }

  editService() : void{
    this.router.navigate(['main/master/editService', this.selectedRowIndex]);
  }

  deleteSelectedService() : void{

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  highlight(row : IServiceMaster){
    this.selectedRowIndex = row.id || -1;
  }


}
