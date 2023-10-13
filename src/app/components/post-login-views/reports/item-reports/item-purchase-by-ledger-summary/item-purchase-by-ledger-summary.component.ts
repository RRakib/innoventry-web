import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import {
  IItem,
  ILedger, ItemPurchaseByLedgerSummaryReportLine,
  ItemPurchaseByLedgerSummaryReportServiceService,
  ItemRegisterForLedgerReportArgument,
  ItemRegisterForLedgerReportLine,
  ItemRegisterForLedgerReportServiceGetReportAsFile,
  ItemRegisterForLedgerReportServiceService,
  ItemServiceService,
  LedgerServiceService,
  PItemMaster,
  PLedgerMaster
} from 'src/server';

@Component({
  selector: 'app-item-register-for-ledger',
  templateUrl: './item-purchase-by-ledger-summary.component.html',
  styleUrls: ['./item-purchase-by-ledger-summary.component.css']
})
export class ItemPurchaseByLedgerSummaryComponent implements OnInit {
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  searchForm: FormGroup;
  searchArg: ItemRegisterForLedgerReportArgument;

  detailsLines : ItemPurchaseByLedgerSummaryReportLine[];
  dataSource = new MatTableDataSource<ItemRegisterForLedgerReportLine>([]);  

  @ViewChild(MatPaginator) paginator :any = MatPaginator;

   /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
   displayedColumns = [
   'transactionDate', 
   'transactionType', 
   'stockIn',
   'stockOut',
   'netStock',
   'unit'
  ];

  selectedLeger : ILedger;
  selectedItem : IItem;

  constructor(
      private breakpointObserver: BreakpointObserver, 
      private overlayService : OverlayService,
      private formBuilder : FormBuilder, 
      private customDateAdapterService : CustomDateAdapterService,
      private ledgerService : LedgerServiceService, 
      private itemService: ItemServiceService,
      private itemPurchaseByLedgerSummaryReportService : ItemPurchaseByLedgerSummaryReportServiceService, 
      private downloadService : DownloadService) { }

  ngOnInit(): void {
    this.searchArg = {};
    let txDate = new Date();

    this.searchForm = this.formBuilder.group({      
      startDate: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
      endDate: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
      ledgerId: new FormControl(),
      ledgerName:new FormControl(),
      item: new FormControl(),
      itemName: new FormControl(),
      itemCode: new FormControl()
    });    
  }

  //This will also executed in edit of any new added entry only.
  onLedgerSelectionChange(selectedLedger : PLedgerMaster) : void {

    this.overlayService.enableProgressSpinner();    
    this.ledgerService.findById(selectedLedger.id).subscribe({
      next: (data) =>{
        this.selectedLeger = data;
        this.searchForm.patchValue({
          ledgerName: selectedLedger.name,
          ledgerId: selectedLedger.id
        });

        this.overlayService.disableProgressSpinner();
      }
    });    
  }

  onItemSelectionChange(selectedItem: PItemMaster) { 

    this.overlayService.enableProgressSpinner();
    this.itemService.findById(selectedItem.id).subscribe({
      next : (data) => {
        this.selectedItem = data;
        this.searchForm.patchValue({
          item : selectedItem.id,
          itemCode : data.productCode
        });

        this.overlayService.disableProgressSpinner();
      }
    });    
  }

  getReport() : void{
    this.searchArg = {};

    this.searchArg.dateFrom = this.searchForm.controls["startDate"].value;
    this.searchArg.dateTo = this.searchForm.controls["endDate"].value;
    this.searchArg.item = this.selectedItem;
    this.searchArg.ledger = this.selectedLeger;

    this.itemPurchaseByLedgerSummaryReportService.getReportArg(this.searchArg).subscribe({
      next: (data) => {
        this.detailsLines = data.reportLines || [];

        this.dataSource.data = this.detailsLines;
      }
    });
  }

  download(type: string) : void {

    let model: ItemRegisterForLedgerReportServiceGetReportAsFile = {};
    model.type = type as ItemRegisterForLedgerReportServiceGetReportAsFile.TypeEnum;
    model.arg = this.searchArg;
  
    this.itemPurchaseByLedgerSummaryReportService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {
  
          let fileType =  model.type == ItemRegisterForLedgerReportServiceGetReportAsFile.TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';
  
          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }

  getItemFormControl(name: string) {
    return this.searchForm.get(name) as FormControl;
  }
}
