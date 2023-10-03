import { Component, Inject, OnInit } from '@angular/core';
import { OrderTxComponent } from '../order-tx.component';
import { BillingClassificationServiceService, IInwardQuotationTx, InwardQuotationTxServiceService, ItemServiceService, LedgerAttributesServiceService, LedgerServiceService, OtherChargesServiceService, StockAttributeGroupLineServiceService, StockLocationServiceService, TaxConfigurationServiceService, TaxableEntityServiceService, VoucherNumberServiceService } from 'src/server';
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
import { SaleComponent } from '../sale/sale.component';

@Component({
  selector: 'app-inward-quotation',
  templateUrl: '../order-tx.component.html',
  styleUrls: ['../order-tx.component.css']
})
export class InwardQuotationComponent  extends OrderTxComponent implements OnInit {  

  inwardQuotationTx : IInwardQuotationTx;

  constructor(private inwQuotoBreakpointObserver: BreakpointObserver, private childFormBuilder : FormBuilder, 
    private dateAdapterService  : CustomDateAdapterService,private voucherNumberService : VoucherNumberServiceService,
    private ledgerService : LedgerServiceService, private childstockLocationService : StockLocationServiceService, 
    private childTaxableEntityService : TaxableEntityServiceService, private childTxProvider : TransactionsProvider, 
    private childLedgerAttributesService : LedgerAttributesServiceService, private childBillingClassificationService : BillingClassificationServiceService,
    private childOtherChargesService : OtherChargesServiceService, private _childSnackBar: MatSnackBar,
    private datePipe: DatePipe, private inwardQuotationTxService : InwardQuotationTxServiceService,
    private overlayService : OverlayService,
    @Inject(MAT_DIALOG_DATA) public data: { txId: number }, public dialogRef: MatDialogRef<SaleComponent>,
    public dialog: MatDialog, private childItemService : ItemServiceService, 
    private childStockAttributeGroupLineService : StockAttributeGroupLineServiceService,
    private childTaxConfigurationService : TaxConfigurationServiceService,
    private childBreakPointService : BreakPointService,
    private router: Router) {

    super(inwQuotoBreakpointObserver, childFormBuilder, 
      childstockLocationService, childTaxableEntityService,
      childTxProvider, childLedgerAttributesService, childBillingClassificationService,
      childOtherChargesService,_childSnackBar, ledgerService, childItemService, overlayService,
      childStockAttributeGroupLineService, dialog,
      302, childTaxConfigurationService, childBreakPointService);

    this.headerTitle = 'Inward Quotation';
  }

  ngOnInit(): void {
    this.inwardQuotationTx = {};

    if (!!this.data.txId) {
      this.inwardQuotationTxService.findById(this.data.txId).subscribe({
        next: (data) => {
          this.inwardQuotationTx = data;
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
          id: new FormControl(!!this.inwardQuotationTx.id ? this.inwardQuotationTx.id : undefined),
          transactiondate : new FormControl(this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          vouchernumber : new FormControl( {value: !!this.inwardQuotationTx.vouchernumber ? this.inwardQuotationTx.vouchernumber : "", disabled: true}, [ Validators.required]),
          referenceNo: new FormControl(!!this.inwardQuotationTx.referenceNo ? this.inwardQuotationTx.referenceNo : ''),
          ledgerId: new FormControl(!!this.inwardQuotationTx.ledger ? this.inwardQuotationTx.ledger : data.id),
          ledgerName: new FormControl(!!this.inwardQuotationTx.ledgerName ? this.inwardQuotationTx.ledgerName : data.name),
          contactId: new FormControl(!!this.inwardQuotationTx.contactId ? this.inwardQuotationTx.contactId : data.id),
          contactName: new FormControl(!!this.inwardQuotationTx.contactName ? this.inwardQuotationTx.contactName : data.name),   
          paymentLines: new FormControl(!!this.inwardQuotationTx.paymentLines ? this.inwardQuotationTx.paymentLines : []),
          billName: new FormControl(!!this.inwardQuotationTx.printName ? this.inwardQuotationTx.printName : data.name),
          billAmount: new FormControl(!!this.inwardQuotationTx.billAmount ? this.inwardQuotationTx.billAmount : 0),
          returnAmount: new FormControl(!!this.inwardQuotationTx.returnAmount ? this.inwardQuotationTx.returnAmount : 0),

          /** Order Transport FormControls */
          ewayBillDate: new FormControl(!!this.inwardQuotationTx.ewayBillDate ? this.inwardQuotationTx.ewayBillDate 
            : this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          shipmentDate: new FormControl(!!this.inwardQuotationTx.shipmentDate ? this.inwardQuotationTx.shipmentDate 
            : this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          transporter: new FormControl(!!this.inwardQuotationTx.transporter ? this.inwardQuotationTx.transporter : ''),
          transporterMobNo: new FormControl(!!this.inwardQuotationTx.transporterMobNo ? this.inwardQuotationTx.transporterMobNo : ''),
          transportMode: new FormControl(!!this.inwardQuotationTx.transportMode ? this.inwardQuotationTx.transportMode : null),
          transporterId:  new FormControl(!!this.inwardQuotationTx.transporterId ? this.inwardQuotationTx.transporterId : ''),
          vehicleType:  new FormControl(!!this.inwardQuotationTx.vehicleType ? this.inwardQuotationTx.vehicleType : ''),
          transDistance: new FormControl(!!this.inwardQuotationTx.transDistance ? this.inwardQuotationTx.transDistance : ''),
          vehicleNumber: new FormControl(!!this.inwardQuotationTx.vehicleNumber ? this.inwardQuotationTx.vehicleNumber : ''),
          shipmentId: new FormControl(!!this.inwardQuotationTx.shipmentId ? this.inwardQuotationTx.shipmentId : ''),
          shipmentDescription: new FormControl(!!this.inwardQuotationTx.shipmentDescription ? this.inwardQuotationTx.shipmentDescription : ''),
          supervisorId:  new FormControl(!!this.inwardQuotationTx.supervisorId ? this.inwardQuotationTx.supervisorId : ''),
          supervisorName: new FormControl(!!this.inwardQuotationTx.supervisorName ? this.inwardQuotationTx.supervisorName : ''),
          ewayBillNo:  new FormControl(!!this.inwardQuotationTx.ewayBillNo ? this.inwardQuotationTx.ewayBillNo : ''),
          shippingAddress:  new FormControl(!!this.inwardQuotationTx.shippingAddress ? this.inwardQuotationTx.shippingAddress : ''),
          shippingAddress2:  new FormControl(!!this.inwardQuotationTx.shippingAddress2 ? this.inwardQuotationTx.shippingAddress2 : ''),
          shippingAddress3:  new FormControl(!!this.inwardQuotationTx.shippingAddress3 ? this.inwardQuotationTx.shippingAddress3 : ''),
          shippingAddressState:  new FormControl(!!this.inwardQuotationTx.shippingAddressState ? this.inwardQuotationTx.shippingAddressState : ''),
          shippingAddressCity:  new FormControl(!!this.inwardQuotationTx.shippingAddressCity ? this.inwardQuotationTx.shippingAddressCity : ''),
          shippingAddressPinCode:  new FormControl(!!this.inwardQuotationTx.shippingAddressPinCode ? this.inwardQuotationTx.shippingAddressPinCode : ''),

          /** Order Description FormControls */
          description : new FormControl(!!this.inwardQuotationTx.description ? this.inwardQuotationTx.description : ''),
          modeOrTermsOfPayment: new FormControl(!!this.inwardQuotationTx.modeOrTermsOfPayment ? this.inwardQuotationTx.modeOrTermsOfPayment : ''),
          otherReferences: new FormControl(!!this.inwardQuotationTx.otherReferences ? this.inwardQuotationTx.otherReferences : ''),
          buyersOrderNo: new FormControl(!!this.inwardQuotationTx.buyersOrderNo ? this.inwardQuotationTx.buyersOrderNo : ''),
          dated: new FormControl(!!this.inwardQuotationTx.dated 
            ? this.dateAdapterService.createDate(new Date(this.inwardQuotationTx.dated).getFullYear(),
            new Date(this.inwardQuotationTx.dated).getMonth() , 
            new Date(this.inwardQuotationTx.dated).getDate())
            : this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          challanNo: new FormControl(!!this.inwardQuotationTx.challanNo ? this.inwardQuotationTx.challanNo : ''),
          challanDated: new FormControl(!!this.inwardQuotationTx.challanDated 
            ? this.dateAdapterService.createDate(new Date(this.inwardQuotationTx.challanDated).getFullYear(),
            new Date(this.inwardQuotationTx.challanDated).getMonth() , 
            new Date(this.inwardQuotationTx.challanDated).getDate())
            : this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          deliveryDate: new FormControl(!!this.inwardQuotationTx.deliveryDate 
            ? this.dateAdapterService.createDate(new Date(this.inwardQuotationTx.deliveryDate).getFullYear(),
            new Date(this.inwardQuotationTx.deliveryDate).getMonth() , 
            new Date(this.inwardQuotationTx.deliveryDate).getDate())
            : this.dateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          termsOfDelivery: new FormControl(!!this.inwardQuotationTx.termsOfDelivery ? this.inwardQuotationTx.termsOfDelivery : ''),
          termsId: new FormControl(!!this.inwardQuotationTx.termsId ? this.inwardQuotationTx.termsId : ''),
          termsName: new FormControl(), // Will be loaded once all the terms will be retrieved.
          deliveryAddress: new FormControl(!!this.inwardQuotationTx.deliveryAddress ? this.inwardQuotationTx.deliveryAddress : ''),
          deliveryAddress2: new FormControl(!!this.inwardQuotationTx.deliveryAddress2 ? this.inwardQuotationTx.deliveryAddress2 : ''),
          deliveryAddress3: new FormControl(!!this.inwardQuotationTx.deliveryAddress3 ? this.inwardQuotationTx.deliveryAddress3 : ''),
          deliveryAddressState: new FormControl(!!this.inwardQuotationTx.deliveryAddressState ? this.inwardQuotationTx.deliveryAddressState : ''),
          deliveryAddressCity: new FormControl(!!this.inwardQuotationTx.deliveryAddressCity ? this.inwardQuotationTx.deliveryAddressCity : ''),
          deliveryAddressPinCode: new FormControl(!!this.inwardQuotationTx.deliveryAddressPinCode ? this.inwardQuotationTx.deliveryAddressPinCode : ''),


          billingAddress:  new FormControl(!!this.inwardQuotationTx.billingAddress ? this.inwardQuotationTx.billingAddress : ''),
          billingAddress2:  new FormControl(!!this.inwardQuotationTx.billingAddress2 ? this.inwardQuotationTx.billingAddress2 : ''),
          billingAddress3:  new FormControl(!!this.inwardQuotationTx.billingAddress3 ? this.inwardQuotationTx.billingAddress3 : ''),
          billingAddressState: new FormControl(!!this.inwardQuotationTx.billingAddressState ? this.inwardQuotationTx.billingAddressState : ''),
          billingAddressCity: new FormControl(!!this.inwardQuotationTx.billingAddressCity ? this.inwardQuotationTx.billingAddressCity : ''),
          billingAddressPinCode: new FormControl(!!this.inwardQuotationTx.billingAddressPinCode ? this.inwardQuotationTx.billingAddressPinCode : ''),

        });

        if(this.orderTxForm.controls["vouchernumber"].value == ""){
            this.getNextVoucherNumber();        
        }

        //Get billing group associated with Transaction or Default(Cash) Ledger.
        this.getBillingGroup(!!this.inwardQuotationTx.ledger ? this.inwardQuotationTx.ledger : data.id, 302);

        //Initialize the item form on load and other properties.
        this.initializeItemForm();

        if(!!this.inwardQuotationTx.taxableLines){
          this.itemLines = this.updateItemLineProperties(this.inwardQuotationTx.taxableLines);

        }else{
          this.itemLines = [];
        }

        this.itemLinesDataSource.data = this.itemLines;

        // Inititalize the Other Charges Form and other properties.                
        this.addedOtherCharges = !!this.inwardQuotationTx.otherChargesLines ? this.inwardQuotationTx.otherChargesLines : [];
        this.otherChargesDataSource.data = this.addedOtherCharges;

        this.updateItemLinesTotalAmount();
        this.otherChargesTotalAmount.setValue(!!this.inwardQuotationTx.otherChargesTotal ? this.inwardQuotationTx.otherChargesTotal : 0);
        this.updateNetFinalAmount();

        this.isFormLoaded = true;
      },
      error: () => { }
    });
  } 

  private getNextVoucherNumber() : void {
    let txDate = this.datePipe.transform(new Date(),'yyyy-mm-dd HH:mm:ss');
    this.voucherNumberService.getNextVoucherNumber(txDate!, "in.solpro.nucleus.inventory.model.IInwardQuotationTx", 0).subscribe({
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

      let  tx : IInwardQuotationTx = {};

      // In case of edit of Sale Transaction.
      if(!!this.inwardQuotationTx.id) {
        tx = this.inwardQuotationTx;
      } 

      tx.jacksontype = "InwardQuotationTxImpl";
      tx.id = this.inwardQuotationTx.id;
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
        this.inwardQuotationTxService.update(tx).subscribe({
          next: (data) => {            
            this.overlayService.disableProgressSpinner();
            this.dialogRef.close();
          },
          error: () => {
            this.overlayService.disableProgressSpinner();
          }
        });
      }else{
        this.inwardQuotationTxService.save(tx).subscribe({
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
    this.router.navigate(['main/transaction/inwardQuotation']);
  }

}
