import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, shareReplay } from 'rxjs';
import { ProfitLossGridLine } from 'src/app/models/ProfitLossGridLine';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { ProfitLossReportArgument, ProfitLossReportLine, ProfitLossReportServiceGetReportAsFile } from 'src/server';
import { ProfitLossReportServiceService } from 'src/server/api/profitLossReportService.service';

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.css']
})
export class ProfitLossComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  public startDate!: FormControl;
  public endDate!: FormControl;
  public zeroBalrequired!: boolean;
  public ledgerRequired!: boolean;
  public profitLossReportArgument : ProfitLossReportArgument;

  totalExpenses : number = 0;
  totalIncome : number = 0;

  columns : Object[];
  expensesData : Object[];
  incomeData : Object[];

  constructor(private breakpointObserver: BreakpointObserver, private overlayService : OverlayService,
    private customDateAdapterService  : CustomDateAdapterService, private profitLossServiceApi : ProfitLossReportServiceService,
    private downloadService : DownloadService) {
    let txDate = new Date();
    this.startDate = new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear() - 1,txDate.getMonth(), txDate.getDate()));
    this.endDate = new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate()));
    this.zeroBalrequired = false;
    this.ledgerRequired= false;
   }

  ngOnInit(): void {

    this.profitLossReportArgument = {};

    this.columns =  [
      {name: 'name', header: 'Name', css_class: 'text-left' },
      {name: 'balance', header: 'Balance', css_class: 'text-right',
        renderer: function(value : number) {          
              return !!value ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        } 
      },
      {name: 'groupBalance', header: 'Group Balance', css_class: 'text-right',
        renderer: function(value : number) {          
          return !!value ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        }
      }
    ];

    this.expensesData = [];
    this.incomeData = [];
  }

  getProfitLossReport() : void{

    this.profitLossReportArgument.dateFrom = this.startDate.value;
    this.profitLossReportArgument.dateTo = this.endDate.value;
    this.profitLossReportArgument.showOnlyLedgerGroups = this.ledgerRequired;
    this.profitLossReportArgument.showZeroBalanceAccounts = this.zeroBalrequired;

    this.overlayService.enableProgressSpinner();

    this.profitLossServiceApi.getReportArg(this.profitLossReportArgument).subscribe({
      next: (data) => {      
        if(data.expensesReportLines && data.expensesReportLines.length > 0) {
          this.prepareExpensesGridData(data.expensesReportLines);
        }       
        
        if(data.incomeReportLines && data.incomeReportLines.length > 0){
          this.prepareIncomeGridData(data.incomeReportLines);
        }
        
        this.overlayService.disableProgressSpinner();
      } 
    });
  }
  prepareIncomeGridData(incomeReportLines: ProfitLossReportLine[]) {

    let rowData : Array<ProfitLossGridLine> = [];
    let totalIncome : number = 0;

    incomeReportLines.forEach((incomeReportLine, parentIndex) => {

      let parentLine : ProfitLossGridLine = {};

      parentLine.id = "Income-" + parentIndex;
      parentLine.parent = "0";
      parentLine.name = incomeReportLine.ledgerGroupName;
      parentLine.groupBalance = !!incomeReportLine.ledgerGroupBalance ?  Number((Math.abs(incomeReportLine.ledgerGroupBalance)).toFixed(2))  : 0;

      totalIncome = totalIncome + parentLine.groupBalance;

      rowData.push(parentLine);

      if(incomeReportLine.detailReportLines && incomeReportLine.detailReportLines.length > 0) {
        incomeReportLine.detailReportLines.forEach((element, childIndex) => {

          let childLine : ProfitLossGridLine = {};

          childLine.id = "Income-" + parentIndex + "-" + childIndex;
          childLine.parent = parentLine.id;
          childLine.name = element.ledgerPrintName;
          childLine.balance = !!element.ledgerBalance ?  Number((Math.abs(element.ledgerBalance)).toFixed(2))  : 0;

          rowData.push(childLine);
        });
      }

    });

    this.totalIncome = totalIncome;
    this.incomeData = rowData;    
    
  }
  prepareExpensesGridData(expensesReportLines: ProfitLossReportLine[]) {
    
    let rowData : Array<ProfitLossGridLine> = [];
    let totalExpenses : number = 0;

    expensesReportLines.forEach((expenseReportLine, parentIndex) => {

      let parentLine : ProfitLossGridLine = {};

      parentLine.id = "Expense-" + parentIndex;
      parentLine.parent = "0";
      parentLine.name = expenseReportLine.ledgerGroupName;
      parentLine.groupBalance = !!expenseReportLine.ledgerGroupBalance ?  Number((expenseReportLine.ledgerGroupBalance).toFixed(2))  : 0;

      totalExpenses = totalExpenses + parentLine.groupBalance;

      rowData.push(parentLine);

      if(expenseReportLine.detailReportLines && expenseReportLine.detailReportLines.length > 0) {
        expenseReportLine.detailReportLines.forEach((element, childIndex) => {

          let childLine : ProfitLossGridLine = {};

          childLine.id = "Expense-" + parentIndex + "-" + childIndex;
          childLine.parent = parentLine.id;
          childLine.name = element.ledgerPrintName;
          childLine.balance = !!element.ledgerBalance ?  Number((element.ledgerBalance).toFixed(2))  : 0;

          rowData.push(childLine);
        });
      }

    });

    this.totalExpenses = totalExpenses;
    this.expensesData = rowData;    
  }

  download(type: string) : void {

    let model: ProfitLossReportServiceGetReportAsFile  = {};
    model.type = type as ProfitLossReportServiceGetReportAsFile.TypeEnum;

    let modelArg : ProfitLossReportArgument = {};
    modelArg.dateFrom = this.startDate.value;
    modelArg.dateTo = this.endDate.value;
    modelArg.showOnlyLedgerGroups = this.ledgerRequired;
    modelArg.showZeroBalanceAccounts = this.zeroBalrequired;

    model.arg = modelArg;

    this.profitLossServiceApi.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == ProfitLossReportServiceGetReportAsFile.TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }

}
