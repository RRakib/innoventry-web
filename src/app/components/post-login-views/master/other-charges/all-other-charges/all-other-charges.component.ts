import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OverlayService } from 'src/app/services/overlay.service';
import { GetObjectsArgument, IOtherCharges } from 'src/server';
import { OtherChargesServiceService } from 'src/server/api/otherChargesService.service';

@Component({
  selector: 'app-all-other-charges',
  templateUrl: './all-other-charges.component.html',
  styleUrls: ['./all-other-charges.component.css']
})
export class AllOtherChargesComponent implements OnInit, AfterViewInit{

  getObjectsArgument: GetObjectsArgument;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['name','value', 'discount', 'ledgerName', 'type' , 'description'];

  private allOtherCharges : IOtherCharges[] | undefined;
  public dataSource = new MatTableDataSource<IOtherCharges>([]);
  
  selectedRowIndex = -1;

  @ViewChild('filterInput') 
  filterInput: ElementRef;

  @ViewChild(MatPaginator) 
  paginator: any = MatPaginator;

  constructor(private overlayService : OverlayService, private router: Router,private otherChargesService : OtherChargesServiceService) { 
    this.getObjectsArgument = {};
    this.getObjectsArgument.startPageIndex = 0;
    this.getObjectsArgument.genericSearch = false;
  }

  ngOnInit(): void {
    this.getAllOtherCharges();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllOtherCharges() : void {
    
    this.overlayService.enableProgressSpinner();
    this.otherChargesService.getObjectsSearchArg(this.getObjectsArgument).subscribe({
      next: (data) => {
          this.allOtherCharges = !!data.objects  ? data.objects : [];  
          this.dataSource.data = this.allOtherCharges;
          this.filterInput.nativeElement.focus();
          this.overlayService.disableProgressSpinner();
      }
    });
  }


  addNewOtherCharges() : void{
    this.router.navigate(['main/master/newOtherCharge']);
  }

  editOtherCharges() : void{
    this.router.navigate(['main/master/editOtherCharge', this.selectedRowIndex]);
  }

  deleteSelectedOtherCharge() : void{

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  highlight(row : IOtherCharges){
    this.selectedRowIndex = row.id || -1;
  }
}
