import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay, startWith } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { IItemGroup, StockSummaryReportInput2, StockSummaryReportLine, StockSummaryReportService2GetReportAsFile } from 'src/server';
import { ItemGroupServiceService } from 'src/server/api/itemGroupService.service';
import { StockSummaryReportService2Service } from 'src/server/api/stockSummaryReportService2.service';

@Component({
  selector: 'app-stock-summary',
  templateUrl: './stock-summary.component.html',
  styleUrls: ['./stock-summary.component.css']
})
export class StockSummaryComponent implements OnInit, AfterViewInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );


  stockSummaryForm : FormGroup;
  isFormLoaded : boolean = false;

  // Item Groups and Search with auto-complete
  itemGroups: IItemGroup[];
  filteredItemGroups : Observable<IItemGroup[]>;  
  itemGroupSelected : boolean = false;

  stockSummaryInput : StockSummaryReportInput2;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['itemName', 
   'quantity', 
   'unitDisplayName', 
   'rate',
   'amount'
  ]; 

  dataSource = new MatTableDataSource<StockSummaryReportLine>([]); 
  @ViewChild(MatPaginator) paginator :any = MatPaginator;

  constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder,
    private overlayService : OverlayService, private itemGroupService : ItemGroupServiceService,
    private customDateAdapterService  : CustomDateAdapterService, private stockSummaryService : StockSummaryReportService2Service,
    private downloadService : DownloadService) { }

  ngOnInit(): void {

    let txDate = new Date();
    this.stockSummaryInput = {};

    this.itemGroupService.getObjects().subscribe({
      next: (data) => {
        this.itemGroups = data;

        this.stockSummaryForm = this.formBuilder.group({
          stockType: new FormControl('openingStock'),
          itemGroupId: new FormControl(),
          itemGroupName: new FormControl(),
          summaryAsOn : new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
          qtyGreaterThan: new FormControl(),
          qtyLesserThan: new FormControl(),
          showItemWithZeroStock: new FormControl(true)
        });

        this.getItemGroups();
        this.isFormLoaded = true;
      }
    });    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  } 

  /**
   * This function get all the available item groups
   * And bind the auto-complete textbox with the valueChanges event.
  */
  private getItemGroups() : void {
      this.filteredItemGroups = this.stockSummaryForm.controls["itemGroupName"].valueChanges.pipe(startWith(this.stockSummaryForm.controls["itemGroupName"].value), map(value => this._filterItemGroups(value || '')));
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
      this.stockSummaryForm.patchValue({
        groupId: selectedItemGroup.id
      });
    }

    this.itemGroupSelected = true;
    this.stockSummaryForm.controls["itemGroupName"].setErrors(null);
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
      this.stockSummaryForm.patchValue({
        groupId: null
      });
    }
    return this.itemGroups.filter(option => option.name!.toLowerCase().includes(filterValue));
  }

  keyUpItemGroupTyping(event : any) : void{
    this.itemGroupSelected = false;
  }

  blurItemGroupSelection(event : any) : void{
    if(!this.itemGroupSelected){
      this.stockSummaryForm.controls["itemGroupName"].setErrors({forbiddenNames: { value: 'Please click on any suggestion to select'}});    
    }
  }

  getStockSummaryReport() : void{

    this.dataSource.data = [];

    this.setStockSummaryInput();

    this.overlayService.enableProgressSpinner();

    this.stockSummaryService.getReportArg(this.stockSummaryInput).subscribe({
      next: (data) => {
        this.dataSource.data = data.reportLines || [];
        this.overlayService.disableProgressSpinner();
      }
    });
  }

  private setStockSummaryInput() {
    this.stockSummaryInput.group = this.stockSummaryForm.controls["itemGroupName"].value;
    this.stockSummaryInput.date = this.stockSummaryForm.controls["summaryAsOn"].value;

    let showOpening = this.stockSummaryForm.controls["stockType"].value;

    if (showOpening == 'openingStock') {
      this.stockSummaryInput.showOpening = true;
    } else {
      this.stockSummaryInput.showOpening = false;
    }

    let minQuantity = this.stockSummaryForm.controls["qtyGreaterThan"].value;

    if (minQuantity != undefined && minQuantity != 0) {
      this.stockSummaryInput.minQuantity = minQuantity;
      this.stockSummaryInput.useMinQuantity = true;
    } else {
      this.stockSummaryInput.useMinQuantity = false;
      this.stockSummaryInput.minQuantity = 0;
    }

    let maxQuantity = this.stockSummaryForm.controls["qtyLesserThan"].value;

    if (maxQuantity != undefined && maxQuantity != 0) {
      this.stockSummaryInput.maxQuantity = maxQuantity;
      this.stockSummaryInput.useMaxQuantity = true;
    }
    else {
      this.stockSummaryInput.useMaxQuantity = false;
      this.stockSummaryInput.maxQuantity = 0;
    }
  }

  download(type: string) : void {

    let model: StockSummaryReportService2GetReportAsFile  = {};
    model.type = type as StockSummaryReportService2GetReportAsFile .TypeEnum;    
    this.setStockSummaryInput();
    model.arg = this.stockSummaryInput;

    this.stockSummaryService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == StockSummaryReportService2GetReportAsFile.TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }
}
