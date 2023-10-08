import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { forkJoin, map, Observable, shareReplay, Subscription } from "rxjs";
import { GetObjectsArgument, IBillingClassification, IBillingGroup, IContact, IItem, IItemLine, ILedger, IOtherCharges, IOtherChargesLine, IServiceLine, IServiceMaster, IStockLocation, ITax, ITaxGroup, ITaxLine, ITaxableLine, PItemMaster, PLedgerMaster, ServiceServiceService, StockAttributeGroupLineServiceService, TaxConfigurationServiceService } from "src/server";
import { TaxableEntityServiceService } from "src/server/api/taxableEntityService.service";
import { TransactionsProvider } from "src/app/services/transactionsProvider";
import { LedgerAttributesServiceService } from "src/server/api/ledgerAttributesService.service";
import { BillingClassificationServiceService } from "src/server/api/billingClassificationService.service";
import { MatTableDataSource } from "@angular/material/table";
import { StockLocationServiceService } from "src/server/api/stockLocationService.service";
import { OtherChargesServiceService } from "src/server/api/otherChargesService.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LedgerServiceService } from "src/server/api/ledgerService.service";
import { ItemServiceService } from "src/server/api/itemService.service";
import { OverlayService } from "src/app/services/overlay.service";
import { MatDialog } from "@angular/material/dialog";
import { OrderPaymentDetailComponent } from "./modal-popup/order-payment-detail/order-payment-detail.component";
import { OrderServicesComponent } from "./modal-popup/order-services/order-services.component";
import { OrderChargesDiscountsComponent } from "./modal-popup/order-charges-discounts/order-charges-discounts.component";
import { ItemSelectionFormComponent } from "./modal-popup/item-selection-form/item-selection-form.component";
import { BreakPointService } from "src/app/services/breakpoint.service";

export abstract class OrderTxComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  Breakpoints = Breakpoints; // To be used in template html
  currentBreakpoint : string = '';


  public orderTxForm!: FormGroup;
  public cashLedger : ILedger;
  public itemForm!: FormGroup; 

  public headerTitle : string;
  isFormLoaded : boolean = false;


  //Item Line Table Objects
  itemLines : IItemLine[];
  itemLinesDataSource = new MatTableDataSource<IItemLine>([]);
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  itemLineDisplayedColumns = ['itemProductCode', 
    'itemName', 
    'quantity',
    'rate', 
    'discount',
    // 'netRate',
    'taxableAmountBeforeBillDiscount',
    'taxGroupName',
    'taxAmount',
    'totalAmountBeforeBillDiscount'
  ];

  stockLocations : IStockLocation[];
  stockCountStatement: string = '';

  selectedLineItemForEdit : IItemLine | undefined;
  itemLineEditMode : boolean = false;
  selectedItemtaxGroup: ITaxGroup;
  

  //Other Charges/Discount objects  
  addedOtherCharges : IOtherChargesLine[] = []; // Added by user.  
  otherChargesDataSource = new MatTableDataSource<IOtherChargesLine>([]);
  otherChargesDisplayedColumns = ['chargesName','value','amount'];
  selectedOtherChargeLineForEdit : IOtherChargesLine | undefined;
  otherChargeLineEditMode : boolean = false;

  itemLinesTotalAmount = new FormControl(0);
  otherChargesTotalAmount = new FormControl(0);
  netFinalAmount = new FormControl(0);
  
  constructor(private breakpointObserver: BreakpointObserver, private formBuilder : FormBuilder,   
    private stockLocationService : StockLocationServiceService, private taxableEntityService : TaxableEntityServiceService,
    private txProvider : TransactionsProvider, private ledgerAttributesService : LedgerAttributesServiceService,
    private billingClassificationService : BillingClassificationServiceService,
    private otherChargesService : OtherChargesServiceService,private _snackBar: MatSnackBar, private parentLedgerService : LedgerServiceService,
    private itemService : ItemServiceService, private parentOverlayService : OverlayService,
    private stockAttributeGroupLineService : StockAttributeGroupLineServiceService,
    public matDialog: MatDialog,private currentTxType: number,
    private taxConfigurationService : TaxConfigurationServiceService,
    private breakPointService : BreakPointService
    ) { 
  } 

  /**
   * This function initializes the item form to default values.
   */
  public initializeItemForm() {

    this.itemForm = this.formBuilder.group({
      isTaxDeductionFromAmountEnabled: new FormControl(true),
      itemId: new FormControl(''),
      itemName: new FormControl(''),
      itemProductCode: new FormControl({ value: '', disabled: true }),
      quantity: new FormControl(''),
      unit: new FormControl(''),
      unitName: new FormControl({ value: '', disabled: true }),
      mrp: new FormControl({ value: '', disabled: true }),
      discount: new FormControl(''),
      rate: new FormControl(''),
      netRate: new FormControl({ value: '', disabled: true }),
      taxGroup: new FormControl(''),
      taxGroupName: new FormControl(''),
      taxLines: [],      
      taxableAmountBeforeBillDiscount: new FormControl({ value: '', disabled: true }),
      taxAmount: new FormControl({ value: '', disabled: true }),                 
      totalAmountBeforeBillDiscount: new FormControl({ value: '', disabled: true }),
      stockLocation: new FormControl()
    });

    this.breakPointService.breakpointObservable$.subscribe({
      next: (data) => {
        this.currentBreakpoint = data;
      }
    });
    
  }

  

  /**
   * This function updates the billing classification and billing group for the current selected ledger.
   * @param ledgerId : Current selected ledger id.
   */
  public getBillingGroup(ledgerId : number | undefined, currentTxType : number) : void {

    let billingGroup : IBillingGroup = {};
    let billingClassification : IBillingClassification = {};

    this.ledgerAttributesService.findById(ledgerId).subscribe({
      next: (ledgerAttributes) => {

        if(ledgerAttributes == undefined) {

          this.billingGroupClassificationRequests().subscribe({
            next: (data) => {
              billingGroup = this.getDefaultBillingGroup(data[0], data[1]);
              billingClassification = data[2];

              this.txProvider.billingGroup(billingGroup);
              this.txProvider.billingClassification(billingClassification);
            }
          });

        }else{
          if(ledgerAttributes.billingGroupList?.length == 0) {

            this.billingGroupClassificationRequests().subscribe({
              next: (data) => {
                billingGroup = this.getDefaultBillingGroup(data[0], data[1]);
                this.txProvider.billingGroup(billingGroup);
              }
            });

            
          }else{

            let currentTxBillingGroup = ledgerAttributes?.billingGroupList?.find((billingGroup) => {
              return billingGroup.transactionTypes?.some((txType) => txType.type == currentTxType);
            });

            if(!!currentTxBillingGroup) {              
              this.txProvider.billingGroup(currentTxBillingGroup);
            }else{
              this.billingGroupClassificationRequests().subscribe({
                next: (data) => {
                  billingGroup = this.getDefaultBillingGroup(data[0], data[1]);                 
                  this.txProvider.billingGroup(billingGroup);
                }
              });
            }
          }

          this.billingClassificationService.findById(ledgerAttributes.billingClassificationId).subscribe({
            next: (data) => {
              if(!!data) {                
                this.txProvider.billingClassification(data);            
              }else{
                billingClassification = this.getDefaultBillingClassification();
                this.txProvider.billingClassification(billingClassification);            
              }
            }
          });
        }
      }
    });
  }

  /**
   * This function returns all the observables required on page load.
   * @returns 
   */
  public billingGroupClassificationRequests(): Observable<any[]> {
    let purchaseBillingGroup$ :  Observable<IBillingGroup> = this.taxConfigurationService.getDefaultPurchaseBillingGroup();
    let saleBillingGroup$ : Observable<IBillingGroup> = this.taxConfigurationService.getDefaultSaleBillingGroup();
    let billingClassification$ : Observable<IBillingClassification> = this.billingClassificationService.findByName("Intrastate (Within State)");

    return forkJoin([purchaseBillingGroup$, saleBillingGroup$, billingClassification$]);
  }


  private getDefaultBillingGroup(purchaseBillingGroup : IBillingGroup, saleBillingGroup : IBillingGroup) : IBillingGroup{
    if(this.currentTxType == 301) {
      return purchaseBillingGroup;
    }else{
      return saleBillingGroup;
    }
  }

  private getDefaultBillingClassification() : IBillingClassification{
    let billingClassification = {};

    this.billingClassificationService.findByName("Intrastate (Within State)").subscribe({
      next : (data) => {
        billingClassification =  data;
      }
    });
    return billingClassification;
  }

  //This will also executed in edit of any new added entry only.
  onLedgerSelectionChange(selectedLedger : PLedgerMaster) : void {
    this.orderTxForm.patchValue({
      ledgerName: selectedLedger.name,
      ledgerId: selectedLedger.id
    })

    //Update billing group and billing classification for the selected ledger.
    this.getBillingGroup(selectedLedger.id, this.currentTxType);
  }

  //This will also executed in edit of any new added entry only.
  onContactSelectionChange(selectedContact : IContact) : void{
    
    this.orderTxForm.patchValue({
      contactId: selectedContact.id,
      contactName: selectedContact.name,
      billName:  selectedContact.name
    });
    
    this.parentLedgerService.getLedger(selectedContact.id).subscribe({
      next: (data) => {
        if(!!data) {
          this.orderTxForm.patchValue({
            ledgerId: data.id,
            ledgerName: data.name         
          })
        }else{
          this.orderTxForm.patchValue({
            ledgerId: this.cashLedger.id,
            ledgerName: this.cashLedger.name         
          })
        }        
      }
    });
  }

  /** 
   * This function is executed when user click on Add Item Line or Edit Item Line
   */
  openItemSelectionForm() : void{
    const ItemSelectionDialogRef = this.matDialog.open(ItemSelectionFormComponent, { 
      panelClass: this.currentBreakpoint == Breakpoints.Web 
        ? 'item-selection-dialog-container' 
        : 'item-selection-dialog-container_mobile',
      data : {
        headerTitle: this.headerTitle,
        itemForm: this.itemForm,
        itemLineEditMode: this.itemLineEditMode,
        itemLines: this.itemLines,
        selectedLineItemForEdit: this.selectedLineItemForEdit
      },        
      disableClose: true
    }); 

    ItemSelectionDialogRef.afterClosed().subscribe((result) => {
      if(result.add) {
        this.showItemStockAttributes();
      }else{
        this.itemForm.reset();
      }
    });
  }

  /**
   * This function is executed when user adds an item as item line from 'ADD ITEM' button.
   * Also executed when user edit an already added item line.
   */
  public addOrEditItemLine() : void {

    if(this.itemForm.controls["itemName"].value == undefined || this.itemForm.controls["itemName"].value.length == 0){
      this.itemForm.controls["itemName"].addValidators([Validators.required]);    
      this.itemForm.controls["itemName"].updateValueAndValidity();
    }

    if(this.itemForm.valid && !!this.itemForm.controls["itemName"].value) {
      let itemLine : IItemLine = this.itemForm.getRawValue();   // Convert ItemForm to IItemLine.      
      itemLine.jacksontype = 'ItemLineImpl';

      if(!this.itemLineEditMode) { //New Item Line added
        this.itemLines = [...this.itemLines, itemLine];
      }else if(!!this.selectedLineItemForEdit) {//Edit existing item line.

        let updatedItemLine = Object.assign(this.selectedLineItemForEdit, itemLine);

        this.itemLines = this.itemLines.map((iL) => {
          if(iL.itemId == updatedItemLine.itemId) {
            iL = updatedItemLine;
          }
          return iL;
        });

        this.itemLineEditMode = false;
        this.selectedLineItemForEdit = undefined;
      }

      this.updateFinalAmounts();
      this.stockCountStatement = '';
        
      this.itemLinesDataSource.data = this.itemLines;

      this.itemForm.controls["itemName"].removeValidators(Validators.required);      
      this.itemForm.controls["itemName"].updateValueAndValidity();
    }

    this.itemForm.reset();
  }

  /**
   * This function updates the item lines total amount displayed in Transaction summary 
   * and Other charges form.
   */
  updateItemLinesTotalAmount() {
    this.itemLinesTotalAmount.setValue(0);
    let itemLinesAmount : number = 0;

    this.itemLines.forEach((itemLine) => {
      itemLinesAmount = Number(itemLinesAmount) + Number(itemLine.totalAmountBeforeBillDiscount!);
    });

    this.itemLinesTotalAmount.setValue(itemLinesAmount);
  }

  /**
   * This function is executed once a user click on Edit button.
   * The selected item line will be populated in the item form.
   */
  public editItemLine() : void{

    if(!!this.selectedLineItemForEdit && this.selectedLineItemForEdit.jacksontype == 'ItemLineImpl') {

      if(!!this.selectedLineItemForEdit?.attributeGroupLines && this.selectedLineItemForEdit?.attributeGroupLines.length > 0) {
        this.itemForm.addControl("attributeGroupLines", new FormControl());
      }

      this.itemForm.patchValue({
        isTaxDeductionFromAmountEnabled : 
          this.selectedLineItemForEdit?.quantity && this.selectedLineItemForEdit?.rate &&
          this.selectedLineItemForEdit?.quantity * this.selectedLineItemForEdit?.rate == this.selectedLineItemForEdit.totalAmountBeforeBillDiscount 
          ? true : false,
        itemId: this.selectedLineItemForEdit?.itemId,
        itemName: this.selectedLineItemForEdit?.itemName,
        itemProductCode: this.selectedLineItemForEdit?.itemProductCode,
        quantity: this.selectedLineItemForEdit?.quantity,
        unit: this.selectedLineItemForEdit?.unit,
        unitName: this.selectedLineItemForEdit?.unitName,
        mrp: ((this.selectedLineItemForEdit?.rate! * 100) / (100-this.selectedLineItemForEdit?.discount!) / this.selectedLineItemForEdit?.quantity!),
        discount: this.selectedLineItemForEdit?.discount,
        rate: this.selectedLineItemForEdit?.rate,
        taxGroup: this.selectedLineItemForEdit?.taxGroup,
        taxGroupName: this.selectedLineItemForEdit?.taxGroupName,
        taxLines: this.selectedLineItemForEdit?.taxLines,      
        taxableAmountBeforeBillDiscount: this.selectedLineItemForEdit?.taxableAmountBeforeBillDiscount,
        taxAmount: this.selectedLineItemForEdit?.taxAmount,      
        totalAmountBeforeBillDiscount: this.selectedLineItemForEdit?.totalAmountBeforeBillDiscount,
        attributeGroupLines : this.selectedLineItemForEdit?.attributeGroupLines,
        stockLocation: this.selectedLineItemForEdit?.stockLocation
      });

      let searchArgument : GetObjectsArgument = {};
      searchArgument.nameSearchText = this.selectedLineItemForEdit?.itemName;

      this.parentOverlayService.enableProgressSpinner(); 
      
      this.itemService.getPItemMasterList(searchArgument).subscribe({
        next: (data) => {

          let pItemMasterList = data.objects;

          if(!!pItemMasterList && pItemMasterList.length == 1) {
            //this.itemSelectionChangeSubscribers(pItemMasterList[0]);
            this.itemLineEditMode = true;
          }   

          this.parentOverlayService.disableProgressSpinner();     

          this.openItemSelectionForm();
        }
      });
    } else if(!!this.selectedLineItemForEdit && this.selectedLineItemForEdit.jacksontype == 'ServiceLineImpl') {
      this.itemLineEditMode = true;
      this.openServicesForm();
    }
  }

  /**
   * This function delete the selected line item.
   */
  public deleteItemLine() : void{    
    let indexToDelete = this.itemLines.findIndex((itemLine) => itemLine.itemId == this.selectedLineItemForEdit?.itemId);
    this.itemLines.splice(indexToDelete, 1);
    this.selectedLineItemForEdit = undefined;
    this.itemLinesDataSource.data = this.itemLines;
    this.updateFinalAmounts();
  }

  /**
   * This function reset the item line form to its initial state.
   */
  public cancelAddItem() : void {
    this.selectedLineItemForEdit = undefined;
    this.initializeItemForm();
  }

  /**
   * This function set the line item for Edit.
   * Only set the selected item line not do edit.
   * @param row 
   */
  public setSelectedLineItem(row : IItemLine) : void {
    this.selectedLineItemForEdit = row;
  }

  /** Opens the other charges & discounts dialog box. */
  public openOtherChargesDiscountsModal() : void{
    if(!!this.itemLines && this.itemLines.length > 0) {
      const OrderChargesDiscountsDialogRef = this.matDialog.open(OrderChargesDiscountsComponent, { 
        panelClass: 'custom-dialog-container', 
        data : {
          itemLinesTotalAmount: this.itemLinesTotalAmount.value,
          selectedOtherChargeLineForEdit: this.selectedOtherChargeLineForEdit
        },
        disableClose: true,      
      }); 
  
      OrderChargesDiscountsDialogRef.afterClosed().subscribe(result => {  
        if(!this.otherChargeLineEditMode) { // New Other Charge Line Mode
          let iOtherChargeLine : IOtherChargesLine = {};
  
          iOtherChargeLine.jacksontype = "OtherChargesLineImpl";
          iOtherChargeLine.chargesId = result.chargesDiscountsFormRawValue.chargesId;
          iOtherChargeLine.chargesName = result.chargesDiscountsFormRawValue.chargesName;
          iOtherChargeLine.value = result.chargesDiscountsFormRawValue.value;
          iOtherChargeLine.amount = result.chargesDiscountsFormRawValue.amount;
    
          this.addedOtherCharges = [...this.addedOtherCharges, iOtherChargeLine];
        } else { // Edit Mode
  
          if(!!this.selectedOtherChargeLineForEdit) {

            let updatedOtherChargeLine = Object.assign(this.selectedOtherChargeLineForEdit, result.chargesDiscountsFormRawValue);

            this.addedOtherCharges = this.addedOtherCharges.map((iL) => {
              if(iL.chargesId == updatedOtherChargeLine.chargesId) {
                iL = updatedOtherChargeLine;
              }
              return iL;
            });
          }
  
          this.otherChargeLineEditMode = false;
          this.selectedOtherChargeLineForEdit = undefined;
        }  
            
        this.updateOtherChargesTotalAmount();
        this.otherChargesDataSource.data = this.addedOtherCharges;
      });
    }else{
      this._snackBar.open(`Atlease one item/service must be added`,'Close', {
        duration: 5000
      });
    }
    
  }

  /**
   * This function updates the total other charges added from Other Charge form.
   * Further updates the Net final amount.
   */
  private updateOtherChargesTotalAmount() : void{
    this.otherChargesTotalAmount.setValue(0);
    let otherChargesAmount : number = 0;

    this.addedOtherCharges.forEach((otherCharge) => {
      otherChargesAmount = parseFloat(otherChargesAmount.toFixed(2)) + parseFloat(otherCharge.amount!.toFixed(2));
    });

    this.otherChargesTotalAmount.setValue(otherChargesAmount);
    this.updateNetFinalAmount();
  }


  public setSelectedOtherChargeLine(row: IOtherChargesLine) : void {
    this.selectedOtherChargeLineForEdit = row;
  }

   /**
   * This function is executed when user click on EDIT button.
   * The values and visibility is updated in form group as per the selected other charge line.
   */
   public editOtherChargeLine() : void {
    if(!!this.itemLines && this.itemLines.length > 0) {
      this.otherChargeLineEditMode = true;
      this.openOtherChargesDiscountsModal();
    }
   }
  
   public deleteOtherChargeLine() : void {
    let otherChargesToDeleteIndex = this.addedOtherCharges.findIndex((otherCharge) => otherCharge.chargesId == this.selectedOtherChargeLineForEdit?.chargesId);
    this.addedOtherCharges.splice(otherChargesToDeleteIndex, 1);
    this.selectedOtherChargeLineForEdit = undefined;
    this.otherChargesDataSource.data = this.addedOtherCharges;
    this.updateFinalAmounts();
  }


  /** 
  * This function updates the already added other charges and total other charges amount in case if 
  *  - New item is added.
  *  - Existing item is modified
  */
  updateOtherCharges() {
    
    this.addedOtherCharges.map((otherCharge) =>{
      if(otherCharge.value != 0){
        otherCharge.amount = (otherCharge.value! * this.itemLinesTotalAmount.value)/100;
      }
    });

    this.updateOtherChargesTotalAmount();
  }

  /**
  * This function reset the other charge form in case if user select wrong or change mind.
  */
  public cancelOtherCharges() : void {
    this.selectedOtherChargeLineForEdit = undefined;
  }

 

  /**
   * This function opens the services form
   */
  openServicesForm():  void{
    const OrderServicesDialogRef = this.matDialog.open(OrderServicesComponent, { 
      panelClass: 'custom-dialog-container', 
      data : {
        isTaxDeductionEnabled : this.itemForm.controls["isTaxDeductionFromAmountEnabled"].value,
        serviceLine : this.selectedLineItemForEdit,
        itemLinesTotalAmount: this.getAllIItemLineAmount()
      },
      disableClose: true,      
    }); 

    OrderServicesDialogRef.afterClosed().subscribe(result => {      
      if(result.servicesFormRawValue) {
        let itemLine : IItemLine = result["servicesFormRawValue"];     

        itemLine.itemName = itemLine.taxableEntityName;
        itemLine.itemId = itemLine.taxableEntityId;
  
        if(!this.itemLineEditMode) { //New Item Line added
          this.itemLines = [...this.itemLines, itemLine];
        }else if(!!this.selectedLineItemForEdit) {//Edit existing item line.
  
          let updatedItemLine = Object.assign(this.selectedLineItemForEdit, itemLine);
  
          this.itemLines = this.itemLines.map((iL) => {
            if(iL.itemId == updatedItemLine.itemId) {
              iL = updatedItemLine;
            }
            return iL;
          });
  
          this.itemLineEditMode = false;
          this.selectedLineItemForEdit = undefined;
        }
  
        this.updateFinalAmounts();
        this.itemLinesDataSource.data = this.itemLines;
      }      
    });
  }

  private getAllIItemLineAmount(): number | undefined{
    return this.itemLines && this.itemLines.length > 0 ? this.itemLines.filter((iL) => iL.jacksontype == 'ItemLineImpl')
        .map(iL => iL.taxableAmountBeforeBillDiscount)
        .reduce((a,b) => {
          return (!!a ? a : 0) + (!!b ? b : 0);
        }
      ) : 0;
  }

  /**
   * This function updates the net final amount.
   */
  updateNetFinalAmount() {
    this.netFinalAmount.setValue(this.itemLinesTotalAmount.value + this.otherChargesTotalAmount.value);
    this.orderTxForm.controls["billAmount"].setValue(this.netFinalAmount.value);
  }

  private updateFinalAmounts() {
    this.updateItemLinesTotalAmount(); // Update the total item lines amount.
    this.updateOtherCharges(); // Update the total other charges amount and other charges lines.      
    this.updateNetFinalAmount();   
  }

  public updateItemLineProperties(taxableLines : ITaxableLine[]) : IItemLine[]{

    let updatedItemLines : IItemLine[] = [];

    if(!!taxableLines && taxableLines.length > 0) {
      updatedItemLines = taxableLines.map((taxableLine) => {
        if(taxableLine.jacksontype == "ServiceLineImpl") {
          let serviceId = taxableLine.taxableEntityId;
          let serviceName = taxableLine.taxableEntityName;
          
          let itemLine = taxableLine as IItemLine;
          itemLine.itemId = serviceId;
          itemLine.itemName = serviceName;

          return itemLine;
        }else{
          return taxableLine as IItemLine;
        }
        
      });
    }
    return updatedItemLines;
  }

  public addPaymentDetails() : void{
    if(this.headerTitle != 'Quotation' && this.headerTitle != 'Inward Quotation'){
      const OrderPaymentDialogRef = this.matDialog.open(OrderPaymentDetailComponent, { 
        panelClass: 'custom-dialog-container', 
        data : {
          txLedgerId : this.orderTxForm.controls["ledgerId"].value,
          netAmount  : this.netFinalAmount.value,
          orderTxId: this.orderTxForm.controls["id"].value,
          paymentLines: this.orderTxForm.controls["paymentLines"].value,
          returnAmount: this.orderTxForm.controls["returnAmount"].value,
        },
        disableClose: true,      
      }); 
  
      OrderPaymentDialogRef.afterClosed().subscribe(result => {        
        if(!!result && !!result.paymentLines && result.paymentLines.length > 0){
          this.orderTxForm.patchValue({
            paymentLines: result.paymentLines,
            returnAmount: result.returnAmount
          });
  
          if(result.completeTx) {
            this.saveOrderTx();
          }
        }
      });
    }else{
      this.saveOrderTx();
    }    
  }

  getOrderFormControl(name: string) : FormControl{
    return this.orderTxForm.get(name) as FormControl;
  }

  getItemFormControl(name: string) {
    return this.itemForm.get(name) as FormControl;
  }

  /**
   * 
   */
  public getItemLineRatePerQuantity(rate : number | undefined, quantity: number | undefined) : number{
    return rate && quantity ? Number((rate/quantity).toFixed(2)) : 0;
  }

  
  public abstract showItemStockAttributes() : void;

  public abstract cancelOrderTx() : void;

  public abstract saveOrderTx() : void;
}
