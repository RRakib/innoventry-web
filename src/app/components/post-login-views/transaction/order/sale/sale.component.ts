import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { OverlayService } from 'src/app/services/overlay.service';
import { TransactionsProvider } from 'src/app/services/transactionsProvider';
import { ServiceServiceService, StockAttributeGroupLineServiceService, TaxConfigurationServiceService } from 'src/server';
import { BillingClassificationServiceService } from 'src/server/api/billingClassificationService.service';
import { ItemServiceService } from 'src/server/api/itemService.service';
import { LedgerAttributesServiceService } from 'src/server/api/ledgerAttributesService.service';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';
import { OtherChargesServiceService } from 'src/server/api/otherChargesService.service';
import { SaleOrderTxServiceService } from 'src/server/api/saleOrderTxService.service';
import { StockLocationServiceService } from 'src/server/api/stockLocationService.service';
import { TaxableEntityServiceService } from 'src/server/api/taxableEntityService.service';
import { VoucherNumberServiceService } from 'src/server/api/voucherNumberService.service';
import { ISaleOrderTx } from 'src/server/model/models';
import { SelectItemStockAttributeComponent } from '../modal-popup/select-item-stock-attribute/select-item-stock-attribute.component';
import { OrderTxComponent } from '../order-tx.component';

@Component({
  selector: 'app-sale',
  templateUrl: '../order-tx.component.html',
  styleUrls: ['../order-tx.component.css']
})
export class SaleComponent extends OrderTxComponent  implements OnInit {

  saleOrderTx : ISaleOrderTx;

  constructor(private saleBreakpointObserver: BreakpointObserver, private childFormBuilder : FormBuilder, 
    private dateAdapterService  : CustomDateAdapterService,private voucherNumberService : VoucherNumberServiceService,
    private ledgerService : LedgerServiceService, private childstockLocationService : StockLocationServiceService, 
    private childTaxableEntityService : TaxableEntityServiceService, private childTxProvider : TransactionsProvider, 
    private childLedgerAttributesService : LedgerAttributesServiceService, private childBillingClassificationService : BillingClassificationServiceService,
    private childOtherChargesService : OtherChargesServiceService, private _childSnackBar: MatSnackBar,
    private datePipe: DatePipe, private saleOrderTxService : SaleOrderTxServiceService,
    private overlayService : OverlayService,
    @Inject(MAT_DIALOG_DATA) public data: { txId: number }, public dialogRef: MatDialogRef<SaleComponent>,
    public dialog: MatDialog, private childItemService : ItemServiceService, 
    private childStockAttributeGroupLineService : StockAttributeGroupLineServiceService,
    private childTaxConfigurationService : TaxConfigurationServiceService,
    private childServiceApi : ServiceServiceService) {

    super(saleBreakpointObserver, childFormBuilder, 
      childstockLocationService, childTaxableEntityService,
      childTxProvider, childLedgerAttributesService, childBillingClassificationService,
      childOtherChargesService,_childSnackBar, ledgerService, childItemService, overlayService,
      childStockAttributeGroupLineService, dialog,
      302, childTaxConfigurationService, childServiceApi);

    this.headerTitle = 'Sale';
  }

  ngOnInit(): void {

    this.saleOrderTx = {};

    if (!!this.data.txId) {
      this.saleOrderTxService.findById(this.data.txId).subscribe({
        next: (data) => {
          this.saleOrderTx = data;
          this.initializeOrderTxForm();
        }
      });
    }else{
      this.initializeOrderTxForm();

      let txDate = this.datePipe.transform(new Date(),'yyyy-mm-dd HH:mm:ss');
      this.voucherNumberService.getNextVoucherNumber(txDate!, "in.solpro.nucleus.inventory.model.ISaleOrderTx", 0).subscribe({
          next: (data) =>{
            this.orderTxForm.patchValue({
              vouchernumber : data.voucherNumber
            });
          }
      });
    }

  }


  public initializeOrderTxForm() : void {
    //To fetch the cash ledger as a default ***by ledger***
    this.ledgerService.getCashLedger().subscribe({
      next: (data) => {
        this.cashLedger = data;
        
        this.orderTxForm = this.childFormBuilder.group({
          id: new FormControl(!!this.saleOrderTx.id ? this.saleOrderTx.id : undefined),
          transactiondate : new FormControl(this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          vouchernumber : new FormControl( {value: !!this.saleOrderTx.vouchernumber ? this.saleOrderTx.vouchernumber : '', disabled: true}, [ Validators.required]),
          referenceNo: new FormControl(!!this.saleOrderTx.referenceNo ? this.saleOrderTx.referenceNo : ''),
          ledgerId: new FormControl(!!this.saleOrderTx.ledger ? this.saleOrderTx.ledger : data.id),
          ledgerName: new FormControl(!!this.saleOrderTx.ledgerName ? this.saleOrderTx.ledgerName : data.name),
          contactId: new FormControl(!!this.saleOrderTx.contactId ? this.saleOrderTx.contactId : data.id),
          contactName: new FormControl(!!this.saleOrderTx.contactName ? this.saleOrderTx.contactName : data.name),   
          paymentLines: new FormControl(!!this.saleOrderTx.paymentLines ? this.saleOrderTx.paymentLines : []),
          billName: new FormControl(!!this.saleOrderTx.printName ? this.saleOrderTx.printName : data.name),
          billAmount: new FormControl(!!this.saleOrderTx.billAmount ? this.saleOrderTx.billAmount : 0),
          returnAmount: new FormControl(!!this.saleOrderTx.returnAmount ? this.saleOrderTx.returnAmount : 0)
        });

        //Get billing group associated with Transaction or Default(Cash) Ledger.
        this.getBillingGroup(!!this.saleOrderTx.ledger ? this.saleOrderTx.ledger : data.id, 302);

        //Initialize the item form on load and other properties.
        this.initializeItemForm();
        this.itemLines = !!this.saleOrderTx.taxableLines ? this.saleOrderTx.taxableLines : [];
        this.itemLinesDataSource.data = this.itemLines;

        // Inititalize the Other Charges Form and other properties.
        this.getOtherCharges();
        this.initializeOtherChargesDiscountForm();
        this.addedOtherCharges = !!this.saleOrderTx.otherChargesLines ? this.saleOrderTx.otherChargesLines : [];
        this.otherChargesDataSource.data = this.addedOtherCharges;

        // Inititalize Services Form and other properties.
        this.getServices();

        this.updateItemLinesTotalAmount();
        this.otherChargesTotalAmount.setValue(!!this.saleOrderTx.otherChargesTotal ? this.saleOrderTx.otherChargesTotal : 0);
        this.updateNetFinalAmount();

        this.isFormLoaded = true;
      },
      error: () => { }
    });
  } 

  public showItemStockAttributes(): void{
    if(this.itemForm.controls["itemName"].value == undefined || this.itemForm.controls["itemName"].value.length == 0){
      this.itemForm.controls["itemName"].addValidators([Validators.required]);    
      this.itemForm.controls["itemName"].updateValueAndValidity();
    }

    if(this.itemForm.valid && !!this.itemForm.controls["itemName"].value) {
      const StockAttributeDialogRef = this.dialog.open(SelectItemStockAttributeComponent, { 
        panelClass: 'custom-dialog-container', 
        data : {
          itemId : this.itemForm.controls["itemId"].value,
          quantity: this.itemForm.controls["quantity"].value,
          stockLocation : this.itemForm.controls["stockLocation"].value,
          isEditMode: this.itemLineEditMode,
          attributeGroupLines : this.itemForm.contains("attributeGroupLines") ?  this.itemForm.controls["attributeGroupLines"].value : []
        } ,
        disableClose: true,
        minWidth: 300
      }); 
      StockAttributeDialogRef.afterClosed().subscribe(result => {        
        if(!!result && result.length > 0){
          if(!this.itemForm.contains("attributeGroupLines")) {
            this.itemForm.addControl("attributeGroupLines",new FormControl());
          }
  
          this.itemForm.patchValue({
            attributeGroupLines : result
          });
        }
      });
    }
  }

  /**
   * Remove id attribute from every attribute group line in case of new sale transaction.
   * @param itemLines 
   */
  private modifyAttributeGroupLines(itemLines: import("src/server").IItemLine[]) {
    itemLines.forEach((itemLine) => {
      let attrGroupLines = itemLine.attributeGroupLines;
      attrGroupLines?.forEach((attrGroupLine) => {
        delete attrGroupLine.id;
      });
    });
  }

  public saveOrderTx(): void {
    if(this.netFinalAmount.value != 0) {

      this.overlayService.enableProgressSpinner();

      let  tx : ISaleOrderTx = {};

      // In case of edit of Sale Transaction.
      if(!!this.saleOrderTx.id) {
        tx = this.saleOrderTx;
      } 

      // Remove Id from AttributeGroupLine in case of new transaction.
      if(this.saleOrderTx.id == undefined) {
        this.modifyAttributeGroupLines(this.itemLines);
      }

      tx.jacksontype = "SaleOrderTxImpl";
      tx.id = this.saleOrderTx.id;
      tx.transactiondate = this.orderTxForm.controls["transactiondate"].value;
      tx.billAmount = this.orderTxForm.controls["billAmount"].value;
      tx.billingGroup = this.childTxProvider.billingGroup().id;
      tx.billingClassification = this.childTxProvider.billingClassification().id;
      tx.vouchernumber = this.orderTxForm.controls["vouchernumber"].value;
      tx.contactId = this.orderTxForm.controls["contactId"].value;
      tx.contactName = this.orderTxForm.controls["contactName"].value;
      tx.ledger = this.orderTxForm.controls["ledgerId"].value;
      tx.ledgerName = this.orderTxForm.controls["ledgerName"].value;
      tx.printName = this.orderTxForm.controls["billName"].value;
      tx.taxableLines = this.itemLines;
      tx.otherChargesLines = this.addedOtherCharges;
      tx.otherChargesTotal = this.otherChargesTotalAmount.value;
      tx.paymentLines = this.orderTxForm.controls["paymentLines"].value;
      tx.returnAmount = this.orderTxForm.controls["returnAmount"].value;
      
      if(!!tx.id) {
        this.saleOrderTxService.update(tx).subscribe({
          next: (data) => {            
            this.overlayService.disableProgressSpinner();
            this.dialogRef.close();
          },
          error: () => {
            this.overlayService.disableProgressSpinner();
          }
        });
      }else{
        this.saleOrderTxService.save(tx).subscribe({
          next: (data) => {          
            this.initializeOrderTxForm();
            this.overlayService.disableProgressSpinner();
          },
          error: () => {
            this.overlayService.disableProgressSpinner();
          }
        });
      }
      
    }
  }
}
