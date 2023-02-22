import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { EditReportService } from 'src/app/services/editReport.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { CommonUtils } from 'src/app/shared/utils/commonUtils';
import { IItem, ItemTransactionRegisterReportArgument, ItemTransactionRegisterReportLine, ItemTransactionRegisterReportServiceGetReportAsFile, PItemMaster } from 'src/server';
import { ItemServiceService } from 'src/server/api/itemService.service';
import { ItemTransactionRegisterReportServiceService } from 'src/server/api/itemTransactionRegisterReportService.service';

@Component({
  selector: 'app-item-tx-register',
  templateUrl: './item-tx-register.component.html',
  styleUrls: ['./item-tx-register.component.css']
})
export class ItemTxRegisterComponent implements OnInit, AfterViewInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  itemTxRegisterForm: FormGroup;
  itemTxRegisterReportArg: ItemTransactionRegisterReportArgument;

    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
    displayedColumns = ['date', 
    'name', 
    'voucher', 
    'quantity',
    'amount'
  ];

  reportLines : ItemTransactionRegisterReportLine[];
  dataSource = new MatTableDataSource<ItemTransactionRegisterReportLine>([]); 
  @ViewChild(MatPaginator) paginator :any = MatPaginator;

  selectedTxId = -1;

  constructor(private breakpointObserver: BreakpointObserver, private overlayService : OverlayService,
    private formBuilder : FormBuilder, private customDateAdapterService : CustomDateAdapterService,
    private commonUtils : CommonUtils, private editReportService : EditReportService,private itemService : ItemServiceService,
    private itemTxService : ItemTransactionRegisterReportServiceService, private downloadService : DownloadService) { }

  ngOnInit(): void {

    this.itemTxRegisterReportArg = {};
    this.reportLines = [];
    let txDate = new Date();

    this.itemTxRegisterForm = this.formBuilder.group({
      itemName: new FormControl('', [Validators.required]),
      dateFrom: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
      dateTo: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
      transType: new FormControl('All'),
      item: new FormControl()
    });  
    
    this.editReportService.reportEdited().subscribe({
      next: (data) =>{
        if(data) {
          this.getReport();       
        }
      }
    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getItemFormControl(name: string) {
    return this.itemTxRegisterForm.get(name) as FormControl;
  }

  onItemSelectionChange(selectedItem: PItemMaster) {
    this.itemService.findByName(selectedItem.name).subscribe({
      next: (data) => {
        this.itemTxRegisterForm.patchValue({
          item: data
        });
      }
    });
  }

  highlight(row : ItemTransactionRegisterReportLine){
    this.selectedTxId = row.transaction?.id || -1;
  }

  getReport() : void {
    this.itemTxRegisterForm.markAllAsTouched();  

    if(this.itemTxRegisterForm.valid && this.itemTxRegisterForm.controls["item"].value != undefined){

      this.overlayService.enableProgressSpinner();
      this.itemTxService.getReportArg(this.itemTxRegisterForm.value).subscribe({
        next: (data) => {
          this.reportLines = data.reportLines || [];
          this.dataSource.data = this.reportLines;
          
          this.overlayService.disableProgressSpinner();
        },error: () => {
          this.overlayService.disableProgressSpinner();
        }
      });

    }
  }

  onRowEdit() : void { 
    if(!!this.selectedTxId) {
      let selectedReportLine = this.reportLines.find((reportLine) => reportLine.transaction?.id == this.selectedTxId);
      let selectedTxType = selectedReportLine?.transaction?.typeName;
      let selectedTxId = selectedReportLine?.transaction?.id?.toString();
      
      if(!!selectedTxType && !!selectedTxId) {
        this.commonUtils.editReport(selectedTxType, selectedTxId);
      }
    }    
  }

  download(type: string) : void {

    let model: ItemTransactionRegisterReportServiceGetReportAsFile   = {};
    model.type = type as ItemTransactionRegisterReportServiceGetReportAsFile  .TypeEnum;
    model.arg = this.itemTxRegisterForm.value;

    this.itemTxService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == ItemTransactionRegisterReportServiceGetReportAsFile.TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }
}
