import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OverlayService } from 'src/app/services/overlay.service';
import { GetObjectsArgument, IAttributeGroup } from 'src/server';
import { AttributeGroupServiceService } from 'src/server/api/attributeGroupService.service';

@Component({
  selector: 'app-all-attribute-groups',
  templateUrl: './all-attribute-groups.component.html',
  styleUrls: ['./all-attribute-groups.component.css']
})
export class AllAttributeGroupsComponent implements OnInit {
  getObjectsArgument: GetObjectsArgument;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['name','displayName', 'description'];

  private allAttributeGroups : IAttributeGroup[] | undefined;
  public dataSource = new MatTableDataSource<IAttributeGroup>([]);

  selectedRowIndex = -1;

  @ViewChild('filterInput') 
  filterInput: ElementRef;

  @ViewChild(MatPaginator) 
  paginator: any = MatPaginator;
  
  constructor(private attributeGroupApi : AttributeGroupServiceService, private overlayService : OverlayService, private router: Router) { 
    this.getObjectsArgument = {};

    this.getObjectsArgument.startPageIndex = 0;
    this.getObjectsArgument.genericSearch = false;
    this.getObjectsArgument.nameSearchText = "";
  }

  ngOnInit(): void {
    this.getAllAtributeGroups();
  }

  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  getAllAtributeGroups() : void {
    this.overlayService.enableProgressSpinner();

    this.attributeGroupApi.getObjects().subscribe({
      next: (data) => {
        this.allAttributeGroups = data;
        this.dataSource.data = this.allAttributeGroups;
        this.filterInput.nativeElement.focus();
        this.overlayService.disableProgressSpinner();
      }
    });
  }
  
  addNewAttributeGroup() : void{
    this.router.navigate(['main/master/newAttributeGroup']);
  }

  editAttributeGroup() : void{
    this.router.navigate(['main/master/editAttributeGroup', this.selectedRowIndex]);
  }

  deleteSelectedAttributeGroup() : void{

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  highlight(row : IAttributeGroup){
    this.selectedRowIndex = row.id || -1;
  }

}
