import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, shareReplay, forkJoin } from 'rxjs';
import { InventoryTxReportGridLine } from 'src/app/models/InventoryTxReportGridLine';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { EditReportService } from 'src/app/services/editReport.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { CommonUtils } from 'src/app/shared/utils/commonUtils';
import { ILedger, InventoryTxReportArgument, InventoryTxReportGroupLine, InventoryTxReportLine, InventoryTxReportServiceGetReportAsFile, ITaxGroup, PLedgerMaster } from 'src/server';
import { InventoryTxReportServiceService } from 'src/server/api/inventoryTxReportService.service';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';
import { TaxGroupServiceService } from 'src/server/api/taxGroupService.service';

@Component({
  selector: 'app-sale-order-report',
  templateUrl: './sale-order-report.component.html',
  styleUrls: ['./sale-order-report.component.css']
})
export class SaleOrderReportComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  columns : Object[];
  //Parent data will have  parent = 0
  data : Object[];

  saleOrderReportForm: FormGroup;
  isFormLoaded: boolean = false;

  salesManLedgers : ILedger[];
  taxGroups: ITaxGroup[];

  saleOrderReportArgument: InventoryTxReportArgument;
  private selectedTxId : string;
  private selectedTxType : string;

  constructor(private breakpointObserver: BreakpointObserver, private formBuilder : FormBuilder,
    private overlayService :OverlayService,  private customDateAdapterService  : CustomDateAdapterService,
    private ledgerServiceApi : LedgerServiceService,private taxGroupServiceApi: TaxGroupServiceService,
    private inventoryTxReportServiceApi: InventoryTxReportServiceService,
    private commonUtils : CommonUtils, private editReportService : EditReportService,
    private downloadService : DownloadService) {
      this.salesManLedgers = [];
  }

  ngOnInit(): void {
    let txDate = new Date();
    this.saleOrderReportArgument = {};
    this.saleOrderReportArgument.txTypeClassName = "in.solpro.nucleus.inventory.model.IPOTx";
    this.saleOrderReportArgument.billingClassification = 0;
    this.saleOrderReportArgument.billingGroup = 0;

    this.editReportService.reportEdited().subscribe({
      next: (data) =>{
        if(data) {
          this.getSaleOrderReport();       
        }
      }
    });

    this.overlayService.enableProgressSpinner();

    this.onPageLoadHttpRequests().subscribe({
      next: (data) => {

        this.salesManLedgers = (data[0] as ILedger[]).filter((ledger) => {
          let found = false;
          ledger.labels?.forEach((ledgerLabel) => {
            if (ledgerLabel.name == 'Sales Man') {              
              found= true;
            }
          });
          return found ? ledger : null;
        });

        this.taxGroups = data[1] as ITaxGroup[];

        this.saleOrderReportForm = this.formBuilder.group({
          ledgerId: new FormControl(),
          ledgerName: new FormControl(),
          dateFrom : new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
          dateTo: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
          salesManId : new FormControl(),
          salesManName : new FormControl(),
          taxGroupId: new FormControl(),
          taxGroupName: new FormControl(),
          showItemDetails: new FormControl(true),
          showUsage: new FormControl()
        });
        this.isFormLoaded = true;
        this.overlayService.disableProgressSpinner();
      }
    });

    this.columns =  [
      {name: 'txDate', header: 'Date', css_class: 'text-left' },
      {name: 'ledger', header: 'Ledger', css_class: 'text-left'},
      {name: 'gstin', header: 'GSTIN' },
      {name: 'voucherNo', header: 'Voucher No.' },
      {name: 'particulars', header: 'Particulars', css_class: 'text-left' },
      {name: 'hsn', header: 'HSN', css_class: 'text-right' },
      {name: 'quantity', header: 'Quantity', css_class: 'text-right'},
      {name: 'unit', header: 'Unit', css_class: 'text-right'},
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
      {name: 'gstRate', header: 'GST Rate', css_class: 'text-center'},
      {name: 'cgst', header: 'CGST', css_class: 'text-right',
        renderer: function(value : number) {          
          return !!value ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        }
      },
      {name: 'sgst', header: 'SGST', css_class: 'text-right',
        renderer: function(value : number) {          
          return !!value ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        }
      },
      {name: 'igst', header: 'IGST', css_class: 'text-right',
        renderer: function(value : number) {          
          return !!value ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        }
      },
      {name: 'cess', header: 'CESS', css_class: 'text-right',
        renderer: function(value : number) {          
          return !!value ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        }
      },
      {name: 'netAmountWithTax', header: 'Total Amount', css_class: 'text-right',
        renderer: function(value : number) {          
          return !!value ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        }
      },
      {name: 'roundAmount', header: 'Round Off', css_class: 'text-right',
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
   
  }


  /**
   * This function returns all the observables required on page load.
   * @returns 
   */
   public onPageLoadHttpRequests(): Observable<any[]> {
    let ledgerObjects$ :  Observable<ILedger[]> = this.ledgerServiceApi.getObjects();
    let taxGroupObjects$ :  Observable<ITaxGroup[]> = this.taxGroupServiceApi.getObjects();

    return forkJoin([ledgerObjects$, taxGroupObjects$]);
   }

  onLedgerSelection(selectedLedger : PLedgerMaster) {
    this.saleOrderReportForm.patchValue({
      ledgerId : selectedLedger.id,
      ledgerName: selectedLedger.name
    });
  }

  getSaleOrderReport() : void{
    this.saleOrderReportForm.markAllAsTouched();

    if(this.saleOrderReportForm.valid) {

      this.saleOrderReportArgument.dateFrom = this.saleOrderReportForm.controls["dateFrom"].value;
      this.saleOrderReportArgument.dateTo = this.saleOrderReportForm.controls["dateTo"].value;
      this.saleOrderReportArgument.showDetail = this.saleOrderReportForm.controls["showItemDetails"].value;
      this.saleOrderReportArgument.showUsage = this.saleOrderReportForm.controls["showUsage"].value;
      this.saleOrderReportArgument.ledgerId = this.saleOrderReportForm.controls["ledgerId"].value;
      this.saleOrderReportArgument.salesMan = this.saleOrderReportForm.controls["salesManId"].value;
      this.saleOrderReportArgument.taxGroup = this.saleOrderReportForm.controls["taxGroupId"].value;

      this.overlayService.enableProgressSpinner();

      this.inventoryTxReportServiceApi.getReportArg(this.saleOrderReportArgument).subscribe({
        next: (data) => {
          if(data.inventoryOrderTxReportGroupLines && data.inventoryOrderTxReportGroupLines.length > 0) {
            this.prepareTreeGridData(data.inventoryOrderTxReportGroupLines);            
          }   

          this.overlayService.disableProgressSpinner();
        }
      });
    }
  }

  private prepareTreeGridData(inventoryTxReportGroupLines : Array<InventoryTxReportGroupLine>) : void {  

    let rowData : Array<InventoryTxReportGridLine> = [];

    inventoryTxReportGroupLines.forEach((parentReportLine) => {        
      let parentLine : InventoryTxReportGridLine = {};

      parentLine.id = "Inward Purchase Order-" + parentReportLine.transaction?.id; //To generate unique id
      parentLine.parent = "0";
      parentLine.ledger = parentReportLine.particulars;
      parentLine.gstin = parentReportLine.gstin;
      parentLine.voucherNo = Number(parentReportLine.voucherNo);
      parentLine.roundAmount = parentReportLine.roundAmount;
      parentLine.billAmount = parentReportLine.billAmount;

      rowData.push(parentLine);
      
      parentReportLine.inventoryTxReportLines?.forEach((childReportLine) => {
        let childLine : InventoryTxReportGridLine = {};

        childLine.id = "Inward Purchase Order-" + parentLine.id + "-" + (Math.floor((Math.random() * 10000) + 1)).toString(); //To generate unique id
        childLine.parent = parentLine.id;  
        childLine.particulars = childReportLine.particulars;
        childLine.hsn = childReportLine.hsn;
        childLine.quantity = childReportLine.quantity;
        childLine.unit = childReportLine.unit;
        childLine.rate = childReportLine.rate;
        childLine.amount = childReportLine.amount
        childLine.gstRate = childReportLine.gstRate;
        childLine.cgst = childReportLine.cgst;
        childLine.igst = childReportLine.igst;
        childLine.sgst = childReportLine.sgst;
        childLine.cess = childReportLine.cess;
        childLine.netAmountWithTax = childReportLine.netAmountWithTax;
        

        rowData.push(childLine);  
      });

    });
    
    this.data = rowData;
  }

  resetSearchForm() : void{
    this.saleOrderReportForm.reset();
  }

  onRowSelection(event: any) : void {
    let selectedData : InventoryTxReportGridLine = event.data;
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

    let model: InventoryTxReportServiceGetReportAsFile = {};
    model.type = type as InventoryTxReportServiceGetReportAsFile.TypeEnum;
    model.arg = this.saleOrderReportArgument;

    this.inventoryTxReportServiceApi.getReportAsFile(model).subscribe({
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
