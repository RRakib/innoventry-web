import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OverlayService } from 'src/app/services/overlay.service';
import { GetObjectsArgument, IAttribute } from 'src/server';
import { AttributeServiceService } from 'src/server/api/attributeService.service';

@Component({
  selector: 'app-all-attributes',
  templateUrl: './all-attributes.component.html',
  styleUrls: ['./all-attributes.component.css']
})
export class AllAttributesComponent implements OnInit, AfterViewInit {

  getObjectsArgument: GetObjectsArgument;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['name','displayName', 'mandatory', 'printInTransaction', 'description'];

  private allAttributes : IAttribute[] | undefined;
  public dataSource = new MatTableDataSource<IAttribute>([]);
  
  selectedRowIndex = -1;

  @ViewChild('filterInput') 
  filterInput: ElementRef;

  @ViewChild(MatPaginator) 
  paginator: any = MatPaginator;

  constructor(private attributeServiceApi: AttributeServiceService, private overlayService : OverlayService, private router: Router) { 
    this.getObjectsArgument = {};
    this.getObjectsArgument.startPageIndex = 0;
    this.getObjectsArgument.genericSearch = false;
  }

  ngOnInit(): void {
    this.getAllAtributes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllAtributes() : void {
    
    this.overlayService.enableProgressSpinner();
    this.attributeServiceApi.getObjectsSearchArg(this.getObjectsArgument).subscribe({
      next: (data) => {
          this.allAttributes = !!data.objects  ? data.objects : [];  
          this.dataSource.data = this.allAttributes;
          this.filterInput.nativeElement.focus();
          this.overlayService.disableProgressSpinner();
      }
    });
  }

  addNewAttribute() : void{
    this.router.navigate(['main/master/newAttribute']);
  }

  editAttribute() : void{
    this.router.navigate(['main/master/editAttribute', this.selectedRowIndex]);
  }

  deleteSelectedAttribute() : void{

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  highlight(row : IAttribute){
    this.selectedRowIndex = row.id || -1;
  }
}
