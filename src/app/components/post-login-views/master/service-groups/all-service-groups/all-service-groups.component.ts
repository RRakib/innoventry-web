import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OverlayService } from 'src/app/services/overlay.service';
import { GetObjectsArgument, IServiceGroup } from 'src/server';
import { ServiceGroupServiceService } from 'src/server/api/serviceGroupService.service';

@Component({
  selector: 'app-all-service-groups',
  templateUrl: './all-service-groups.component.html',
  styleUrls: ['./all-service-groups.component.css']
})
export class AllServiceGroupsComponent implements OnInit, AfterViewInit {

  getObjectsArgument: GetObjectsArgument;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['name','description'];

  private allServiceGroups : IServiceGroup[] | undefined;
  public dataSource = new MatTableDataSource<IServiceGroup>([]);
  
  selectedRowIndex = -1;

  @ViewChild('filterInput') 
  filterInput: ElementRef;

  @ViewChild(MatPaginator) 
  paginator: any = MatPaginator;


  constructor(private serviceGroupApi : ServiceGroupServiceService, private overlayService : OverlayService, private router: Router) {
    this.getObjectsArgument = {};
    this.getObjectsArgument.startPageIndex = 0;
    this.getObjectsArgument.genericSearch = false;
   }

  ngOnInit(): void {
    this.getAllServiceGroups();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllServiceGroups() : void {
    
    this.overlayService.enableProgressSpinner();
    this.serviceGroupApi.getObjectsSearchArg(this.getObjectsArgument).subscribe({
      next: (data) => {
          this.allServiceGroups = !!data.objects  ? data.objects : [];  
          this.dataSource.data = this.allServiceGroups;
          this.filterInput.nativeElement.focus();
          this.overlayService.disableProgressSpinner();
      }
    });
  }

  addNewServiceGroup() : void{
    this.router.navigate(['main/master/newServiceGroup']);
  }

  editServiceGroup() : void{
    this.router.navigate(['main/master/editServiceGroup', this.selectedRowIndex]);
  }

  deleteSelectedServiceGroup() : void{

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  highlight(row : IServiceGroup){
    this.selectedRowIndex = row.id || -1;
  }
}
