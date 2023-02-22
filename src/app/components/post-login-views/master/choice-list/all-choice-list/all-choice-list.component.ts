import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OverlayService } from 'src/app/services/overlay.service';
import { GetObjectsArgument, IChoice, IChoiceList } from 'src/server';
import { ChoiceListServiceService } from 'src/server/api/choiceListService.service';

@Component({
  selector: 'app-all-choice-list',
  templateUrl: './all-choice-list.component.html',
  styleUrls: ['./all-choice-list.component.scss']
})
export class AllChoiceListComponent implements OnInit {

  getObjectsArgument: GetObjectsArgument;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['name','description'];

  private allChoiceList : IChoiceList[] | undefined;
  public dataSource = new MatTableDataSource<IChoice>([]);

  selectedId = -1;

  @ViewChild('filterInput') 
  filterInput: ElementRef;

  @ViewChild(MatPaginator) 
  paginator: any = MatPaginator;

  constructor(private choiceListService : ChoiceListServiceService, private overlayService : OverlayService, private router: Router) { 
    this.getObjectsArgument = {};
    this.getObjectsArgument.startPageIndex = 0;
    this.getObjectsArgument.genericSearch = false;
  }

  ngOnInit(): void {
    this.getAllChoiceList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllChoiceList() : void {    
    this.overlayService.enableProgressSpinner();
    this.choiceListService.getObjectsSearchArg(this.getObjectsArgument).subscribe({
      next: (data) => {
          this.allChoiceList = !!data.objects  ? data.objects : [];  
          this.dataSource.data = this.allChoiceList;
          this.filterInput.nativeElement.focus();
          this.overlayService.disableProgressSpinner();
      }
    });
  }

  addChoiceList() : void{
    this.router.navigate(['main/master/newChoiceList']);
  }

  editChoiceList() : void{
    this.router.navigate(['main/master/editChoiceList', this.selectedId]);
  }

  deleteSelectedChoiceList() : void{

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  highlight(row : IChoice){
    this.selectedId = row.id || -1;
  }

}
