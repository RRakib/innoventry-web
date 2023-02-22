import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, shareReplay } from 'rxjs';
import { BalanceSheetGridLine } from 'src/app/models/BalanceSheetGridLine';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { BalanceSheetReportArgument, BalanceSheetReportLine, BalanceSheetReportServiceGetReportAsFile } from 'src/server';
import { BalanceSheetReportServiceService } from 'src/server/api/balanceSheetReportService.service';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.css']
})
export class BalanceSheetComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  
  public startDate!: FormControl;
  public endDate!: FormControl;
  public zeroBalrequired!: boolean;
  public ledgerrequired!: boolean;
  private balanceSheetReportInput: BalanceSheetReportArgument;

  columns : Object[];
  liabilitiesData : Object[];
  assetsData : Object[];

  totalLiabilities : number = 0;
  totalAssets : number = 0;

  constructor(private breakpointObserver: BreakpointObserver, private balancesheetReportService: BalanceSheetReportServiceService, private customDateAdapterService  : CustomDateAdapterService,
    private overlayService : OverlayService, private downloadService : DownloadService) { 
    let txDate = new Date();
    this.startDate = new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate()));
    this.endDate = new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate()));
    this.zeroBalrequired = false;
    this.ledgerrequired= false;
  }

  ngOnInit(): void {
    
    this.columns =  [
      {name: 'name', header: 'Name', css_class: 'text-left' },
      {name: 'balance', header: 'Balance', css_class: 'text-right',
        renderer: function(value : number) {          
          return !!value  ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        }
      },
      {name: 'groupBalance', header: 'Group Balance', css_class: 'text-right' ,
        renderer: function(value : number) {          
          return !!value ? formatNumber(Number(value), 'en-US', '1.2-2') : '';
        }
      }
    ];

    this.liabilitiesData = [];
    this.assetsData = [];

    this.getBalancesheetReport();
  }
  getBalancesheetReport(): void {

    this.liabilitiesData = [];
    this.assetsData = [];


    this.balanceSheetReportInput = {};
    
    this.balanceSheetReportInput.dateFrom = this.startDate.value;
    this.balanceSheetReportInput.dateTo = this.endDate.value;
    this.balanceSheetReportInput.showZeroBalanceAccounts = this.zeroBalrequired;
    this.balanceSheetReportInput.showOnlyLedgerGroups = this.ledgerrequired;
    
    this.overlayService.enableProgressSpinner();

    this.balancesheetReportService.getReportArg(this.balanceSheetReportInput)
    .subscribe({
      next: (data) => {   
        if(data.liabilitiesReportLines && data.liabilitiesReportLines.length > 0) {
          this.prepareLiabilitiesGridData(data.liabilitiesReportLines);
        }       
        
        if(data.assetsReportLines && data.assetsReportLines.length > 0){
          this.prepareAssetGridData(data.assetsReportLines);
        }
        
        this.overlayService.disableProgressSpinner();
      },
      error: () => { 
        this.overlayService.disableProgressSpinner();
      }
    });
  }
  prepareAssetGridData(assetsReportLines: BalanceSheetReportLine[]) {

    let rowData : Array<BalanceSheetGridLine> = [];
    let totalAssets : number = 0;

    assetsReportLines.forEach((assetReportLine, parentIndex) => {

      let parentLine : BalanceSheetGridLine = {};

      parentLine.id = "Asset-" + parentIndex;
      parentLine.parent = "0";
      parentLine.name = assetReportLine.ledgerGroupName;
      parentLine.groupBalance = !!assetReportLine.ledgerGroupBalance ?  Number((assetReportLine.ledgerGroupBalance).toFixed(2))  : 0;

      totalAssets = totalAssets + parentLine.groupBalance;

      rowData.push(parentLine);

      if(assetReportLine.detailReportLines && assetReportLine.detailReportLines.length > 0) {
        assetReportLine.detailReportLines.forEach((element, childIndex) => {

          let childLine : BalanceSheetGridLine = {};

          childLine.id = "Asset-" + parentIndex + "-" + childIndex;
          childLine.parent = parentLine.id;
          childLine.name = element.ledgerPrintName;
          childLine.balance = !!element.ledgerBalance ?  Number((element.ledgerBalance * -1).toFixed(2))  : 0;                 

          rowData.push(childLine);
        });
      }

    });

    this.totalAssets = totalAssets;
    this.assetsData = rowData;    
  }


  prepareLiabilitiesGridData(liabilitiesReportLines: BalanceSheetReportLine[]) {
    let rowData : Array<BalanceSheetGridLine> = [];
    let totalLiabilities : number = 0;

    liabilitiesReportLines.forEach((liabilityReportLine, parentIndex) => {

      let parentLine : BalanceSheetGridLine = {};

      parentLine.id = "Liability-" + parentIndex;
      parentLine.parent = "0";
      parentLine.name = liabilityReportLine.ledgerGroupName;
      parentLine.groupBalance = !!liabilityReportLine.ledgerGroupBalance ?  Number((liabilityReportLine.ledgerGroupBalance * -1).toFixed(2))  : 0;

      totalLiabilities = totalLiabilities + parentLine.groupBalance;

      rowData.push(parentLine);

      if(liabilityReportLine.detailReportLines && liabilityReportLine.detailReportLines.length > 0) {
        liabilityReportLine.detailReportLines.forEach((element, childIndex) => {

          let childLine : BalanceSheetGridLine = {};

          childLine.id = "Liability-" + parentIndex + "-" + childIndex;
          childLine.parent = parentLine.id;
          childLine.name = element.ledgerPrintName;
          childLine.balance = !!element.ledgerBalance ?  Number((element.ledgerBalance * -1).toFixed(2))  : 0;                 

          rowData.push(childLine);
        });
      }

    });

    this.totalLiabilities = totalLiabilities;
    this.liabilitiesData = rowData;
  }

  download(type: string) : void {

    let model: BalanceSheetReportServiceGetReportAsFile = {};
    model.type = type as BalanceSheetReportServiceGetReportAsFile.TypeEnum;
    model.arg = this.balanceSheetReportInput;  

    this.balancesheetReportService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == BalanceSheetReportServiceGetReportAsFile.TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }

  
}
