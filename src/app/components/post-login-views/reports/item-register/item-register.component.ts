import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { ItemRegisterReportLineByIndex } from 'src/app/models/ItemRegisterReportLineByIndex';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { EditReportService } from 'src/app/services/editReport.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { CommonUtils } from 'src/app/shared/utils/commonUtils';
import { IItem, ItemRegisterReportArgument, ItemRegisterReportLine, ItemRegisterReportServiceGetReportAsFile, PItemMaster } from 'src/server';
import { ItemRegisterReportServiceService } from 'src/server/api/itemRegisterReportService.service';
import { ItemServiceService } from 'src/server/api/itemService.service';

@Component({
  selector: 'app-item-register',
  templateUrl: './item-register.component.html',
  styleUrls: ['./item-register.component.css']
})
export class ItemRegisterComponent implements OnInit, AfterViewInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  itemRegisterForm: FormGroup;
  itemRegisterReportArg: ItemRegisterReportArgument;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['date', 
    'name', 
    'voucher', 
    'quantityIn',
    'quantityOut',
    'quantityNet',
    'amount'
  ];

  reportLines : ItemRegisterReportLineByIndex[];
  dataSource = new MatTableDataSource<ItemRegisterReportLineByIndex>([]);  

  @ViewChild(MatPaginator) paginator :any = MatPaginator;

  selectedItem : IItem | undefined;  
  selectedRowIndex = -1;

  constructor(private breakpointObserver: BreakpointObserver, private overlayService : OverlayService,
    private formBuilder : FormBuilder, private customDateAdapterService : CustomDateAdapterService,
    private itemRegisterReportService : ItemRegisterReportServiceService,private itemService : ItemServiceService,
    private commonUtils : CommonUtils, private editReportService : EditReportService,
    private downloadService : DownloadService) { }

  ngOnInit(): void {
    this.itemRegisterReportArg = {};
    this.reportLines = [];
    let txDate = new Date();

    this.itemRegisterForm = this.formBuilder.group({
      itemName: new FormControl('', [Validators.required]),
      startDate: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
      endDate: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate()))
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
    return this.itemRegisterForm.get(name) as FormControl;
  }

  onItemSelectionChange(selectedItem: PItemMaster) {
    this.itemService.findByName(selectedItem.name).subscribe({
      next: (data) => {
        this.selectedItem = data;
      }
    });
  }

  highlight(row : ItemRegisterReportLineByIndex){
    this.selectedRowIndex = row.rowId || -1;
  }

  getReport() : void {
    this.itemRegisterForm.markAllAsTouched();  

    if(this.itemRegisterForm.valid && this.selectedItem != undefined){
      this.reportLines = [];
      this.selectedRowIndex = -1;

      this.itemRegisterReportArg.dateFrom = this.itemRegisterForm.controls["startDate"].value;
      this.itemRegisterReportArg.dateTo = this.itemRegisterForm.controls["endDate"].value;
      this.itemRegisterReportArg.item = this.selectedItem;

      this.itemRegisterReportService.getReportArg(this.itemRegisterReportArg).subscribe({
        next: (data) => {
          data.reportLines?.forEach((element, index) => {
            let reportLineData : ItemRegisterReportLineByIndex  = element;
            reportLineData.rowId = index + 1;

            this.reportLines.push(reportLineData);
          });
          this.dataSource.data = this.reportLines || [];
        }
      });
    }
  }

  onRowEdit() : void { 
    if(!!this.selectedRowIndex) {
      let selectedReportLine = this.reportLines.find((reportLine) => reportLine.rowId == this.selectedRowIndex);
      let selectedTxType = selectedReportLine?.transaction?.typeName;
      let selectedTxId = selectedReportLine?.transaction?.id?.toString();
      
      if(!!selectedTxType && !!selectedTxId) {
        this.commonUtils.editReport(selectedTxType, selectedTxId);
      }
    }
  }

  
download(type: string) : void {

  let model: ItemRegisterReportServiceGetReportAsFile = {};
  model.type = type as ItemRegisterReportServiceGetReportAsFile.TypeEnum;
  model.arg = this.itemRegisterReportArg;

  this.itemRegisterReportService.getReportAsFile(model).subscribe({
    next: (data) => { 
      if(!!data.url) {

        let fileType =  model.type == ItemRegisterReportServiceGetReportAsFile.TypeEnum.PDF 
                        ? 'application/pdf' 
                        : 'application/vnd.ms-excel';

        this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
      }
    }
  });
}

}
