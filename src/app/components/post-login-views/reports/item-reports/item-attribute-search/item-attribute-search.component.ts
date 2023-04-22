import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { ItemAttributeSearchReportLineModel } from 'src/app/models/ItemAttributeSearchReportLineModel';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { OverlayService } from 'src/app/services/overlay.service';
import { AttributeServiceService, IAttribute, IItem, ItemAttributeSearchReportArgument, ItemAttributeSearchReportLine, ItemAttributeSearchReportServiceService, ItemServiceService, PItemMaster } from 'src/server';

@Component({
  selector: 'app-item-attribute-search',
  templateUrl: './item-attribute-search.component.html',
  styleUrls: ['./item-attribute-search.component.css']
})
export class ItemAttributeSearchComponent implements OnInit, AfterViewInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  itemAttributeSearchForm: FormGroup;
  itemAttributeSearchArg: ItemAttributeSearchReportArgument;

  selectedItem : IItem | undefined;  
  attributeList : IAttribute[]; // Fetched from server.
  selectedAttribute : IAttribute | undefined;
  filteredAttributeList:  Observable<IAttribute[]>; //Filtered Attributes from Attributes List as per attributeName

   /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'date', 
   'ledgerName', 
   'txType',
   'voucherNo',
   'itemName',
   'itemProductCode'
  ];

  reportLines : ItemAttributeSearchReportLineModel[] = [];
  dataSource = new MatTableDataSource<ItemAttributeSearchReportLineModel>([]);  

  @ViewChild(MatPaginator) paginator :any = MatPaginator;

  isFormLoaded: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver, private overlayService : OverlayService,
    private formBuilder : FormBuilder, private customDateAdapterService : CustomDateAdapterService,
    private itemService : ItemServiceService, private attributeServiceApi : AttributeServiceService,
    private itemAttributeSearchApi : ItemAttributeSearchReportServiceService) { }

  ngOnInit(): void {

    this.itemAttributeSearchArg = {};
    this.reportLines = [];
    let txDate = new Date();

    this.attributeServiceApi.getObjects().subscribe({
      next: (data) => {
        this.attributeList = data;

        this.itemAttributeSearchForm = this.formBuilder.group({
          itemName: new FormControl(),
          itemCode: new FormControl(),
          attributeId: new FormControl(),
          attributeValue: new FormControl(),
          startDate: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
          endDate: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate()))
        });    

        this.isFormLoaded = true;
      },
      error: () => {
        
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  onItemSelectionChange(selectedItem: PItemMaster) {
    this.itemService.findByName(selectedItem.name).subscribe({
      next: (data) => {
        this.selectedItem = data;
      }
    });
  }

  changeSelectedAttribute() : void{
    this.selectedAttribute = this.attributeList.find((attr) => attr.id == this.itemAttributeSearchForm.controls["attributeId"].value);
  }
  
  getItemFormControl(name: string) {
    return this.itemAttributeSearchForm.get(name) as FormControl;
  }

  getReport() : void{
    this.reportLines = [];
    this.dataSource.data = [];
    this.itemAttributeSearchArg = {};

    this.itemAttributeSearchArg.dateFrom = this.itemAttributeSearchForm.controls["startDate"].value;
    this.itemAttributeSearchArg.dateTo = this.itemAttributeSearchForm.controls["endDate"].value;
    this.itemAttributeSearchArg.item = this.selectedItem;
    this.itemAttributeSearchArg.attribute = this.selectedAttribute;
    this.itemAttributeSearchArg.attributeValue = this.itemAttributeSearchForm.controls["attributeValue"].value;

    this.itemAttributeSearchApi.getReportArg(this.itemAttributeSearchArg).subscribe({
      next: (data) =>{        
        if(!!data.reportlines) {
          data.reportlines?.forEach((element, index) => {
            let reportLineData : ItemAttributeSearchReportLineModel  = element;
            reportLineData.date = element.transaction?.transactionDate;
            reportLineData.ledgerName = element.ledgerName;
            reportLineData.txType = element.transaction?.typeName;
            reportLineData.voucherNo = element.transaction?.voucherNo;
            reportLineData.itemName = element.itemName;
            reportLineData.itemProductCode = element.itemProductCode;
  
            this.reportLines.push(reportLineData);
          });

          this.dataSource.data = this.reportLines;
        }       
      }
    });
  }
}
