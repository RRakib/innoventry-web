import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransactionsProvider } from 'src/app/services/transactionsProvider';
import { IItemLine, IPaymentLine, IStockLocation, ITax, ITaxGroup, ITaxLine, PItemMaster, StockAttributeGroupLineServiceService, StockLocationServiceService, TaxableEntityServiceService } from 'src/server';

@Component({
  selector: 'app-item-selection-form',
  templateUrl: './item-selection-form.component.html',
  styleUrls: ['./item-selection-form.component.css']
})
export class ItemSelectionFormComponent implements OnInit {

  public itemForm!: FormGroup; 

  stockLocations : IStockLocation[];
  stockCountStatement: string = '';

  selectedItemtaxGroup: ITaxGroup;

  constructor(public itemSelectionFormComponent: MatDialogRef<ItemSelectionFormComponent>,
    private formBuilder : FormBuilder, private stockLocationService : StockLocationServiceService,
    private txProvider : TransactionsProvider,
    private stockAttributeGroupLineService : StockAttributeGroupLineServiceService, 
    private taxableEntityService : TaxableEntityServiceService,
    public itemSelectionCompRef: MatDialogRef<ItemSelectionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      itemForm: FormGroup,
      itemLineEditMode: boolean,
      itemLines: IItemLine[],
      selectedLineItemForEdit : IItemLine | undefined
    }) { }

  ngOnInit(): void {
    this.initializeItemForm();
  }

  /**
   * This function initializes the item form to default values.
   */
  public initializeItemForm() {

    this.itemForm = this.data.itemForm;

    this.updateStockLocation();
    
  }

  /**
 * This function updates the stock location.
 */
  public updateStockLocation() {
    this.stockLocationService.getObjects().subscribe({
      next: (data) => {
        if(!!data && data.length > 0) {
          this.stockLocations = data;
          this.itemForm.patchValue({
            stockLocation: data[0].id
          });
  
          this.txProvider.stockLocation(data[0]);
        }
      }
    });
  }

      /**
   * This is executed when item is being selected while adding an item in the list.
   * Autocomplete control.
   * @param selectedItem 
   */
  onItemSelectionChange(selectedItem: PItemMaster) {
    this.itemForm.patchValue({
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      mrp: selectedItem.mrp,
      quantity : 1,
      itemProductCode: selectedItem.productCode,
      discount : 0,
      unit: selectedItem.unitId,
      unitName: selectedItem.unitName     
    });  

    let rate = this.itemForm.controls["mrp"].value - ((this.itemForm.controls["mrp"].value * this.itemForm.controls["discount"].value)/100);

    this.itemForm.patchValue({
      rate: rate, 
      netRate: rate
    });
    
    if(!!selectedItem.taxClassId) {
      // This patches the tax group id,name in item form which will be further used to calculate the tax amount.
      this.updateTaxGroupLinkedToItemAndTaxAmount(selectedItem.taxClassId,"ITEM");      
    }else{
      this.itemForm.patchValue({
        taxableAmountBeforeBillDiscount : rate
      });
      this.updateTaxAmount(undefined);
    }

    // Below are the value change subscribers which updates the form values.
    // Executed when the form field values are updated.
    this.itemSelectionChangeSubscribers(selectedItem);

    this.getItemStockLocationCount();
  }

  /**
   * This method updates the tax group linked to item when an item is being selected from the list.
   * Also updates the taxGroup id and name for calculating the tax amount
   */
  private updateTaxGroupLinkedToItemAndTaxAmount(taxClassId: number | undefined, type: string) : void{

    if (type == 'ITEM') {
      this.itemForm.patchValue({
        taxGroup: '',
        taxGroupName: ''
      });
    }

    if(!!this.txProvider.billingClassification() && !!this.txProvider.billingClassification().id && 
      !!this.txProvider.billingGroup() && !!this.txProvider.billingGroup().id) {
        
      this.taxableEntityService.getTaxGroup(this.txProvider.billingClassification().id, this.txProvider.billingGroup().id, taxClassId).subscribe({
        next: (taxGroup) => {
          if (taxGroup) {
            if (type == 'ITEM') {
              this.selectedItemtaxGroup = taxGroup;

              this.itemForm.patchValue({
                taxGroup: taxGroup.id,
                taxGroupName: taxGroup.name
              });

              this.updateTax(taxGroup);
            }
          }
        }
      });  
    }else{
      this.updateTaxAmount();
    }
    
  }  

  updateTax(taxGroup: ITaxGroup) {

    let totalTaxValue : number = 0;

    let quantity = this.itemForm.controls['quantity'].value;
    if (quantity != 0) {
      if (this.itemForm.controls["isTaxDeductionFromAmountEnabled"].value) {
        let totalAmount = this.itemForm.controls["netRate"].value;
        let totalAmountTemp = this.itemForm.controls["netRate"].value;

        if (taxGroup && taxGroup.taxList) {
          totalTaxValue = !!taxGroup.taxRate ? taxGroup.taxRate : 0;
          for (let tax of taxGroup.taxList) {
            if (tax.fixed && tax.value && tax.taxOnTaxList) {
              totalAmountTemp = totalAmountTemp -  tax.value;
              for (let taxOnTax of tax.taxOnTaxList) {
                taxOnTax.value = !!taxOnTax.value ? taxOnTax.value : 0;
                totalAmountTemp = parseFloat((totalAmountTemp - (tax.value * taxOnTax.value / 100)).toFixed(2));
              }
            }

          }
        }
        let amountWithoutTax: number = parseFloat((totalAmountTemp * 100 / (100 + totalTaxValue)).toFixed(2));
        let taxAmount: number;
        let amount: number;
        let diff: number
        taxAmount = this.getTaxAmount(amountWithoutTax);
        amount = amountWithoutTax;
        amount = parseFloat((amount).toFixed(2));
        diff = parseFloat((totalAmount - (taxAmount + amount)).toFixed(2));
        if (diff != 0) {
          amount = amount + diff;
        }
        
        this.itemForm.controls['taxableAmountBeforeBillDiscount'].setValue(amount.toFixed(2));
        this.itemForm.controls['taxAmount'].setValue(taxAmount.toFixed(2));
        this.itemForm.controls['totalAmountBeforeBillDiscount'].setValue(totalAmount.toFixed(2));
      } else {
        let amount: number = this.itemForm.controls["netRate"].value;
        let taxAmount = this.getTaxAmount(amount);
        let totalAmount = amount + taxAmount;
        this.itemForm.controls['taxableAmountBeforeBillDiscount'].setValue((amount).toFixed(2));
        this.itemForm.controls['totalAmountBeforeBillDiscount'].setValue((totalAmount).toFixed(2));
        this.itemForm.controls['taxAmount'].setValue(taxAmount.toFixed(2));

      }
    } else {
      // this.commonUtils.showToastMessage('Quantity must have positive numeric value')
    }

  }

  /**
   * This method executed in following conditions :
   * 1. When tax group, quantity , discount is changed (From subscribers on form control)   
   * @param taxGroup 
   */
  private updateTaxAmount(taxGroup?: ITaxGroup | undefined) {

    let taxableAmount = this.itemForm.controls["taxableAmountBeforeBillDiscount"].value;
    if (!!taxGroup) {
      //update tax amount.
      let taxAmount = this.calculateTaxAmount(taxableAmount, taxGroup);

      let totalAmount = taxAmount + taxableAmount;

      this.itemForm.patchValue({
        taxAmount: taxAmount,        
        totalAmountBeforeBillDiscount : totalAmount
      });
    }else{ // In case if selected item has no tax class.
      this.itemForm.patchValue({
        taxAmount: 0,
        totalAmountBeforeBillDiscount : taxableAmount
      });
    }
  }

  /**
   * This function calculate the tax on item which is being added/edited.
   * @param taxableAmount 
   * @param taxGroup 
   * @returns 
   */
  calculateTaxAmount(taxableAmount: number, taxGroup: ITaxGroup): number {

    let itemTaxLines = new Array();
    let taxAmount: number = 0;
    let taxList = taxGroup.taxList;

    if(!!taxList) {

      taxList.forEach(tax => {
        if (!tax.taxOnTax) {
          let taxLine: ITaxLine = { jacksontype: "TaxLineImpl" };
          taxLine.tax = tax.id;
          taxLine.value = tax.value;
  
          let taxLineAmount: number = 0;
          taxLineAmount = parseFloat((taxableAmount * (!!taxLine.value ? taxLine.value : 0) / 100).toFixed(2));
          taxLine.amount = taxLineAmount;
          taxAmount = taxAmount + taxLineAmount;
          itemTaxLines.push(taxLine);
  
          tax.taxOnTaxList?.forEach(taxOnTax => {
            let taxOnTaxLine: ITaxLine = { jacksontype: "TaxLineImpl" };
            taxOnTaxLine.tax = taxOnTax.id;
            taxOnTaxLine.value = taxOnTax.value;
  
            let taxOnTaxLineAmount: number = 0;
            taxOnTaxLineAmount = parseFloat((taxLineAmount * (!!taxOnTaxLine.value ? taxOnTaxLine.value : 0) / 100).toFixed(2));
  
            taxOnTaxLine.amount = taxOnTaxLineAmount;
            taxAmount = taxAmount + taxOnTaxLineAmount;
            itemTaxLines.push(taxOnTaxLine);
            taxLine.taxOnTaxLines?.push(taxOnTaxLine);
            taxOnTaxLine.primaryTaxLine = false;
            taxLine.taxOnTaxAmount = (!!taxLine.taxOnTaxAmount ? taxLine.taxOnTaxAmount : 0) + taxOnTaxLineAmount;
          });

        }
      });
  
  
      let taxAmountWithoutTaxOnTax: number = taxAmount;
      taxList.forEach(tax => {
        if (tax.taxOnTax) {
          let taxLine: ITaxLine = { jacksontype: "TaxLineImpl" };
          taxLine.tax = tax.id;
          taxLine.value = tax.value;
  
          let taxLineAmount: number = 0;
          taxLineAmount = parseFloat((taxAmountWithoutTaxOnTax * (!!taxLine.value ? taxLine.value : 0) / 100).toFixed(2));
          taxLine.amount = taxLineAmount;
          taxAmount = taxAmount + taxLineAmount;
          itemTaxLines.push(taxLine);
        }
      });  
      
      this.itemForm.patchValue({
        taxLines: itemTaxLines
      });
    }

    return taxAmount;
  }

  getTaxAmount(amountWithoutTax: number, taxGroup?: ITaxGroup) {
    let taxList : ITax[] | undefined;

    let tg = this.itemForm.controls['taxGroup'].value
    if (tg) {
      taxGroup = this.selectedItemtaxGroup;
    }
    let taxAmount = 0;

    if (taxGroup != null) {
      taxList = !!taxGroup.taxList ? taxGroup.taxList : [];

      for (let tax of taxList) {
        let taxLineAmount = 0;
        let qty = this.itemForm.controls['quantity'].value;
        tax.value = !!tax.value ? tax.value : 0
        if (tax.fixed) {          
          taxLineAmount = tax.value * parseFloat(qty);
        }
        else {
          taxLineAmount = parseFloat((amountWithoutTax * tax.value / 100).toFixed(2));
        }

        taxAmount = taxAmount + taxLineAmount;

        if(!!tax.taxOnTaxList) {
          for (let taxOnTax of tax.taxOnTaxList) {
            taxOnTax.value = !!taxOnTax.value ? taxOnTax.value : 0;
            taxAmount = taxAmount + parseFloat((taxLineAmount * taxOnTax.value / 100).toFixed(2));
          }
        }
      }
    }
    return taxAmount;
  }

  private itemSelectionChangeSubscribers(selectedItem: PItemMaster) {

    this.itemForm.controls["quantity"].valueChanges.subscribe({
      next: (data) => {

        if(!!data) { // Don't update values if form is reset
          let rate = data * this.itemForm.controls["rate"].value;
          let discount = this.itemForm.controls["discount"].value;
  
          rate = rate - ((rate * discount) / 100);
  
          this.itemForm.patchValue({
            netRate: rate
          });
  
          this.updateTaxesAfterValueChanges(selectedItem, rate);
        }
        
      }
    });

     this.itemForm.controls["rate"].valueChanges.subscribe({
      next: (data) => {
        let rate = 0;
        
        if(!!data) { // Don't update values if form is reset
          rate  = data * this.itemForm.controls["quantity"].value;
          let discount = this.itemForm.controls["discount"].value;

          rate = rate - ((rate  * discount) / 100);

          this.itemForm.patchValue({
            netRate: rate
          });           
        }else{
          this.itemForm.patchValue({
            netRate: rate
          }); 
        }
        
        this.updateTaxesAfterValueChanges(selectedItem, rate);
      }
    });

    this.itemForm.controls["discount"].valueChanges.subscribe({
      next: (data) => {

        if(!!data) {// Don't update values if form is reset
          let rate = this.itemForm.controls["quantity"].value * this.itemForm.controls["rate"].value;

          rate = rate - ((rate * data) / 100);
  
          this.itemForm.patchValue({
            netRate: rate
          });
  
          this.updateTaxesAfterValueChanges(selectedItem, rate);
        }
        
      }
    });
  }

  /**
   * This function is executed when the tax class is selected
   * The selected tax class displayname is used to get the selected tax id to set in the FormGroup.
   * @param event 
  */
  public onTaxGroupSelectionChanged(selectedTaxGroup : ITaxGroup) {

    if(!!selectedTaxGroup){
      this.selectedItemtaxGroup = selectedTaxGroup;

      this.itemForm.patchValue({
        taxGroup: selectedTaxGroup.id,
        taxGroupName: selectedTaxGroup.name
      });

      this.updateTax(selectedTaxGroup); 
    }

  } 

  private updateTaxesAfterValueChanges(selectedItem: PItemMaster, rate: number) {
    if (!!this.itemForm.controls["taxGroup"].value) {
      // This patches the tax group id,name in item form which will be further used to calculate the tax amount.
      this.updateTaxGroupLinkedToItemAndTaxAmount(selectedItem.taxClassId, "ITEM");
    } else {
      this.itemForm.patchValue({
        taxAmount: 0,
        totalAmountBeforeBillDiscount: rate
      });
    }
  }


  public getItemStockLocationCount() {
    this.stockCountStatement = '';
    
    this.stockAttributeGroupLineService.getStockableAttributeGroupLines(this.itemForm.controls["itemId"].value, this.itemForm.controls["stockLocation"].value).subscribe({
      next: (data) => {
        if(!!data && data.length > 0) {
          let totalQuantity =  data.reduce(function (acc, obj) { return acc + (!!obj.quantity ?  obj.quantity : 0); }, 0);
          this.stockCountStatement = `Current Stock : ${totalQuantity} ${this.itemForm.controls["unitName"].value}`;          
        }else {
          this.stockCountStatement = `Current Stock : 0 ${this.itemForm.controls["unitName"].value}`;
        }
      }
    });
  }

  /**
   * This function is executed when user adds an item as item line from 'ADD ITEM' button.
   * Also executed when user edit an already added item line.
   */
  public addOrEditItemLine() : void {
      this.itemSelectionCompRef.close();
  }
  

  getItemFormControl(name: string) {
    return this.itemForm.get(name) as FormControl;
  }

}
