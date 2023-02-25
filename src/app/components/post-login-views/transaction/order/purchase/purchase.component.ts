import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { OverlayService } from 'src/app/services/overlay.service';
import { TransactionsProvider } from 'src/app/services/transactionsProvider';
import { IPurchaseOrderTx, StockAttributeGroupLineServiceService, TaxConfigurationServiceService } from 'src/server';
import { BillingClassificationServiceService } from 'src/server/api/billingClassificationService.service';
import { ItemServiceService } from 'src/server/api/itemService.service';
import { LedgerAttributesServiceService } from 'src/server/api/ledgerAttributesService.service';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';
import { OtherChargesServiceService } from 'src/server/api/otherChargesService.service';
import { PurchaseOrderTxServiceService } from 'src/server/api/purchaseOrderTxService.service';
import { StockLocationServiceService } from 'src/server/api/stockLocationService.service';
import { TaxableEntityServiceService } from 'src/server/api/taxableEntityService.service';
import { VoucherNumberServiceService } from 'src/server/api/voucherNumberService.service';
import { ConfigureItemStockAttributeComponent } from '../modal-popup/configure-item-stock-attribute/configure-item-stock-attribute.component';
import { OrderTxComponent } from '../order-tx.component';

@Component({
  selector: 'app-purchase',
  templateUrl: '../order-tx.component.html',
  styleUrls: ['../order-tx.component.css']
})
export class PurchaseComponent extends OrderTxComponent  implements OnInit {

  purchaseOrderTx : IPurchaseOrderTx;

  constructor(private purchaseBreakpointObserver: BreakpointObserver, private childFormBuilder : FormBuilder, 
    private dateAdapterService  : CustomDateAdapterService,private voucherNumberService : VoucherNumberServiceService,
    private ledgerService : LedgerServiceService, private childstockLocationService : StockLocationServiceService, 
    private childTaxableEntityService : TaxableEntityServiceService, private childTxProvider : TransactionsProvider, 
    private childLedgerAttributesService : LedgerAttributesServiceService, private childBillingClassificationService : BillingClassificationServiceService,
    private childOtherChargesService : OtherChargesServiceService, private _childSnackBar: MatSnackBar, 
    private datePipe: DatePipe, private overlayService : OverlayService, private purchaseOrderTxService : PurchaseOrderTxServiceService,
    @Inject(MAT_DIALOG_DATA) public data: { txId: number },
    public dialogRef: MatDialogRef<PurchaseComponent>, 
    private childItemService : ItemServiceService, public dialog: MatDialog, 
    private childStockAttributeGroupLineService : StockAttributeGroupLineServiceService,
    private childTaxConfigurationService : TaxConfigurationServiceService) {

    super(purchaseBreakpointObserver, childFormBuilder, childstockLocationService, 
      childTaxableEntityService, childTxProvider, childLedgerAttributesService,
      childBillingClassificationService,childOtherChargesService, _childSnackBar,
      ledgerService, childItemService,overlayService, childStockAttributeGroupLineService, dialog, 301, childTaxConfigurationService);

    this.headerTitle = 'Purchase';
  }

  ngOnInit(): void {

    this.purchaseOrderTx = {};

    if (!!this.data.txId) {
      this.purchaseOrderTxService.findById(this.data.txId).subscribe({
        next: (data) => {
          this.purchaseOrderTx = data;
          this.initializeOrderTxForm();
        }
      });
    }else{
      this.initializeOrderTxForm();
      let txDate = this.datePipe.transform(new Date(),'yyyy-mm-dd HH:mm:ss');
      this.voucherNumberService.getNextVoucherNumber(txDate!, "in.solpro.nucleus.inventory.model.IPurchaseOrderTx", 0).subscribe({
          next: (data) =>{
            this.orderTxForm.patchValue({
              vouchernumber : data.voucherNumber
            });
            this.orderTxForm.controls["vouchernumber"].enable();              
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
          id: new FormControl(!!this.purchaseOrderTx.id ? this.purchaseOrderTx.id : undefined),
          transactiondate : new FormControl(this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          vouchernumber : new FormControl( {value: !!this.purchaseOrderTx.vouchernumber ? this.purchaseOrderTx.vouchernumber : '', disabled: true}, [ Validators.required]),
          referenceNo: new FormControl(!!this.purchaseOrderTx.referenceNo ? this.purchaseOrderTx.referenceNo : ''),
          ledgerId: new FormControl(!!this.purchaseOrderTx.ledger ? this.purchaseOrderTx.ledger : data.id),
          ledgerName: new FormControl(!!this.purchaseOrderTx.ledgerName ? this.purchaseOrderTx.ledgerName : data.name),
          contactId: new FormControl(!!this.purchaseOrderTx.contactId ? this.purchaseOrderTx.contactId : data.id),
          contactName: new FormControl(!!this.purchaseOrderTx.contactName ? this.purchaseOrderTx.contactName : data.name),
          paymentLines: new FormControl(!!this.purchaseOrderTx.paymentLines ? this.purchaseOrderTx.paymentLines : []),
          billName: new FormControl(!!this.purchaseOrderTx.printName ? this.purchaseOrderTx.printName : data.name),
          billAmount: new FormControl(!!this.purchaseOrderTx.billAmount ? this.purchaseOrderTx.billAmount : 0),
          returnAmount: new FormControl(!!this.purchaseOrderTx.returnAmount ? this.purchaseOrderTx.returnAmount : 0)
        });

        //Get billing group associated with Transaction or Default(Cash) Ledger.
        this.getBillingGroup(!!this.purchaseOrderTx.ledger ? this.purchaseOrderTx.ledger : data.id, 301);

        //Initialize the item form on load and other properties.
        this.initializeItemForm();
        this.itemLines = !!this.purchaseOrderTx.taxableLines ? this.purchaseOrderTx.taxableLines : [];
        this.itemLinesDataSource.data = this.itemLines;

        // Inititalize the Other Charges Form and other properties.
        this.getOtherCharges();
        this.initializeOtherChargesDiscountForm();
        this.addedOtherCharges = !!this.purchaseOrderTx.otherChargesLines ? this.purchaseOrderTx.otherChargesLines : [];
        this.otherChargesDataSource.data = this.addedOtherCharges;

        this.updateItemLinesTotalAmount();
        this.otherChargesTotalAmount.setValue(!!this.purchaseOrderTx.otherChargesTotal ? this.purchaseOrderTx.otherChargesTotal : 0);
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
      const StockAttributeDialogRef = this.dialog.open(ConfigureItemStockAttributeComponent, { 
        panelClass: 'custom-dialog-container', 
        data : {
          itemId : this.itemForm.controls["itemId"].value,
          quantity: this.itemForm.controls["quantity"].value,
          isEditMode: this.itemLineEditMode,
          attributeGroupLines : this.itemForm.contains("attributeGroupLines") ?  this.itemForm.controls["attributeGroupLines"].value : []
        } ,
        disableClose: true
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

  public saveOrderTx(): void {
    
    if(this.netFinalAmount.value != 0) {     

      this.overlayService.enableProgressSpinner();

      let  tx : IPurchaseOrderTx = {};

      // In case of edit of Purchase Transaction.
      if(!!this.purchaseOrderTx.id) {
        tx = this.purchaseOrderTx;
      } 

      tx.jacksontype = "PurchaseOrderTxImpl";
      tx.transactiondate = this.orderTxForm.controls["transactiondate"].value;
      tx.billAmount = this.orderTxForm.controls["billAmount"].value;
      tx.billingDate = this.orderTxForm.controls["transactiondate"].value;
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
        this.purchaseOrderTxService.update(tx).subscribe({
          next: (data) => {            
            this.overlayService.disableProgressSpinner();
            this.dialogRef.close();
          },
          error: () => {
            this.overlayService.disableProgressSpinner();
          }
        });
      }else {
        this.purchaseOrderTxService.save(tx).subscribe({
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
