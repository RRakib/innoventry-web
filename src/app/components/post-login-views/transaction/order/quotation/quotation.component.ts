import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { OverlayService } from 'src/app/services/overlay.service';
import { TransactionsProvider } from 'src/app/services/transactionsProvider';
import { IContact, IQuotationTx, ServiceServiceService, StockAttributeGroupLineServiceService, TaxConfigurationServiceService } from 'src/server';
import { BillingClassificationServiceService } from 'src/server/api/billingClassificationService.service';
import { ItemServiceService } from 'src/server/api/itemService.service';
import { LedgerAttributesServiceService } from 'src/server/api/ledgerAttributesService.service';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';
import { OtherChargesServiceService } from 'src/server/api/otherChargesService.service';
import { QuotationTxServiceService } from 'src/server/api/quotationTxService.service';
import { StockLocationServiceService } from 'src/server/api/stockLocationService.service';
import { TaxableEntityServiceService } from 'src/server/api/taxableEntityService.service';
import { VoucherNumberServiceService } from 'src/server/api/voucherNumberService.service';
import { OrderTxComponent } from '../order-tx.component';

@Component({
  selector: 'app-quotation',
  templateUrl: '../order-tx.component.html',
  styleUrls: ['../order-tx.component.css']
})
export class QuotationComponent extends OrderTxComponent  implements OnInit {

  quotationOrderTx : IQuotationTx;

  constructor(private saleBreakpointObserver: BreakpointObserver, private childFormBuilder : FormBuilder, 
    private dateAdapterService  : CustomDateAdapterService,private voucherNumberService : VoucherNumberServiceService,
    private ledgerService : LedgerServiceService, private childstockLocationService : StockLocationServiceService, 
    private childTaxableEntityService : TaxableEntityServiceService, private childTxProvider : TransactionsProvider, 
    private childLedgerAttributesService : LedgerAttributesServiceService, private childBillingClassificationService : BillingClassificationServiceService,
    private childOtherChargesService : OtherChargesServiceService, private _childSnackBar: MatSnackBar,
    private datePipe: DatePipe, private quotationTxService : QuotationTxServiceService, private overlayService : OverlayService,
    @Inject(MAT_DIALOG_DATA) public data: { txId: number }, public dialogRef: MatDialogRef<QuotationComponent>,
    private childItemService : ItemServiceService, public dialog: MatDialog,
    private childStockAttributeGroupLineService : StockAttributeGroupLineServiceService,
    private childTaxConfigurationService : TaxConfigurationServiceService) {
      
      super(saleBreakpointObserver, childFormBuilder, 
        childstockLocationService, childTaxableEntityService,
        childTxProvider, childLedgerAttributesService, childBillingClassificationService,
        childOtherChargesService,_childSnackBar, ledgerService, childItemService, 
        overlayService, childStockAttributeGroupLineService, dialog, 302, childTaxConfigurationService);

      this.headerTitle = 'Quotation';
  }

  ngOnInit(): void {

    this.quotationOrderTx = {};

    if (!!this.data.txId) {
      this.quotationTxService.findById(this.data.txId).subscribe({
        next: (data) => {
          this.quotationOrderTx = data;
          this.initializeOrderTxForm();
        }
      });
    }else{
      this.initializeOrderTxForm();

      let txDate = this.datePipe.transform(new Date(),'yyyy-mm-dd HH:mm:ss');
      this.voucherNumberService.getNextVoucherNumber(txDate!, "in.solpro.nucleus.inventory.model.IQuotationTx", 0).subscribe({
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
          id: new FormControl(!!this.quotationOrderTx.id ? this.quotationOrderTx.id : undefined),
          transactiondate : new FormControl(this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          vouchernumber : new FormControl( {value: !!this.quotationOrderTx.vouchernumber ? this.quotationOrderTx.vouchernumber : '', disabled: true}, [ Validators.required]),
          referenceNo: new FormControl(!!this.quotationOrderTx.referenceNo ? this.quotationOrderTx.referenceNo : ''),          
          contactId: new FormControl(!!this.quotationOrderTx.contactId ? this.quotationOrderTx.contactId : undefined),
          contactName: new FormControl(!!this.quotationOrderTx.contactName ? this.quotationOrderTx.contactName : undefined),
          paymentLines: new FormControl(!!this.quotationOrderTx.paymentLines ? this.quotationOrderTx.paymentLines : []),
          ledgerId: new FormControl(!!this.quotationOrderTx.ledger ? this.quotationOrderTx.ledger : undefined),
          ledgerName: new FormControl(!!this.quotationOrderTx.ledgerName ? this.quotationOrderTx.ledgerName : undefined),
          billName: new FormControl(!!this.quotationOrderTx.printName ? this.quotationOrderTx.printName : undefined),
          billAmount: new FormControl(!!this.quotationOrderTx.billAmount ? this.quotationOrderTx.billAmount : 0),
          returnAmount: new FormControl(!!this.quotationOrderTx.returnAmount ? this.quotationOrderTx.returnAmount : 0),
          status: new FormControl(!!this.quotationOrderTx.status ? this.quotationOrderTx.status : 'INITIAL'),
          closed: new FormControl()
        });
        let closedState = 'false';
        if(this.quotationOrderTx.closed) {
          closedState = 'true';
        }
        this.orderTxForm.patchValue({
          closed: closedState
        });

        this.orderTxForm.patchValue({
          closed: closedState
        });

        //Get billing group associated with Transaction or Default(Cash) Ledger.
        this.getBillingGroup(!!this.quotationOrderTx.ledger ? this.quotationOrderTx.ledger : data.id, 302);

        //Initialize the item form on load and other properties.
        this.initializeItemForm();
        this.itemLines = !!this.quotationOrderTx.taxableLines ? this.quotationOrderTx.taxableLines : [];
        this.itemLinesDataSource.data = this.itemLines;

        // Inititalize the Other Charges Form and other properties.
        this.getOtherCharges();
        this.initializeOtherChargesDiscountForm();
        this.addedOtherCharges = !!this.quotationOrderTx.otherChargesLines ? this.quotationOrderTx.otherChargesLines : [];
        this.otherChargesDataSource.data = this.addedOtherCharges;

        this.updateItemLinesTotalAmount();
        this.otherChargesTotalAmount.setValue(!!this.quotationOrderTx.otherChargesTotal ? this.quotationOrderTx.otherChargesTotal : 0);
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

      let  tx : IQuotationTx = {};
      tx.jacksontype = "QuotationTxImpl";
      tx.id = this.quotationOrderTx.id;
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
      tx.status = this.orderTxForm.controls["status"].value;
      tx.paymentLines = this.orderTxForm.controls["paymentLines"].value;
      tx.returnAmount = this.orderTxForm.controls["returnAmount"].value;

      if(this.orderTxForm.controls["closed"].value == 'true'){
        tx.closed = true;
      }else{
        tx.closed = false;
      }

      if(!!tx.id) {
        this.quotationTxService.update(tx).subscribe({
          next: (data) => {            
            this.overlayService.disableProgressSpinner();
            this.dialogRef.close();
          },
          error: () => {
            this.overlayService.disableProgressSpinner();
          }
        });
      }else{
        this.quotationTxService.save(tx).subscribe({
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
