import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, shareReplay, startWith } from 'rxjs';
import { ItemPurchaseRateVariation } from 'src/app/models/ItemPurchaseRateVariation';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { IItemGroup, ItemPurchaseRateAnalysisReportArgument, ItemPurchaseRateVariationAnalysisReportServiceGetReportAsFile } from 'src/server';
import { ItemGroupServiceService } from 'src/server/api/itemGroupService.service';
import { ItemPurchaseRateVariationAnalysisReportServiceService } from 'src/server/api/itemPurchaseRateVariationAnalysisReportService.service';

@Component({
  selector: 'app-item-purchase-rate-variation-analysis',
  templateUrl: './item-purchase-rate-variation-analysis.component.html',
  styleUrls: ['./item-purchase-rate-variation-analysis.component.css']
})
export class ItemPurchaseRateVariationAnalysisComponent implements OnInit {

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
  displayedColumns = ['name', 
   'minPurchasePrice', 
   'maxPurchasePrice', 
   'variation'
  ]; 

  dataSource = new MatTableDataSource<ItemPurchaseRateVariation>([]); 

  constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder,
    private overlayService : OverlayService, private itemGroupService : ItemGroupServiceService,
    private customDateAdapterService  : CustomDateAdapterService,
    private reportServiceApi: ItemPurchaseRateVariationAnalysisReportServiceService,
    private downloadService : DownloadService) { }

  ngOnInit(): void {
    let txDate = new Date();
    

    this.itemGroupService.getObjects().subscribe({
      next: (data) => {
        this.itemGroups = data;

        this.reportForm = this.formBuilder.group({
          itemGroup: new FormControl(),
          itemGroupName: new FormControl(),
          dateFrom : new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
          dateTo : new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
          txtPurchasePriceVariation: new FormControl()
        });

        this.getItemGroups();
        this.isFormLoaded = true;
      }
    });    
  }

   /**
   * This function get all the available item groups
   * And bind the auto-complete textbox with the valueChanges event.
  */
    private getItemGroups() : void {
      this.filteredItemGroups = this.reportForm.controls["itemGroupName"].valueChanges.pipe(startWith(this.reportForm.controls["itemGroupName"].value), map(value => this._filterItemGroups(value || '')));
  }

  
  /**
   * This function is executed when the item group is selected
   * The selected unit displayname is used to get the selected unit ID to set in the FormGroup.
   * @param event 
   */
   public onItemGroupSelectionChanged(event : MatAutocompleteSelectedEvent) {    
    const filterValue = event.option.value.toLowerCase();

    let selectedItemGroup  = this.itemGroups.find((itemGroup) => itemGroup.name?.toLowerCase().includes(filterValue));

    if(!!selectedItemGroup){
      this.reportForm.patchValue({
        itemGroup: selectedItemGroup.id
      });
    }

    this.itemGroupSelected = true;
    this.reportForm.controls["itemGroupName"].setErrors(null);
  }

  
  /**
   * This function is executed when user enters any text for searching item groups.
   * The input element is bind with valueChanges event in function getItemGroups()
   * @param value User Input
   * @returns 
   */
   private _filterItemGroups(value: string): IItemGroup[] {

    //filter value will be null in new and actual value in edit mode.
    const filterValue = !!value ? value.toLowerCase() : '';

    if(filterValue.length == 0) {
      this.reportForm.patchValue({
        itemGroup: null
      });
    }
    return this.itemGroups.filter(option => option.name!.toLowerCase().includes(filterValue));
  }

  keyUpItemGroupTyping(event : any) : void{
    this.itemGroupSelected = false;
  }

  blurItemGroupSelection(event : any) : void{
    if(!this.itemGroupSelected){
      this.reportForm.controls["itemGroupName"].setErrors({forbiddenNames: { value: 'Please click on any suggestion to select'}});    
    }
  }

  getReport() : void{

    this.dataSource.data = [];

    this.reportServiceApi.getReportArg(this.reportForm.value).subscribe({
      next: (data) => {
        if(!!data && !!data.itemPurchaseRateVariationAnalysisReportLines && data.itemPurchaseRateVariationAnalysisReportLines?.length > 0) {

          let resultReportLines : Array<ItemPurchaseRateVariation> = [];
          data.itemPurchaseRateVariationAnalysisReportLines.forEach((reportLine) => {
            let reportRow : ItemPurchaseRateVariation = {};

            reportRow.name = reportLine.item?.name;
            reportRow.minPurchasePrice = reportLine.minPurchasePrice;
            reportRow.maxPurchasePrice = reportLine.maxPurchasePrice;
            reportRow.variation = reportLine.variation;
            
            resultReportLines.push(reportRow);
          });

          this.dataSource.data = resultReportLines;

        }
      }
    });
  }

  download(type: string) : void {

    let model: ItemPurchaseRateVariationAnalysisReportServiceGetReportAsFile = {};
    model.type = type as ItemPurchaseRateVariationAnalysisReportServiceGetReportAsFile.TypeEnum;
    model.arg = this.reportForm.value;

    this.reportServiceApi.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == ItemPurchaseRateVariationAnalysisReportServiceGetReportAsFile.TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
}

}
