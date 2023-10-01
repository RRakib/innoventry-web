import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { EditReportService } from 'src/app/services/editReport.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { CommonUtils } from 'src/app/shared/utils/commonUtils';
import { InventoryTxReportArgument, InventoryTxReportGroupLine, InventoryTxReportServiceGetReportAsFile, InventoryTxReportServiceService } from 'src/server';

@Component({
  selector: 'app-inward-quotation-register',
  templateUrl: './inward-quotation-register.component.html',
  styleUrls: ['./inward-quotation-register.component.css']
})
export class InwardQuotationRegisterComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
  
  public inwardQuotationForm!: FormGroup;
  columns : Object[];

  data : Object[];
  InventoryTxReportServiceService: any;

  public inputModel : InventoryTxReportArgument;
  private selectedTxId : string;
  private selectedTxType : string;

  constructor(private breakpointObserver: BreakpointObserver,private customDateAdapterService  : CustomDateAdapterService,
    private formBuilder: FormBuilder,private inventoryTxReportServiceService : InventoryTxReportServiceService,
    private overlayService : OverlayService, private router: Router, private editReportService : EditReportService,
    private commonUtils : CommonUtils, private downloadService : DownloadService) { 

    let txDate = new Date();

    this.inwardQuotationForm = this.formBuilder.group({      
      startDate : new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
      endDate : new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
      isItemDetailRequired : new FormControl(true)
    }); 
  }

  ngOnInit(): void {
    this.columns =  [
      {name: 'date', header: 'Date', css_class: 'text-left' },
      {name: 'ledger', header: 'Ledger', css_class: 'text-left'},
      {name: 'voucherNo', header: 'Voucher No.' },
      {name: 'particulars', header: 'Particulars', css_class: 'text-left' },
      {name: 'quantity', header: 'Quantity', css_class: 'text-left' },
      {name: 'rate', header: 'Rate', css_class: 'text-right',
        renderer: function(value : number) {          
          return !!value ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        } 
     },
      {name: 'amount', header: 'Amount', css_class: 'text-right',
        renderer: function(value : number) {          
          return !!value ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        } 
      },
      {name: 'netAmountWithTax', header: 'Total Amount', css_class: 'text-right',
        renderer: function(value : number) {          
          return !!value ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        } 
      },
      {name: 'billAmount', header: 'Bill Amount', css_class: 'text-right',
        renderer: function(value : number) {          
          return !!value ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        } 
      }
    ];

    this.data = [];
    this.getInwardQuotationRegisterReport();

    this.editReportService.reportEdited().subscribe({
      next: (data) =>{
        if(data) {
          this.getInwardQuotationRegisterReport();       
        }
      }
    });
  }

  getInwardQuotationRegisterReport() : void{
    this.inputModel = {};
    this.data = [];

    this.inputModel.dateFrom = this.inwardQuotationForm.controls["startDate"].value;
    this.inputModel.dateTo = this.inwardQuotationForm.controls["endDate"].value;
    this.inputModel.showDetail = this.inwardQuotationForm.controls["isItemDetailRequired"].value;

    this.inputModel.txTypeClassName = "in.solpro.nucleus.inventory.model.IInwardQuotationTx";
    this.inputModel.billingGroup = 0;
    this.inputModel.billingClassification = 0;

    this.overlayService.enableProgressSpinner();

    this.inventoryTxReportServiceService.getReportArg(this.inputModel).subscribe({
      next: (data) => {
           if(data.inventoryOrderTxReportGroupLines != undefined && data.inventoryOrderTxReportGroupLines.length > 0){
              this.prepareTreeGridData(data.inventoryOrderTxReportGroupLines);              
           }
           this.overlayService.disableProgressSpinner();
      },
      error: () => {}
    });
  }

  private prepareTreeGridData(data : InventoryTxReportGroupLine[]) : void{
    let rowData : Array<any> = [];

    data.forEach((txReportGroupLine) => {

      let parentLine : any = {};

      parentLine.parent = "0";
      parentLine.id = txReportGroupLine.transaction?.typeName + "-" + txReportGroupLine.transaction?.id;

      parentLine.ledger = txReportGroupLine.particulars;
      parentLine.voucherNo = txReportGroupLine.voucherNo;
      parentLine.date = new Date(Number(txReportGroupLine.txDate)).toLocaleDateString();
      parentLine.billAmount = txReportGroupLine.billAmount;

      rowData.push(parentLine);

      if(txReportGroupLine.inventoryTxReportLines != undefined && txReportGroupLine.inventoryTxReportLines.length > 0) {

        txReportGroupLine.inventoryTxReportLines.forEach((childReportLine) => {
          let childLine : any = {};

          childLine.id = parentLine.id + "-" + (Math.floor((Math.random() * 10000) + 1)).toString(); //To generate unique id
          childLine.parent = parentLine.id; 

          childLine.particulars = childReportLine.particulars;

          if(!!childReportLine.quantity) {
            childLine.quantity = childReportLine.quantity + " " + childReportLine.unit;
          }
          
          childLine.rate = childReportLine.rate;
          childLine.amount = childReportLine.amount;
          childLine.netAmountWithTax = childReportLine.netAmountWithTax;
          
          rowData.push(childLine);
        });

      }
    });

    this.data = rowData;
  }

  createNewInwardQuotationTx() : void{
    this.router.navigate(['main/transaction/inwardQuotation/new']);
  }

  onRowSelection(event: any) : void {
    let selectedData  = event.data;
    let selectedTxIdType = '';

    if(selectedData.parent == "0") {
      selectedTxIdType = selectedData.id ? selectedData.id : '';       
    }else{
      selectedTxIdType = selectedData.parent ? selectedData.parent : '';
    }

    if(selectedTxIdType.length > 0 && selectedTxIdType.indexOf("-") != -1) {
      let splittedTxIdType = selectedTxIdType.split("-");

      this.selectedTxType = splittedTxIdType[0];
      this.selectedTxId = splittedTxIdType[1];      
    }

  }

  onRowEdit() : void { 
    this.commonUtils.editReport(this.selectedTxType, this.selectedTxId);
  }

  download(type: string) : void {
    let model: InventoryTxReportServiceGetReportAsFile  = {};
    model.type = type as InventoryTxReportServiceGetReportAsFile.TypeEnum;    

    let modelArg : InventoryTxReportArgument  = {};

    modelArg.dateFrom = this.inwardQuotationForm.controls["startDate"].value;
    modelArg.dateTo = this.inwardQuotationForm.controls["endDate"].value;
    modelArg.showDetail = this.inwardQuotationForm.controls["isItemDetailRequired"].value;
    modelArg.ledgerId = this.inwardQuotationForm.controls["ledgerId"].value;
    modelArg.txTypeClassName = "in.solpro.nucleus.inventory.model.ISaleOrderTx";
    modelArg.billingGroup = 0;
    modelArg.billingClassification = 0;

    model.arg = modelArg;

    this.inventoryTxReportServiceService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == InventoryTxReportServiceGetReportAsFile.TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }

}
