import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GetObjectsArgument, IItemGroup } from 'src/server';
import { ItemGroupServiceService } from 'src/server/api/itemGroupService.service';

@Component({
  selector: 'app-item-groups',
  templateUrl: './item-groups.component.html',
  styleUrls: ['./item-groups.component.css']
})
export class ItemGroupsComponent implements OnInit, AfterViewInit {

  getObjectsArgument: GetObjectsArgument;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['name','description'];

  private allItemGroups : IItemGroup[] | undefined;
  public dataSource = new MatTableDataSource<IItemGroup>([]);
  
  @ViewChild(MatPaginator) 
  paginator: any = MatPaginator;
  
  selectedRowIndex = -1;

  @ViewChild('filterInput') 
  filterInput: ElementRef;

  constructor(private itemGroupService : ItemGroupServiceService,private router: Router) { 
    this.getObjectsArgument = {};
    this.getObjectsArgument.startPageIndex = 0;
    this.getObjectsArgument.genericSearch = false;
    this.getObjectsArgument.nameSearchText = "";
  }

  ngOnInit(): void {
    this.getAllItemGroups();
  }

  getAllItemGroups() : void {
    this.itemGroupService.getObjectsSearchArg(this.getObjectsArgument).subscribe({
      next: (data) => {
        this.allItemGroups = !!data.objects  ? data.objects : [];        
        this.dataSource.data = this.allItemGroups;
        this.filterInput.nativeElement.focus();
      },
      error: () => {

      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addNewItemGroup() : void{
    this.router.navigate(['main/master/newItemGroup']);
  }

  editItemGroup() : void{
    this.router.navigate(['main/master/editItemGroup', this.selectedRowIndex]);
  }

  deleteSelectedItemGroup() : void{
    if (window.confirm('Are you sure want to delete this item ?')) {
      this.itemGroupService._delete(this.selectedRowIndex).subscribe({
        next: (data) => {          
          this.getAllItemGroups();
        },error(err) { 
          console.log(err);
        },
      });
    }
  }

  highlight(row : IItemGroup){
    this.selectedRowIndex = row.id || -1;
  }
}
