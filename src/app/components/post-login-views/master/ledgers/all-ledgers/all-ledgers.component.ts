import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OverlayService } from 'src/app/services/overlay.service';
import { GetObjectsArgument, PLedgerMaster } from 'src/server';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';

@Component({
  selector: 'app-all-ledgers',
  templateUrl: './all-ledgers.component.html',
  styleUrls: ['./all-ledgers.component.css']
})
export class AllLedgersComponent implements OnInit, AfterViewInit {

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['name',
    'ledgerGroupName',
    'openingBal',
    'gstin',
    'mobile',
    'email',
    'city'
  ];

  getLedgersByCriteria : GetObjectsArgument = {}

  public dataSource = new MatTableDataSource<PLedgerMaster>([]);
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  selectedRowIndex = -1;

  @ViewChild('filterInput') 
  filterInput: ElementRef;

  constructor(private overlayService : OverlayService, private router: Router, 
    private ledgerServiceApi : LedgerServiceService) { }

  ngOnInit(): void {
    this.getLedgersByCriteria.startPageIndex = 0;
    this.getLedgersByCriteria.genericSearch = false; 

    this.getAllLedgers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private getAllLedgers() : void{

    this.dataSource.data  = [];
    this.overlayService.enableProgressSpinner();

    this.ledgerServiceApi.getPLedgerMasterList(this.getLedgersByCriteria).subscribe({
      next: (data) => {
        this.dataSource.data = data.objects || [];
        this.filterInput.nativeElement.focus();

        this.overlayService.disableProgressSpinner();
      },
      error: () => { this.overlayService.disableProgressSpinner(); }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addNewLedger() : void {
    this.router.navigate(['main/master/newLedger', 'ledger']);
  }

  public editLedger() : void {
    this.router.navigate(['main/master/editLedger', this.selectedRowIndex]);
  }

  public deleteSelectedLedger() : void {
    
  }

  highlight(row : PLedgerMaster){
    this.selectedRowIndex = row.id || -1;
  }

  download(type: string) : void {
    
  }

}
