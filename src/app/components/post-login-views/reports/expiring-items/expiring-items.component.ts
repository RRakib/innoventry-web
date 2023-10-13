import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {Observable, map, shareReplay, startWith} from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { EditReportService } from 'src/app/services/editReport.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { CommonUtils } from 'src/app/shared/utils/commonUtils';
import {
  ExpiringItems, ExpiringItemsLine, ExpiringItemsReportServiceGetReportAsFile,
  ExpiringItemsReportServiceService,
  IItem, IItemGroup, ItemGroupServiceService,
  ItemTransactionRegisterReportArgument,
  ItemTransactionRegisterReportLine,
  ItemTransactionRegisterReportServiceGetReportAsFile,
  PItemMaster
} from 'src/server';
import { ItemServiceService } from 'src/server/api/itemService.service';
import { ItemTransactionRegisterReportServiceService } from 'src/server/api/itemTransactionRegisterReportService.service';
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

@Component({
  selector: 'app-item-tx-register',
  templateUrl: './expiring-items.component.html',
  styleUrls: ['./expiring-items.component.css']
})
export class ExpiringItemsComponent implements OnInit, AfterViewInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  itemGroupSelected : boolean = false;
  reportForm : FormGroup;
  itemTxRegisterForm: FormGroup;
  itemTxRegisterReportArg: ItemTransactionRegisterReportArgument;

    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
    displayedColumns = ['date', 
    'item',
    'batch',
    'mgfDate',
    'expDate',
    'stock',
  ];

  reportLines : ExpiringItemsLine[];
  itemGroups: IItemGroup[];
  isFormLoaded : boolean = false;
  filteredItemGroups : Observable<IItemGroup[]>;
  dataSource = new MatTableDataSource<ItemTransactionRegisterReportLine>([]); 
  @ViewChild(MatPaginator) paginator :any = MatPaginator;

  selectedTxId = -1;

  constructor(
      private breakpointObserver: BreakpointObserver,
      private overlayService : OverlayService,
      private formBuilder : FormBuilder, 
      private customDateAdapterService : CustomDateAdapterService,
      private itemGroupService : ItemGroupServiceService,
      private commonUtils : CommonUtils, 
      private editReportService : EditReportService,
      private itemService : ItemServiceService,
      private expiringItemService : ExpiringItemsReportServiceService, 
      private downloadService : DownloadService) { }

  ngOnInit(): void {

    this.itemTxRegisterReportArg = {};
    this.reportLines = [];
    let txDate = new Date();

    this.itemTxRegisterForm = this.formBuilder.group({
      itemName: new FormControl('', [Validators.required]),
      dateFrom: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
      dateTo: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
      transType: new FormControl('All'),
      item: new FormControl()
    });

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

    this.editReportService.reportEdited().subscribe({
      next: (data) =>{
        if(data) {
          this.getReport();       
        }
      }
    });

  }

  keyUpItemGroupTyping(event : any) : void{
    this.itemGroupSelected = false;
  }
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

  blurItemGroupSelection(event : any) : void{
    if(!this.itemGroupSelected){
      this.reportForm.controls["itemGroupName"].setErrors({forbiddenNames: { value: 'Please click on any suggestion to select'}});
    }
  }
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

  private getItemGroups() : void {
    this.filteredItemGroups = this.reportForm.controls["itemGroupName"].valueChanges.pipe(startWith(this.reportForm.controls["itemGroupName"].value), map(value => this._filterItemGroups(value || '')));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getItemFormControl(name: string) {
    return this.itemTxRegisterForm.get(name) as FormControl;
  }

  onItemSelectionChange(selectedItem: PItemMaster) {
    this.itemService.findByName(selectedItem.name).subscribe({
      next: (data) => {
        this.itemTxRegisterForm.patchValue({
          item: data
        });
      }
    });
  }

  highlight(row : ItemTransactionRegisterReportLine){
    this.selectedTxId = row.transaction?.id || -1;
  }

  getReport() : void {
    this.itemTxRegisterForm.markAllAsTouched();  

    if(this.itemTxRegisterForm.valid && this.itemTxRegisterForm.controls["item"].value != undefined){

      this.overlayService.enableProgressSpinner();
      this.expiringItemService.getReportArg(this.itemTxRegisterForm.value).subscribe({
        next: (data) => {
          this.reportLines = data.itemExpiringLine || [];
          this.dataSource.data = this.reportLines;
          
          this.overlayService.disableProgressSpinner();
        },error: () => {
          this.overlayService.disableProgressSpinner();
        }
      });

    }
  }

  download(type: string) : void {

    let model: ExpiringItemsReportServiceGetReportAsFile   = {};
    model.type = type as ExpiringItemsReportServiceGetReportAsFile  .TypeEnum;
    model.arg = this.itemTxRegisterForm.value;

    this.expiringItemService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == ExpiringItemsReportServiceGetReportAsFile.TypeEnum.PDF
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }
}
