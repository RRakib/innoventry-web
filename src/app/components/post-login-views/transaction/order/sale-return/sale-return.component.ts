import { Component, Inject, OnInit } from '@angular/core';
import { OrderTxComponent } from '../order-tx.component';
import { BillingClassificationServiceService, ISaleReturnOrderTx, ItemServiceService, LedgerAttributesServiceService, LedgerServiceService, OtherChargesServiceService, SaleReturnOrderTxServiceService, StockAttributeGroupLineServiceService, StockLocationServiceService, TaxConfigurationServiceService, TaxableEntityServiceService, VoucherNumberServiceService } from 'src/server';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BreakPointService } from 'src/app/services/breakpoint.service';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { OverlayService } from 'src/app/services/overlay.service';
import { TransactionsProvider } from 'src/app/services/transactionsProvider';

@Component({
  selector: 'app-sale-return',
  templateUrl: '../order-tx.component.html',
  styleUrls: ['../order-tx.component.css']
})
export class SaleReturnComponent extends OrderTxComponent  implements OnInit {

  saleReturnOrderTx :  ISaleReturnOrderTx;

  constructor(private saleBreakpointObserver: BreakpointObserver, private childFormBuilder : FormBuilder, 
    private dateAdapterService  : CustomDateAdapterService,private voucherNumberService : VoucherNumberServiceService,
    private ledgerService : LedgerServiceService, private childstockLocationService : StockLocationServiceService, 
    private childTaxableEntityService : TaxableEntityServiceService, private childTxProvider : TransactionsProvider, 
    private childLedgerAttributesService : LedgerAttributesServiceService, private childBillingClassificationService : BillingClassificationServiceService,
    private childOtherChargesService : OtherChargesServiceService, private _childSnackBar: MatSnackBar,
    private datePipe: DatePipe, private saleReturnOrderTxService : SaleReturnOrderTxServiceService,
    private overlayService : OverlayService,
    @Inject(MAT_DIALOG_DATA) public data: { txId: number }, public dialogRef: MatDialogRef<SaleReturnComponent>,
    public dialog: MatDialog, private childItemService : ItemServiceService, 
    private childStockAttributeGroupLineService : StockAttributeGroupLineServiceService,
    private childTaxConfigurationService : TaxConfigurationServiceService,
    private childBreakPointService : BreakPointService,
    private router: Router) {
      super(saleBreakpointObserver, childFormBuilder, 
        childstockLocationService, childTaxableEntityService,
        childTxProvider, childLedgerAttributesService, childBillingClassificationService,
        childOtherChargesService,_childSnackBar, ledgerService, childItemService, overlayService,
        childStockAttributeGroupLineService, dialog,
        302, childTaxConfigurationService, childBreakPointService);
  
      this.headerTitle = 'Sale Return';
  }

  ngOnInit(): void {
    this.saleReturnOrderTx = {};

    if (!!this.data.txId) {
      this.saleReturnOrderTxService.findById(this.data.txId).subscribe({
        next: (data) => {
          this.saleReturnOrderTx = data;
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
          id: new FormControl(!!this.saleReturnOrderTx.id ? this.saleReturnOrderTx.id : undefined),
          transactiondate : new FormControl(this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          vouchernumber : new FormControl( {value: !!this.saleReturnOrderTx.vouchernumber ? this.saleReturnOrderTx.vouchernumber : "", disabled: true}, [ Validators.required]),
          referenceNo: new FormControl(!!this.saleReturnOrderTx.referenceNo ? this.saleReturnOrderTx.referenceNo : ''),
          ledgerId: new FormControl(!!this.saleReturnOrderTx.ledger ? this.saleReturnOrderTx.ledger : data.id),
          ledgerName: new FormControl(!!this.saleReturnOrderTx.ledgerName ? this.saleReturnOrderTx.ledgerName : data.name),
          contactId: new FormControl(!!this.saleReturnOrderTx.contactId ? this.saleReturnOrderTx.contactId : data.id),
          contactName: new FormControl(!!this.saleReturnOrderTx.contactName ? this.saleReturnOrderTx.contactName : data.name),   
          paymentLines: new FormControl(!!this.saleReturnOrderTx.paymentLines ? this.saleReturnOrderTx.paymentLines : []),
          billName: new FormControl(!!this.saleReturnOrderTx.printName ? this.saleReturnOrderTx.printName : data.name),
          billAmount: new FormControl(!!this.saleReturnOrderTx.billAmount ? this.saleReturnOrderTx.billAmount : 0),
          returnAmount: new FormControl(!!this.saleReturnOrderTx.returnAmount ? this.saleReturnOrderTx.returnAmount : 0),

          /** Order Transport FormControls */
          ewayBillDate: new FormControl(!!this.saleReturnOrderTx.ewayBillDate ? this.saleReturnOrderTx.ewayBillDate 
            : this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          shipmentDate: new FormControl(!!this.saleReturnOrderTx.shipmentDate ? this.saleReturnOrderTx.shipmentDate 
            : this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          transporter: new FormControl(!!this.saleReturnOrderTx.transporter ? this.saleReturnOrderTx.transporter : ''),
          transporterMobNo: new FormControl(!!this.saleReturnOrderTx.transporterMobNo ? this.saleReturnOrderTx.transporterMobNo : ''),
          transportMode: new FormControl(!!this.saleReturnOrderTx.transportMode ? this.saleReturnOrderTx.transportMode : null),
          transporterId:  new FormControl(!!this.saleReturnOrderTx.transporterId ? this.saleReturnOrderTx.transporterId : ''),
          vehicleType:  new FormControl(!!this.saleReturnOrderTx.vehicleType ? this.saleReturnOrderTx.vehicleType : ''),
          transDistance: new FormControl(!!this.saleReturnOrderTx.transDistance ? this.saleReturnOrderTx.transDistance : ''),
          vehicleNumber: new FormControl(!!this.saleReturnOrderTx.vehicleNumber ? this.saleReturnOrderTx.vehicleNumber : ''),
          shipmentId: new FormControl(!!this.saleReturnOrderTx.shipmentId ? this.saleReturnOrderTx.shipmentId : ''),
          shipmentDescription: new FormControl(!!this.saleReturnOrderTx.shipmentDescription ? this.saleReturnOrderTx.shipmentDescription : ''),
          supervisorId:  new FormControl(!!this.saleReturnOrderTx.supervisorId ? this.saleReturnOrderTx.supervisorId : ''),
          supervisorName: new FormControl(!!this.saleReturnOrderTx.supervisorName ? this.saleReturnOrderTx.supervisorName : ''),
          ewayBillNo:  new FormControl(!!this.saleReturnOrderTx.ewayBillNo ? this.saleReturnOrderTx.ewayBillNo : ''),
          shippingAddress:  new FormControl(!!this.saleReturnOrderTx.shippingAddress ? this.saleReturnOrderTx.shippingAddress : ''),
          shippingAddress2:  new FormControl(!!this.saleReturnOrderTx.shippingAddress2 ? this.saleReturnOrderTx.shippingAddress2 : ''),
          shippingAddress3:  new FormControl(!!this.saleReturnOrderTx.shippingAddress3 ? this.saleReturnOrderTx.shippingAddress3 : ''),
          shippingAddressState:  new FormControl(!!this.saleReturnOrderTx.shippingAddressState ? this.saleReturnOrderTx.shippingAddressState : ''),
          shippingAddressCity:  new FormControl(!!this.saleReturnOrderTx.shippingAddressCity ? this.saleReturnOrderTx.shippingAddressCity : ''),
          shippingAddressPinCode:  new FormControl(!!this.saleReturnOrderTx.shippingAddressPinCode ? this.saleReturnOrderTx.shippingAddressPinCode : ''),

          /** Order Description FormControls */
          description : new FormControl(!!this.saleReturnOrderTx.description ? this.saleReturnOrderTx.description : ''),
          modeOrTermsOfPayment: new FormControl(!!this.saleReturnOrderTx.modeOrTermsOfPayment ? this.saleReturnOrderTx.modeOrTermsOfPayment : ''),
          otherReferences: new FormControl(!!this.saleReturnOrderTx.otherReferences ? this.saleReturnOrderTx.otherReferences : ''),
          buyersOrderNo: new FormControl(!!this.saleReturnOrderTx.buyersOrderNo ? this.saleReturnOrderTx.buyersOrderNo : ''),
          dated: new FormControl(!!this.saleReturnOrderTx.dated 
            ? this.dateAdapterService.createDate(new Date(this.saleReturnOrderTx.dated).getFullYear(),
            new Date(this.saleReturnOrderTx.dated).getMonth() , 
            new Date(this.saleReturnOrderTx.dated).getDate())
            : this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          challanNo: new FormControl(!!this.saleReturnOrderTx.challanNo ? this.saleReturnOrderTx.challanNo : ''),
          challanDated: new FormControl(!!this.saleReturnOrderTx.challanDated 
            ? this.dateAdapterService.createDate(new Date(this.saleReturnOrderTx.challanDated).getFullYear(),
            new Date(this.saleReturnOrderTx.challanDated).getMonth() , 
            new Date(this.saleReturnOrderTx.challanDated).getDate())
            : this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          deliveryDate: new FormControl(!!this.saleReturnOrderTx.deliveryDate 
            ? this.dateAdapterService.createDate(new Date(this.saleReturnOrderTx.deliveryDate).getFullYear(),
            new Date(this.saleReturnOrderTx.deliveryDate).getMonth() , 
            new Date(this.saleReturnOrderTx.deliveryDate).getDate())
            : this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          termsOfDelivery: new FormControl(!!this.saleReturnOrderTx.termsOfDelivery ? this.saleReturnOrderTx.termsOfDelivery : ''),
          termsId: new FormControl(!!this.saleReturnOrderTx.termsId ? this.saleReturnOrderTx.termsId : ''),
          termsName: new FormControl(), // Will be loaded once all the terms will be retrieved.
          deliveryAddress: new FormControl(!!this.saleReturnOrderTx.deliveryAddress ? this.saleReturnOrderTx.deliveryAddress : ''),
          deliveryAddress2: new FormControl(!!this.saleReturnOrderTx.deliveryAddress2 ? this.saleReturnOrderTx.deliveryAddress2 : ''),
          deliveryAddress3: new FormControl(!!this.saleReturnOrderTx.deliveryAddress3 ? this.saleReturnOrderTx.deliveryAddress3 : ''),
          deliveryAddressState: new FormControl(!!this.saleReturnOrderTx.deliveryAddressState ? this.saleReturnOrderTx.deliveryAddressState : ''),
          deliveryAddressCity: new FormControl(!!this.saleReturnOrderTx.deliveryAddressCity ? this.saleReturnOrderTx.deliveryAddressCity : ''),
          deliveryAddressPinCode: new FormControl(!!this.saleReturnOrderTx.deliveryAddressPinCode ? this.saleReturnOrderTx.deliveryAddressPinCode : ''),


          billingAddress:  new FormControl(!!this.saleReturnOrderTx.billingAddress ? this.saleReturnOrderTx.billingAddress : ''),
          billingAddress2:  new FormControl(!!this.saleReturnOrderTx.billingAddress2 ? this.saleReturnOrderTx.billingAddress2 : ''),
          billingAddress3:  new FormControl(!!this.saleReturnOrderTx.billingAddress3 ? this.saleReturnOrderTx.billingAddress3 : ''),
          billingAddressState: new FormControl(!!this.saleReturnOrderTx.billingAddressState ? this.saleReturnOrderTx.billingAddressState : ''),
          billingAddressCity: new FormControl(!!this.saleReturnOrderTx.billingAddressCity ? this.saleReturnOrderTx.billingAddressCity : ''),
          billingAddressPinCode: new FormControl(!!this.saleReturnOrderTx.billingAddressPinCode ? this.saleReturnOrderTx.billingAddressPinCode : ''),

        });

        if(this.orderTxForm.controls["vouchernumber"].value == ""){
            this.getNextVoucherNumber();        
        }

        //Get billing group associated with Transaction or Default(Cash) Ledger.
        this.getBillingGroup(!!this.saleReturnOrderTx.ledger ? this.saleReturnOrderTx.ledger : data.id, 302);

        //Initialize the item form on load and other properties.
        this.initializeItemForm();

        if(!!this.saleReturnOrderTx.taxableLines){
          this.itemLines = this.updateItemLineProperties(this.saleReturnOrderTx.taxableLines);

        }else{
          this.itemLines = [];
        }

        this.itemLinesDataSource.data = this.itemLines;

        // Inititalize the Other Charges Form and other properties.                
        this.addedOtherCharges = !!this.saleReturnOrderTx.otherChargesLines ? this.saleReturnOrderTx.otherChargesLines : [];
        this.otherChargesDataSource.data = this.addedOtherCharges;

        this.updateItemLinesTotalAmount();
        this.otherChargesTotalAmount.setValue(!!this.saleReturnOrderTx.otherChargesTotal ? this.saleReturnOrderTx.otherChargesTotal : 0);
        this.updateNetFinalAmount();

        this.isFormLoaded = true;
      },
      error: () => { }
    });
  } 

  private getNextVoucherNumber() : void {
    let txDate = this.datePipe.transform(new Date(),'yyyy-mm-dd HH:mm:ss');
    this.voucherNumberService.getNextVoucherNumber(txDate!, "in.solpro.nucleus.inventory.model.ISaleReturnOrderTx", 0).subscribe({
        next: (data) =>{
          this.orderTxForm.patchValue({
            vouchernumber: data.voucherNumber
          });
          return data.voucherNumber;
        }
    });
  }

  public override showItemStockAttributes(): void {
    this.addOrEditItemLine();
  }
 
  public saveOrderTx(): void {
    if(this.netFinalAmount.value != 0) {

      this.overlayService.enableProgressSpinner();

      let  tx :  ISaleReturnOrderTx = {};

      // In case of edit of Sale Transaction.
      if(!!this.saleReturnOrderTx.id) {
        tx = this.saleReturnOrderTx;
      } 

      tx.jacksontype = "SaleReturnOrderTxImpl";
      tx.id = this.saleReturnOrderTx.id;
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
        this.saleReturnOrderTxService.update(tx).subscribe({
          next: (data) => {            
            this.overlayService.disableProgressSpinner();
            this.dialogRef.close();
          },
          error: () => {
            this.overlayService.disableProgressSpinner();
          }
        });
      }else{
        this.saleReturnOrderTxService.save(tx).subscribe({
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
    this.router.navigate(['main/transaction/saleReturn']);
  }

}
