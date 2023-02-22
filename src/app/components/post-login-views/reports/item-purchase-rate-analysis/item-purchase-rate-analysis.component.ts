import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay, startWith } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { IItemGroup, ItemPurchaseRateAnalysisReportLine, ItemPurchaseRateAnalysisServiceGetReportAsFile, PItemMaster } from 'src/server';
import { ItemGroupServiceService } from 'src/server/api/itemGroupService.service';
import { ItemPurchaseRateAnalysisServiceService } from 'src/server/api/itemPurchaseRateAnalysisService.service';
import { ItemServiceService } from 'src/server/api/itemService.service';

@Component({
  selector: 'app-item-purchase-rate-analysis',
  templateUrl: './item-purchase-rate-analysis.component.html',
  styleUrls: ['./item-purchase-rate-analysis.component.css']
})
export class ItemPurchaseRateAnalysisComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  reportForm : FormGroup;
  isFormLoaded : boolean = false;

  // Item Groups and Search with auto-complete
  itemGroups: IItemGroup[];
  filteredItemGroups : Observable<IItemGroup[]>;  
  itemGroupSelected : boolean = false;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['date', 
   'purchaseRate'
  ]; 

  dataSource = new MatTableDataSource<ItemPurchaseRateAnalysisReportLine>([]); 
  
  constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder,
    private overlayService : OverlayService, private itemService : ItemServiceService,
    private customDateAdapterService  : CustomDateAdapterService, private reportService : ItemPurchaseRateAnalysisServiceService,
    private downloadService : DownloadService) { }

  ngOnInit(): void {

    let txDate = new Date();

    this.reportForm = this.formBuilder.group({
      item: new FormControl(),
      itemName: new FormControl(),
      dateFrom : new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
      dateTo : new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate()))        
    });
          
    this.isFormLoaded = true;
  }

  getItemFormControl(name: string) {
    return this.reportForm.get(name) as FormControl;
  }

  onItemSelectionChange(selectedItem: PItemMaster) {    
    this.reportForm.patchValue({
      item : selectedItem.id
    });
  }

  getReport() : void{
    this.overlayService.enableProgressSpinner();
    this.dataSource.data = [];
    this.reportService.getReportArg(this.reportForm.value).subscribe({
      next: (data) => {
        this.dataSource.data = data.itemPurchaseRateAnalysisReportLines || [];
        this.overlayService.disableProgressSpinner();
      }
    });
  }

  download(type: string) : void {

    let model: ItemPurchaseRateAnalysisServiceGetReportAsFile = {};
    model.type = type as ItemPurchaseRateAnalysisServiceGetReportAsFile.TypeEnum;
    model.arg = this.reportForm.value;

    this.reportService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == ItemPurchaseRateAnalysisServiceGetReportAsFile.TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
}
}
