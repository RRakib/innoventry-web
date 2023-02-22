import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { formatNumber } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DayBookGridLine } from 'src/app/models/DayBookGridLine';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { EditReportService } from 'src/app/services/editReport.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { CommonUtils } from 'src/app/shared/utils/commonUtils';
import { DayBook, DayBookReportArgument, DayBookServiceGetReportAsFile, DayBookServiceGetReportFileStream } from 'src/server';
import { DayBookServiceService } from 'src/server/api/dayBookService.service';

@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class DayBookComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  columns : Object[];
  //Parent data will have  parent = 0
  data : Object[];

  fromDate : FormControl;
  toDate : FormControl;
  showCashTx : boolean;

  public inputModel : DayBookReportArgument;
  public totalDebitAmount: number | undefined;
  public  totalCreditAmount: number | undefined;
  private selectedTxId : string;
  private selectedTxType : string;

  constructor(private breakpointObserver: BreakpointObserver,private router: Router, private overlayService : OverlayService,
    private customDateAdapterService  : CustomDateAdapterService, private dayBookService : DayBookServiceService,
    private commonUtils : CommonUtils, private editReportService : EditReportService, private downloadService : DownloadService) { 
    let txDate = new Date();

    this.fromDate = new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate()));
    this.toDate = new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate()));
    this.showCashTx = true;
  }

  /**
   * This function is executed on page load.
   */
  ngOnInit(): void {  

    this.columns =  [
      {name: 'date', header: 'Date', css_class: 'text-left' },
      {name: 'ledger', header: 'Ledger', css_class: 'text-left'},
      {name: 'type', header: 'Type' },
      {name: 'voucherNo', header: 'Voucher No.' },
      {name: 'details', header: 'Details', css_class: 'text-left' },
      {name: 'debit', header: 'Debit', css_class: 'text-right' , 
        renderer: function(value : number) {          
          return formatNumber(Number(value), 'en-US', '1.2-2');
        } 
      },
      {name: 'credit', header: 'Credit', css_class: 'text-right', 
        renderer: function(value : number) {          
          return formatNumber(Number(value), 'en-US', '1.2-2');
        } 
      }
    ];
    this.data = [];
    this.totalCreditAmount = 0;
    this.totalDebitAmount = 0;
    this.selectedTxId = "";

    this.editReportService.reportEdited().subscribe({
      next: (data) =>{
        if(data) {
          this.getDayBookReport();  
          
        }
      }
    });

    this.getDayBookReport();
  }

  getDayBookReport() : void {

    this.overlayService.enableProgressSpinner();

    this.inputModel = {};   
    this.inputModel.from = this.fromDate.value;
    this.inputModel.to = this.toDate.value;    
    this.inputModel.isShowCashTx = this.showCashTx;
    this.inputModel.format = "Detailed"; 


    this.data = [];
    this.totalCreditAmount = 0;
    this.totalDebitAmount = 0;

    this.dayBookService.getReportArg(this.inputModel).subscribe({
      next: (data) => {
        if(data.dayBookList && data.dayBookList.length > 0) {
          this.prepareTreeGridData(data.dayBookList);          
        }        

        this.overlayService.disableProgressSpinner();
      },
      error: () => {
        this.overlayService.disableProgressSpinner();
      }
    });
  }

  onRowSelection(event: any) : void {
    let selectedData : DayBookGridLine = event.data;
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

  private prepareTreeGridData(dayBookData : Array<DayBook>) : void {  

    let rowData : Array<DayBookGridLine> = [];

    dayBookData.forEach((dayData) => {
       if(dayData.reportLines) {        
          
         dayData.reportLines.forEach((reportLine) => {
          let parentLine : DayBookGridLine = {};

          parentLine.id = reportLine.type + "-" + reportLine.transaction?.id; //To generate unique id
          parentLine.parent = "0";
          parentLine.type = reportLine.type;
          parentLine.voucherNo = reportLine.voucherNumber;
          parentLine.date = new Date(Number(reportLine.transactionDate)).toLocaleDateString();
          parentLine.ledger = reportLine.ledgerString;
          parentLine.details = reportLine.description;          
          parentLine.credit = reportLine.credit;
          parentLine.debit = reportLine.debit;

          this.totalCreditAmount = +(this.totalCreditAmount ? this.totalCreditAmount : 0) + +(reportLine.credit ? reportLine.credit : 0);
          this.totalDebitAmount = +(this.totalDebitAmount ? this.totalDebitAmount : 0) + +(reportLine.debit ? reportLine.debit : 0);


          rowData.push(parentLine);

          if(reportLine.detailLines){
              reportLine.detailLines.forEach((detailLine, index : number) => {
                let childLine : DayBookGridLine = {};

                childLine.id = parentLine.type + "-" + (Math.floor((Math.random() * 10000) + 1)).toString(); //To generate unique id
                childLine.parent = parentLine.id;                
                                 
                childLine.ledger = detailLine.ledgerString;
                childLine.details = detailLine.description;
                childLine.credit = detailLine.credit;
                childLine.debit = detailLine.debit;


                this.totalCreditAmount = +(this.totalCreditAmount ? this.totalCreditAmount : 0) + +(detailLine.credit ? detailLine.credit : 0);
                this.totalDebitAmount = +(this.totalDebitAmount ? this.totalDebitAmount : 0) + +(detailLine.debit ? detailLine.debit : 0);
                
                
                rowData.push(childLine);                
              });
          }

         });

       }
    });
    
    this.data = rowData;
  }

  
  download(type: string) : void {

    let model: DayBookServiceGetReportAsFile = {};
    model.type = type as DayBookServiceGetReportAsFile.TypeEnum;
    model.arg = this.inputModel;  

    this.dayBookService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == DayBookServiceGetReportAsFile.TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }
}