import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, shareReplay } from 'rxjs';
import { LedgerBookGridLine } from 'src/app/models/LedgerBookGridLine';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { EditReportService } from 'src/app/services/editReport.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { CommonUtils } from 'src/app/shared/utils/commonUtils';
import { LedgerReportInput, LedgerReportLine, LedgerReportServiceGetReportAsFile, PLedgerMaster } from 'src/server';
import { LedgerReportServiceService } from 'src/server/api/ledgerReportService.service';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';


@Component({
  selector: 'app-ledger-book',
  templateUrl: './ledger-book.component.html',
  styleUrls: ['./ledger-book.component.css']
})
export class LedgerBookComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  columns : Object[];
  //Parent data will have  parent = 0
  data : Object[];

  ledgerReportForm : FormGroup;
  private selectedTxId : string;
  private selectedTxType : string;

  constructor(private breakpointObserver: BreakpointObserver, private ledgerReportServiceApi : LedgerReportServiceService, 
    private formBuilder : FormBuilder, private customDateAdapterService  : CustomDateAdapterService,
    private overlayService : OverlayService,private commonUtils : CommonUtils, private editReportService : EditReportService,
    private downloadService : DownloadService) { 
    
  }

  ngOnInit(): void {

    let txDate = new Date();

    this.ledgerReportForm = this.formBuilder.group({
      dateFrom : new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
      dateTo: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
      ledgerId: new FormControl(1 ,[Validators.required]),
      ledgerName: new FormControl('Cash', [Validators.required]),
      includeOpeningBalance : new FormControl()
    });

    this.columns =  [
      {name: 'date', header: 'Date', css_class: 'text-left' },      
      {name: 'type', header: 'Type' , css_class: 'text-left'},
      {name: 'voucherNo', header: 'Voucher No.', css_class: 'text-left' },
      {name: 'description', header: 'Description', css_class: 'text-left' },
      {name: 'debit', header: 'Debit', css_class: 'text-right' ,
        renderer: function(value : number) {          
          return !!value ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        }
      },
      {name: 'credit', header: 'Credit', css_class: 'text-right',
        renderer: function(value : number) {          
          return !!value ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        }
      },
      {name: 'balance', header: 'Balance', css_class: 'text-right',
        renderer: function(value : number) {          
          return !!value ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        }
      }
    ];
    this.data = [];

    this.editReportService.reportEdited().subscribe({
      next: (data) =>{
        if(data) {
          this.getLedgerBookReport();       
        }
      }
    });
  }

  onLedgerSelection(selectedLedger : PLedgerMaster) {
    if(!!selectedLedger) {
      this.ledgerReportForm.patchValue({
        ledgerId : selectedLedger.id,
        ledgerName: selectedLedger.name
      });
    }
  }

  getLedgerBookReport() : void{
    this.ledgerReportForm.markAllAsTouched();

    if(this.ledgerReportForm.valid) {

      this.overlayService.enableProgressSpinner();
      this.ledgerReportServiceApi.getReportArg(this.ledgerReportForm.getRawValue()).subscribe({
        next: (data) => {
          if(!!data.reportLines && data.reportLines.length > 0) {
            this.prepareTreeGridData(data.reportLines);
            this.overlayService.disableProgressSpinner();
          }          
        }
      });
    }   
  }


  private prepareTreeGridData(reportLines : Array<LedgerReportLine>) : void {  
    let rowData : Array<LedgerBookGridLine> = [];

    reportLines.forEach((reportLine) => {
      let parentLine : LedgerBookGridLine = {};

      parentLine.id = reportLine.type + "-" + reportLine.transaction?.id; //To generate unique id
      parentLine.parent = "0";

      parentLine.date = new Date(Number(reportLine.transactionDate)).toLocaleDateString();
      parentLine.type = reportLine.type;
      parentLine.voucherNo = reportLine.voucherNumber;                
      parentLine.description = reportLine.description;          
      parentLine.credit = reportLine.credit;
      parentLine.debit = reportLine.debit;
      parentLine.balance = reportLine.balance

      rowData.push(parentLine);  
      
      if(reportLine.detailLines){
        reportLine.detailLines.forEach((detailLine, index : number) => {

          let childLine : LedgerBookGridLine = {};

          childLine.id = parentLine.type + "-" + (Math.floor((Math.random() * 10000) + 1)).toString(); //To generate unique id
          childLine.parent = parentLine.id;    

          childLine.description = detailLine.description;

          rowData.push(childLine);
        });
      }
    });

    this.data = rowData;
  }

  onRowSelection(event: any) : void {
    let selectedData : LedgerBookGridLine = event.data;
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

    let model: LedgerReportServiceGetReportAsFile  = {};
    model.type = type as LedgerReportServiceGetReportAsFile .TypeEnum;
    model.arg = this.ledgerReportForm.value;

    this.ledgerReportServiceApi.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == LedgerReportServiceGetReportAsFile .TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }
}
