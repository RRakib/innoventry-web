import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { OverlayService } from 'src/app/services/overlay.service';
import { TransactionsProvider } from 'src/app/services/transactionsProvider';
import { IPOTx, StockAttributeGroupLineServiceService, TaxConfigurationServiceService } from 'src/server';
import { BillingClassificationServiceService } from 'src/server/api/billingClassificationService.service';
import { ItemServiceService } from 'src/server/api/itemService.service';
import { LedgerAttributesServiceService } from 'src/server/api/ledgerAttributesService.service';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';
import { OtherChargesServiceService } from 'src/server/api/otherChargesService.service';
import { POTxServiceService } from 'src/server/api/pOTxService.service';
import { StockLocationServiceService } from 'src/server/api/stockLocationService.service';
import { TaxableEntityServiceService } from 'src/server/api/taxableEntityService.service';
import { VoucherNumberServiceService } from 'src/server/api/voucherNumberService.service';
import { OrderTxComponent } from '../order-tx.component';

@Component({
  selector: 'app-sale-order',
  templateUrl: '../order-tx.component.html',
  styleUrls: ['../order-tx.component.css']
})
export class SaleOrderComponent extends OrderTxComponent  implements OnInit {

  inwardPurchaseOrderTx : IPOTx;
 
  constructor(private sOBreakpointObserver: BreakpointObserver, private childFormBuilder : FormBuilder, 
    private dateAdapterService  : CustomDateAdapterService, private voucherNumberService : VoucherNumberServiceService,  
    private ledgerService : LedgerServiceService,
    private childstockLocationService : StockLocationServiceService, private childTaxableEntityService : TaxableEntityServiceService,
    private childTxProvider : TransactionsProvider, private childLedgerAttributesService : LedgerAttributesServiceService,
    private childBillingClassificationService : BillingClassificationServiceService,
    private childOtherChargesService : OtherChargesServiceService, private _childSnackBar: MatSnackBar, private datePipe: DatePipe,
    private overlayService : OverlayService, private poTxService : POTxServiceService,
    @Inject(MAT_DIALOG_DATA) public data: { txId: number },
    public dialogRef: MatDialogRef<SaleOrderComponent>, private childItemService : ItemServiceService, public dialog: MatDialog,
    private childStockAttributeGroupLineService : StockAttributeGroupLineServiceService,
    private childTaxConfigurationService : TaxConfigurationServiceService) {

    super(sOBreakpointObserver, childFormBuilder,
      childstockLocationService, childTaxableEntityService,
      childTxProvider, childLedgerAttributesService, childBillingClassificationService, 
      childOtherChargesService, _childSnackBar, ledgerService, childItemService, 
      overlayService, childStockAttributeGroupLineService, dialog, 301, childTaxConfigurationService);
      
    this.headerTitle = 'Sale Order';
  }

  ngOnInit(): void {

    this.inwardPurchaseOrderTx = {};

    if (!!this.data.txId) {
      this.poTxService.findById(this.data.txId).subscribe({
        next: (data) => {
          this.inwardPurchaseOrderTx = data;
          this.initializeOrderTxForm();
        }
      });
    }else{
      this.initializeOrderTxForm();
      let txDate = this.datePipe.transform(new Date(),'yyyy-mm-dd HH:mm:ss');
      this.voucherNumberService.getNextVoucherNumber(txDate!, "in.solpro.nucleus.inventory.model.IPOTx", 0).subscribe({
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
          id: new FormControl(!!this.inwardPurchaseOrderTx.id ? this.inwardPurchaseOrderTx.id : undefined),
          transactiondate : new FormControl(this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          vouchernumber : new FormControl( {value: !!this.inwardPurchaseOrderTx.vouchernumber ? this.inwardPurchaseOrderTx.vouchernumber : '', disabled: true}, [ Validators.required]),
          referenceNo: new FormControl(!!this.inwardPurchaseOrderTx.referenceNo ? this.inwardPurchaseOrderTx.referenceNo : ''),
          ledgerId: new FormControl(!!this.inwardPurchaseOrderTx.ledger ? this.inwardPurchaseOrderTx.ledger : data.id),
          ledgerName: new FormControl(!!this.inwardPurchaseOrderTx.ledgerName ? this.inwardPurchaseOrderTx.ledgerName : data.name),
          contactId: new FormControl(!!this.inwardPurchaseOrderTx.contactId ? this.inwardPurchaseOrderTx.contactId : data.id),
          contactName: new FormControl(!!this.inwardPurchaseOrderTx.contactName ? this.inwardPurchaseOrderTx.contactName : data.name),
          paymentLines: new FormControl(!!this.inwardPurchaseOrderTx.paymentLines ? this.inwardPurchaseOrderTx.paymentLines : []),
          billName: new FormControl(!!this.inwardPurchaseOrderTx.printName ? this.inwardPurchaseOrderTx.printName : data.name),
          billAmount: new FormControl(!!this.inwardPurchaseOrderTx.billAmount ? this.inwardPurchaseOrderTx.billAmount : 0),
          returnAmount: new FormControl(!!this.inwardPurchaseOrderTx.returnAmount ? this.inwardPurchaseOrderTx.returnAmount : 0)
        });

        //Get billing group associated with Transaction or Default(Cash) Ledger.
        this.getBillingGroup(!!this.inwardPurchaseOrderTx.ledger ? this.inwardPurchaseOrderTx.ledger : data.id, 302);

        //Initialize the item form on load and other properties.
        this.initializeItemForm();
        this.itemLines = !!this.inwardPurchaseOrderTx.taxableLines ? this.inwardPurchaseOrderTx.taxableLines : [];
        this.itemLinesDataSource.data = this.itemLines;

        // Inititalize the Other Charges Form and other properties.
        this.getOtherCharges();
        this.initializeOtherChargesDiscountForm();
        this.addedOtherCharges = !!this.inwardPurchaseOrderTx.otherChargesLines ? this.inwardPurchaseOrderTx.otherChargesLines : [];
        this.otherChargesDataSource.data = this.addedOtherCharges;

        this.updateItemLinesTotalAmount();
        this.otherChargesTotalAmount.setValue(!!this.inwardPurchaseOrderTx.otherChargesTotal ? this.inwardPurchaseOrderTx.otherChargesTotal : 0);
        this.updateNetFinalAmount();

        this.isFormLoaded = true;
      },
      error: () => { }
    });
  } 

  public showItemStockAttributes(): void{
    
  }

  public saveOrderTx(): void {
    
    if(this.netFinalAmount.value != 0) {     

      this.overlayService.enableProgressSpinner();

      let  tx : IPOTx = {};
      tx.jacksontype = "POTxImpl";
      tx.id = this.inwardPurchaseOrderTx.id;
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
        this.poTxService.update(tx).subscribe({
          next: (data) => {            
            this.overlayService.disableProgressSpinner();
            this.dialogRef.close();
          },
          error: () => {
            this.overlayService.disableProgressSpinner();
          }
        });
      }else{
        this.poTxService.save(tx).subscribe({
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
