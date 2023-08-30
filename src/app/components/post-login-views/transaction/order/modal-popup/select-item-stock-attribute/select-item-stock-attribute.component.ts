import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { AttributeLine } from 'src/app/models/AttributeLine';
import { DynamicPropertyObject } from 'src/app/models/DynamicPropertyObject';
import { AttributeLineImpl, IAttributeLine, IItemAttributeGroupLine, IStockAttributeGroupLine, ItemAttributeGroupLineServiceService, ItemServiceService, StockAttributeGroupLineServiceService } from 'src/server';

@Component({
  selector: 'app-select-item-stock-attribute',
  templateUrl: './select-item-stock-attribute.component.html',
  styleUrls: ['./select-item-stock-attribute.component.css']
})
export class SelectItemStockAttributeComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
  public stockAttrLinesForm!: FormGroup;

  isAttributeLinesFetched : boolean = false;
  
  dataSource = new MatTableDataSource<any>([]);
   /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns : Array<string> = ['Quantity'];
  selectedAttrValues : Array<any> = [];

  constructor(private breakpointObserver: BreakpointObserver, private itemService : ItemServiceService, private formBuilder : FormBuilder,
    public stockAttributeCompRef: MatDialogRef<SelectItemStockAttributeComponent>,
    private _snackBar: MatSnackBar, private stockAttributeGrpLineService : StockAttributeGroupLineServiceService,
    @Inject(MAT_DIALOG_DATA) public data: { 
      itemId: number, 
      quantity: number, 
      stockLocation: number,
      isEditMode : boolean,
      attributeGroupLines : Array<IItemAttributeGroupLine>
    }) { }

  ngOnInit(): void {
    this.stockAttributeGrpLineService.getStockableAttributeGroupLines(this.data.itemId, this.data.stockLocation).subscribe({
      next: (data) => {
        if(!!data && data.length > 0) {
          this.stockAttrLinesForm = this.formBuilder.group({
            stockAttrLines: this.formBuilder.array([])
          });
          this.isAttributeLinesFetched = true;
          this.prepareStockLineHeaderAndLines(data);

        }else{
          this.isAttributeLinesFetched = false;
          this.stockAttributeCompRef.close([]);
        }
      }
    });
  }

  /**
   * 1. Prepare Stock Attribute Headers.
   * 2. Prepare Stock Lines.
   * @param data 
   */
  private prepareStockLineHeaderAndLines(data: IStockAttributeGroupLine[]) : void{
    let attributeLines = data[0].attributeLines;

    attributeLines?.forEach((attrLine) => {
      if(!!attrLine.attributeName) {
        this.displayedColumns.push(attrLine.attributeName);
      }
    });

    // Prepare stock lines.
    this.prepareStockLines(data);
  }


  /**
   * Prepare stock Lines 
   * In case of new transaction : Prepare stock lines from stock attribute group lines.
   * In case of saved transaction : Prepare stock lines from attribute group lines.
   * @param data 
   */
  private prepareStockLines(data: IStockAttributeGroupLine[]) {
    this.dataSource.data = [];

    // If this.data.attributeGroupLines available then take attribute group lines otherwise take stock attribute group lines.
    data = !!this.data.attributeGroupLines && this.data.attributeGroupLines.length > 0 ? this.data.attributeGroupLines : data;

    data.forEach((attrGroupLine) => {
      let attrLines = Object.assign([], attrGroupLine.attributeLines);

      if(!!attrLines && attrLines.length > 0) {
        let generatedRow =  this.generateTableRow(attrLines);
        this.selectedAttrValues.push(generatedRow);

        // Add Quantity attribute as Default
        this.getStockAttrLines.push(this.formBuilder.group({ 
          jacksontype: new FormControl("ItemAttributeGroupLineImpl"), 
          id: new FormControl(attrGroupLine.id), // This will be removed while saving tx in case of new transaction.
          quantity: new FormControl(!!this.data.attributeGroupLines && this.data.attributeGroupLines.length > 0 ? attrGroupLine.quantity : 0),
          attributeLines: new FormControl(this.createSaleAttributeLines(attrLines))
        }));
      }
    });

    this.dataSource.data = this.selectedAttrValues;
  }
  
  private createSaleAttributeLines(attrLines: IAttributeLine[]) : AttributeLine[]{
    let attributeLines : AttributeLine[] = [];

    attrLines.forEach((attrLine) => {
      let attributeLine : AttributeLine = new AttributeLine();
      attributeLine.jacksontype = "AttributeLineImpl";  
    
      attributeLine.attributeId = !!attrLine.attributeId ? attrLine.attributeId : 0;
      attributeLine.attributeName = !!attrLine.attributeName ? attrLine.attributeName : '';
      attributeLine.value = !!attrLine.value ? attrLine.value : '';

      attributeLines.push(attributeLine);
    });

    return attributeLines;
  }

  private generateTableRow(attrGroupLines: IAttributeLine[]) {
    let propKeyValue = new DynamicPropertyObject();  

    for (let i = 0; i < attrGroupLines.length; i++) {
      let attrGroupLine: AttributeLineImpl = attrGroupLines[i];

      if(!!attrGroupLine.attributeName) {            
        propKeyValue.set(attrGroupLine.attributeName, attrGroupLine.value);
      }
    }

    return propKeyValue.items;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    //this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  saveStockAttributes() : void{

    let attributeGroupLines  = [];

    for(let i = 0; i < this.getStockAttrLines.length ; i++){
      let formGroup =  this.getStockAttrLines.at(i) as FormGroup;
      attributeGroupLines.push(formGroup.value);      
    }

    if(!!attributeGroupLines && attributeGroupLines.length > 0) {
      const quantityAdded = attributeGroupLines.reduce(function (acc, obj) { return acc + (!!obj.quantity ?  obj.quantity : 0); }, 0);
      if(!(quantityAdded == this.data.quantity)) {
        this._snackBar.open(`Total Quantity should not exceed : ${this.data.quantity}`,'Close', {
          duration: 2000
        });  
      }else{    
        this.stockAttributeCompRef.close(attributeGroupLines);
      }
    }    
  }

  cancelAddOrUpdate() : void{
    this.stockAttributeCompRef.close(this.data.attributeGroupLines);
  }

  // Function to get attributes from Parent FormGroup.
  get getStockAttrLines() {
    return this.stockAttrLinesForm.controls["stockAttrLines"] as FormArray;
  }

  public getFormGroupByStockLineIndex(rowIndex : number) {
    return this.getStockAttrLines.at(rowIndex) as FormGroup;
  }

}
