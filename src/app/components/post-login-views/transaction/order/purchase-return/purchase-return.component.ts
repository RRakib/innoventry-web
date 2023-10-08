import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BreakPointService } from 'src/app/services/breakpoint.service';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { OverlayService } from 'src/app/services/overlay.service';
import { TransactionsProvider } from 'src/app/services/transactionsProvider';
import { IPurchaseReturnOrderTx, VoucherNumberServiceService, LedgerServiceService, StockLocationServiceService, TaxableEntityServiceService, LedgerAttributesServiceService, BillingClassificationServiceService, OtherChargesServiceService, ItemServiceService, StockAttributeGroupLineServiceService, TaxConfigurationServiceService, PurchaseReturnOrderTxServiceService } from 'src/server';
import { OrderTxComponent } from '../order-tx.component';
import { ConfigureItemStockAttributeComponent } from '../modal-popup/configure-item-stock-attribute/configure-item-stock-attribute.component';

@Component({
  selector: 'app-purchase-return',
  templateUrl: '../order-tx.component.html',
  styleUrls: ['../order-tx.component.css']  
})
export class PurchaseReturnComponent extends OrderTxComponent  implements OnInit {

  purchaseReturnOrderTx :  IPurchaseReturnOrderTx;

  constructor(private purchaseBreakpointObserver: BreakpointObserver, private childFormBuilder : FormBuilder, 
    private dateAdapterService  : CustomDateAdapterService,private voucherNumberService : VoucherNumberServiceService,
    private ledgerService : LedgerServiceService, private childstockLocationService : StockLocationServiceService, 
    private childTaxableEntityService : TaxableEntityServiceService, private childTxProvider : TransactionsProvider, 
    private childLedgerAttributesService : LedgerAttributesServiceService, private childBillingClassificationService : BillingClassificationServiceService,
    private childOtherChargesService : OtherChargesServiceService, private _childSnackBar: MatSnackBar,
    private datePipe: DatePipe, private purchaseReturnOrderTxService : PurchaseReturnOrderTxServiceService,
    private overlayService : OverlayService,
    @Inject(MAT_DIALOG_DATA) public data: { txId: number }, public dialogRef: MatDialogRef<PurchaseReturnComponent>,
    public dialog: MatDialog, private childItemService : ItemServiceService, 
    private childStockAttributeGroupLineService : StockAttributeGroupLineServiceService,
    private childTaxConfigurationService : TaxConfigurationServiceService,
    private childBreakPointService : BreakPointService,
    private router: Router) {
      super(purchaseBreakpointObserver, childFormBuilder, 
        childstockLocationService, childTaxableEntityService,
        childTxProvider, childLedgerAttributesService, childBillingClassificationService,
        childOtherChargesService,_childSnackBar, ledgerService, childItemService, overlayService,
        childStockAttributeGroupLineService, dialog,
        302, childTaxConfigurationService, childBreakPointService);
  
      this.headerTitle = 'Purchase Return';
     }

  ngOnInit(): void {
    this.purchaseReturnOrderTx = {};

    if (!!this.data.txId) {
      this.purchaseReturnOrderTxService.findById(this.data.txId).subscribe({
        next: (data) => {
          this.purchaseReturnOrderTx = data;
          this.initializeOrderTxForm();
        }
      });
    }else{
      this.initializeOrderTxForm();
    }
  }

  public initializeOrderTxForm() : void {
    //To fetch the cash ledger as a default ***by ledger***
    this.ledgerService.getCashLedger().subscribe({
      next: (data) => {
        this.cashLedger = data;
        
        this.orderTxForm = this.childFormBuilder.group({
          id: new FormControl(!!this.purchaseReturnOrderTx.id ? this.purchaseReturnOrderTx.id : undefined),
          transactiondate : new FormControl(this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          vouchernumber : new FormControl( {value: !!this.purchaseReturnOrderTx.vouchernumber ? this.purchaseReturnOrderTx.vouchernumber : "", disabled: true}, [ Validators.required]),
          referenceNo: new FormControl(!!this.purchaseReturnOrderTx.referenceNo ? this.purchaseReturnOrderTx.referenceNo : ''),
          ledgerId: new FormControl(!!this.purchaseReturnOrderTx.ledger ? this.purchaseReturnOrderTx.ledger : data.id),
          ledgerName: new FormControl(!!this.purchaseReturnOrderTx.ledgerName ? this.purchaseReturnOrderTx.ledgerName : data.name),
          contactId: new FormControl(!!this.purchaseReturnOrderTx.contactId ? this.purchaseReturnOrderTx.contactId : data.id),
          contactName: new FormControl(!!this.purchaseReturnOrderTx.contactName ? this.purchaseReturnOrderTx.contactName : data.name),   
          paymentLines: new FormControl(!!this.purchaseReturnOrderTx.paymentLines ? this.purchaseReturnOrderTx.paymentLines : []),
          billName: new FormControl(!!this.purchaseReturnOrderTx.printName ? this.purchaseReturnOrderTx.printName : data.name),
          billAmount: new FormControl(!!this.purchaseReturnOrderTx.billAmount ? this.purchaseReturnOrderTx.billAmount : 0),
          returnAmount: new FormControl(!!this.purchaseReturnOrderTx.returnAmount ? this.purchaseReturnOrderTx.returnAmount : 0),

          /** Order Transport FormControls */
          ewayBillDate: new FormControl(!!this.purchaseReturnOrderTx.ewayBillDate ? this.purchaseReturnOrderTx.ewayBillDate 
            : this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          shipmentDate: new FormControl(!!this.purchaseReturnOrderTx.shipmentDate ? this.purchaseReturnOrderTx.shipmentDate 
            : this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          transporter: new FormControl(!!this.purchaseReturnOrderTx.transporter ? this.purchaseReturnOrderTx.transporter : ''),
          transporterMobNo: new FormControl(!!this.purchaseReturnOrderTx.transporterMobNo ? this.purchaseReturnOrderTx.transporterMobNo : ''),
          transportMode: new FormControl(!!this.purchaseReturnOrderTx.transportMode ? this.purchaseReturnOrderTx.transportMode : null),
          transporterId:  new FormControl(!!this.purchaseReturnOrderTx.transporterId ? this.purchaseReturnOrderTx.transporterId : ''),
          vehicleType:  new FormControl(!!this.purchaseReturnOrderTx.vehicleType ? this.purchaseReturnOrderTx.vehicleType : ''),
          transDistance: new FormControl(!!this.purchaseReturnOrderTx.transDistance ? this.purchaseReturnOrderTx.transDistance : ''),
          vehicleNumber: new FormControl(!!this.purchaseReturnOrderTx.vehicleNumber ? this.purchaseReturnOrderTx.vehicleNumber : ''),
          shipmentId: new FormControl(!!this.purchaseReturnOrderTx.shipmentId ? this.purchaseReturnOrderTx.shipmentId : ''),
          shipmentDescription: new FormControl(!!this.purchaseReturnOrderTx.shipmentDescription ? this.purchaseReturnOrderTx.shipmentDescription : ''),
          supervisorId:  new FormControl(!!this.purchaseReturnOrderTx.supervisorId ? this.purchaseReturnOrderTx.supervisorId : ''),
          supervisorName: new FormControl(!!this.purchaseReturnOrderTx.supervisorName ? this.purchaseReturnOrderTx.supervisorName : ''),
          ewayBillNo:  new FormControl(!!this.purchaseReturnOrderTx.ewayBillNo ? this.purchaseReturnOrderTx.ewayBillNo : ''),
          shippingAddress:  new FormControl(!!this.purchaseReturnOrderTx.shippingAddress ? this.purchaseReturnOrderTx.shippingAddress : ''),
          shippingAddress2:  new FormControl(!!this.purchaseReturnOrderTx.shippingAddress2 ? this.purchaseReturnOrderTx.shippingAddress2 : ''),
          shippingAddress3:  new FormControl(!!this.purchaseReturnOrderTx.shippingAddress3 ? this.purchaseReturnOrderTx.shippingAddress3 : ''),
          shippingAddressState:  new FormControl(!!this.purchaseReturnOrderTx.shippingAddressState ? this.purchaseReturnOrderTx.shippingAddressState : ''),
          shippingAddressCity:  new FormControl(!!this.purchaseReturnOrderTx.shippingAddressCity ? this.purchaseReturnOrderTx.shippingAddressCity : ''),
          shippingAddressPinCode:  new FormControl(!!this.purchaseReturnOrderTx.shippingAddressPinCode ? this.purchaseReturnOrderTx.shippingAddressPinCode : ''),

          /** Order Description FormControls */
          description : new FormControl(!!this.purchaseReturnOrderTx.description ? this.purchaseReturnOrderTx.description : ''),
          modeOrTermsOfPayment: new FormControl(!!this.purchaseReturnOrderTx.modeOrTermsOfPayment ? this.purchaseReturnOrderTx.modeOrTermsOfPayment : ''),
          otherReferences: new FormControl(!!this.purchaseReturnOrderTx.otherReferences ? this.purchaseReturnOrderTx.otherReferences : ''),
          buyersOrderNo: new FormControl(!!this.purchaseReturnOrderTx.buyersOrderNo ? this.purchaseReturnOrderTx.buyersOrderNo : ''),
          dated: new FormControl(!!this.purchaseReturnOrderTx.dated 
            ? this.dateAdapterService.createDate(new Date(this.purchaseReturnOrderTx.dated).getFullYear(),
            new Date(this.purchaseReturnOrderTx.dated).getMonth() , 
            new Date(this.purchaseReturnOrderTx.dated).getDate())
            : this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          challanNo: new FormControl(!!this.purchaseReturnOrderTx.challanNo ? this.purchaseReturnOrderTx.challanNo : ''),
          challanDated: new FormControl(!!this.purchaseReturnOrderTx.challanDated 
            ? this.dateAdapterService.createDate(new Date(this.purchaseReturnOrderTx.challanDated).getFullYear(),
            new Date(this.purchaseReturnOrderTx.challanDated).getMonth() , 
            new Date(this.purchaseReturnOrderTx.challanDated).getDate())
            : this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          deliveryDate: new FormControl(!!this.purchaseReturnOrderTx.deliveryDate 
            ? this.dateAdapterService.createDate(new Date(this.purchaseReturnOrderTx.deliveryDate).getFullYear(),
            new Date(this.purchaseReturnOrderTx.deliveryDate).getMonth() , 
            new Date(this.purchaseReturnOrderTx.deliveryDate).getDate())
            : this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          termsOfDelivery: new FormControl(!!this.purchaseReturnOrderTx.termsOfDelivery ? this.purchaseReturnOrderTx.termsOfDelivery : ''),
          termsId: new FormControl(!!this.purchaseReturnOrderTx.termsId ? this.purchaseReturnOrderTx.termsId : ''),
          termsName: new FormControl(), // Will be loaded once all the terms will be retrieved.
          deliveryAddress: new FormControl(!!this.purchaseReturnOrderTx.deliveryAddress ? this.purchaseReturnOrderTx.deliveryAddress : ''),
          deliveryAddress2: new FormControl(!!this.purchaseReturnOrderTx.deliveryAddress2 ? this.purchaseReturnOrderTx.deliveryAddress2 : ''),
          deliveryAddress3: new FormControl(!!this.purchaseReturnOrderTx.deliveryAddress3 ? this.purchaseReturnOrderTx.deliveryAddress3 : ''),
          deliveryAddressState: new FormControl(!!this.purchaseReturnOrderTx.deliveryAddressState ? this.purchaseReturnOrderTx.deliveryAddressState : ''),
          deliveryAddressCity: new FormControl(!!this.purchaseReturnOrderTx.deliveryAddressCity ? this.purchaseReturnOrderTx.deliveryAddressCity : ''),
          deliveryAddressPinCode: new FormControl(!!this.purchaseReturnOrderTx.deliveryAddressPinCode ? this.purchaseReturnOrderTx.deliveryAddressPinCode : ''),


          billingAddress:  new FormControl(!!this.purchaseReturnOrderTx.billingAddress ? this.purchaseReturnOrderTx.billingAddress : ''),
          billingAddress2:  new FormControl(!!this.purchaseReturnOrderTx.billingAddress2 ? this.purchaseReturnOrderTx.billingAddress2 : ''),
          billingAddress3:  new FormControl(!!this.purchaseReturnOrderTx.billingAddress3 ? this.purchaseReturnOrderTx.billingAddress3 : ''),
          billingAddressState: new FormControl(!!this.purchaseReturnOrderTx.billingAddressState ? this.purchaseReturnOrderTx.billingAddressState : ''),
          billingAddressCity: new FormControl(!!this.purchaseReturnOrderTx.billingAddressCity ? this.purchaseReturnOrderTx.billingAddressCity : ''),
          billingAddressPinCode: new FormControl(!!this.purchaseReturnOrderTx.billingAddressPinCode ? this.purchaseReturnOrderTx.billingAddressPinCode : ''),

        });

        if(this.orderTxForm.controls["vouchernumber"].value == ""){
            this.getNextVoucherNumber();        
        }

        //Get billing group associated with Transaction or Default(Cash) Ledger.
        this.getBillingGroup(!!this.purchaseReturnOrderTx.ledger ? this.purchaseReturnOrderTx.ledger : data.id, 302);

        //Initialize the item form on load and other properties.
        this.initializeItemForm();

        if(!!this.purchaseReturnOrderTx.taxableLines){
          this.itemLines = this.updateItemLineProperties(this.purchaseReturnOrderTx.taxableLines);

        }else{
          this.itemLines = [];
        }

        this.itemLinesDataSource.data = this.itemLines;

        // Inititalize the Other Charges Form and other properties.                
        this.addedOtherCharges = !!this.purchaseReturnOrderTx.otherChargesLines ? this.purchaseReturnOrderTx.otherChargesLines : [];
        this.otherChargesDataSource.data = this.addedOtherCharges;

        this.updateItemLinesTotalAmount();
        this.otherChargesTotalAmount.setValue(!!this.purchaseReturnOrderTx.otherChargesTotal ? this.purchaseReturnOrderTx.otherChargesTotal : 0);
        this.updateNetFinalAmount();

        this.isFormLoaded = true;
      },
      error: () => { }
    });
  } 

  private getNextVoucherNumber() : void {
    let txDate = this.datePipe.transform(new Date(),'yyyy-mm-dd HH:mm:ss');
    this.voucherNumberService.getNextVoucherNumber(txDate!, "in.solpro.nucleus.inventory.model.IPurchaseReturnOrderTx", 0).subscribe({
        next: (data) =>{
          this.orderTxForm.patchValue({
            vouchernumber: data.voucherNumber
          });
          return data.voucherNumber;
        }
    });
  }

  public override showItemStockAttributes(): void {
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

        this.addOrEditItemLine();
      });
    }    
  }
 
  public saveOrderTx(): void {
    if(this.netFinalAmount.value != 0) {

      this.overlayService.enableProgressSpinner();

      let  tx :  IPurchaseReturnOrderTx = {};

      // In case of edit of purchase Transaction.
      if(!!this.purchaseReturnOrderTx.id) {
        tx = this.purchaseReturnOrderTx;
      } 

      tx.jacksontype = "PurchaseReturnOrderTxImpl";
      tx.id = this.purchaseReturnOrderTx.id;
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

      /** Order Description details for save/update */
      tx.description = this.orderTxForm.controls["description"].value;
      tx.modeOrTermsOfPayment = this.orderTxForm.controls["modeOrTermsOfPayment"].value;
      tx.otherReferences = this.orderTxForm.controls["otherReferences"].value;
      tx.buyersOrderNo = this.orderTxForm.controls["buyersOrderNo"].value;
      tx.dated = this.orderTxForm.controls["dated"].value;
      tx.challanNo = this.orderTxForm.controls["challanNo"].value;
      tx.challanDated = this.orderTxForm.controls["challanDated"].value;
      tx.deliveryDate = this.orderTxForm.controls["deliveryDate"].value;
      tx.termsOfDelivery = this.orderTxForm.controls["termsOfDelivery"].value;
      tx.termsId = this.orderTxForm.controls["termsId"].value;
      tx.deliveryAddress = this.orderTxForm.controls["deliveryAddress"].value;
      tx.deliveryAddress2 = this.orderTxForm.controls["deliveryAddress2"].value;
      tx.deliveryAddress3 = this.orderTxForm.controls["deliveryAddress3"].value;
      tx.deliveryAddressState = this.orderTxForm.controls["deliveryAddressState"].value;
      tx.deliveryAddressCity = this.orderTxForm.controls["deliveryAddressCity"].value;
      tx.deliveryAddressPinCode = this.orderTxForm.controls["deliveryAddressPinCode"].value;
      tx.billingAddress = this.orderTxForm.controls["billingAddress"].value;
      tx.billingAddress2 = this.orderTxForm.controls["billingAddress2"].value;
      tx.billingAddress3 = this.orderTxForm.controls["billingAddress3"].value;
      tx.billingAddressState = this.orderTxForm.controls["billingAddressState"].value;
      tx.billingAddressCity = this.orderTxForm.controls["billingAddressCity"].value;
      tx.billingAddressPinCode = this.orderTxForm.controls["billingAddressPinCode"].value;

      /** Order Transport details info save/update */
      tx.ewayBillDate= this.orderTxForm.controls["ewayBillDate"].value;
      tx.shipmentDate= this.orderTxForm.controls["shipmentDate"].value;
      tx.transporter= this.orderTxForm.controls["transporter"].value;
      tx.transporterMobNo= this.orderTxForm.controls["transporterMobNo"].value;
      tx.transportMode= this.orderTxForm.controls["transportMode"].value;
      tx.transporterId=  this.orderTxForm.controls["transporterId"].value;
      tx.vehicleType=  this.orderTxForm.controls["vehicleType"].value;
      tx.transDistance= this.orderTxForm.controls["transDistance"].value;
      tx.vehicleNumber= this.orderTxForm.controls["vehicleNumber"].value;
      tx.shipmentId= this.orderTxForm.controls["shipmentId"].value;
      tx.shipmentDescription= this.orderTxForm.controls["shipmentDescription"].value;
      tx.supervisorId=  this.orderTxForm.controls["supervisorId"].value;
      tx.supervisorName= this.orderTxForm.controls["supervisorName"].value;
      tx.ewayBillNo=  this.orderTxForm.controls["ewayBillNo"].value;
      tx.shippingAddress=  this.orderTxForm.controls["shippingAddress"].value;
      tx.shippingAddress2=  this.orderTxForm.controls["shippingAddress2"].value;
      tx.shippingAddress3=  this.orderTxForm.controls["shippingAddress3"].value;
      tx.shippingAddressState=  this.orderTxForm.controls["shippingAddressState"].value;
      tx.shippingAddressCity=  this.orderTxForm.controls["shippingAddressCity"].value;
      tx.shippingAddressPinCode= this.orderTxForm.controls["shippingAddressPinCode"].value;
      
      if(!!tx.id) {
        this.purchaseReturnOrderTxService.update(tx).subscribe({
          next: (data) => {            
            this.overlayService.disableProgressSpinner();
            this.dialogRef.close();
          },
          error: () => {
            this.overlayService.disableProgressSpinner();
          }
        });
      }else{
        this.purchaseReturnOrderTxService.save(tx).subscribe({
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

  public cancelOrderTx() {
    this.router.navigate(['main/transaction/purchaseReturn']);
  }

}
