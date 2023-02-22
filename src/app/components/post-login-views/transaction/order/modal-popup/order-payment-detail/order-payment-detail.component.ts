import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, shareReplay } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { IPaymentLine, IPaymentMode, LedgerServiceService, PaymentModeServiceService } from 'src/server';

@Component({
  selector: 'app-order-payment-detail',
  templateUrl: './order-payment-detail.component.html',
  styleUrls: ['./order-payment-detail.component.css']
})
export class OrderPaymentDetailComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  public PaymentModes = IPaymentMode.TypeEnum;

  public paymentDetailForm!: FormGroup;
  private totalPaymentRecieved : number = 0;
  private totalPaymentReturned : number = 0;

  private paymentLines : Array<IPaymentLine> = [];
  
  public isFormLoaded : boolean = false;

  constructor(private breakpointObserver: BreakpointObserver, private paymentModeService : PaymentModeServiceService,
    private formBuilder : FormBuilder, private customDateAdapterService  : CustomDateAdapterService, private ledgerService : LedgerServiceService,
    private _snackBar: MatSnackBar,
    public orderPaymentCompRef: MatDialogRef<OrderPaymentDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      txLedgerId: number, 
      netAmount: number,
      orderTxId : number,
      paymentLines : Array<IPaymentLine>,
      returnAmount : number
    }) { }

  ngOnInit(): void {
    this.paymentModeService.getObjects().subscribe({
      next: (data) => {
        if(!!data && data.length > 0) {
          this.paymentDetailForm = this.formBuilder.group({
            paymentModeLines: this.formBuilder.array([])
          });
  
          // Prepare form groups for payment mode type as 'Cash'
          let cashPaymentModes = data.filter((paymentMode) => paymentMode.type === IPaymentMode.TypeEnum.Cash);
          cashPaymentModes.forEach((cashPaymentMode, index) => {
            this.createPaymentModeControls(cashPaymentMode, index);
          });
  
          // Prepare form groups for payment mode type other than 'Cash'
          let otherPaymentModes = data.filter((paymentMode) => paymentMode.type !== IPaymentMode.TypeEnum.Cash);
          otherPaymentModes.forEach((otherPaymentMode, index) => {
            this.createPaymentModeControls(otherPaymentMode);
          });

          this.createPaymentModeControls();

          // Update Payment mode lines with the previously saved tx data.
          if(!!this.data.orderTxId) {
            this.updatePreEnteredValues();
          }

          this.isFormLoaded = true;
        }
      }
    });
  } 
  
  // Create Payment mode controls which will be displayed in template.
  private createPaymentModeControls(paymentMode?: IPaymentMode, index?: number) {

    let txDate = new Date();
    
    if(!!paymentMode) {
      let paymentModeLine = this.formBuilder.group({
        jacksontype: new FormControl(paymentMode.jacksontype),
        id: new FormControl(paymentMode.id),
        paymentLineId: new FormControl(),
        name: new FormControl(paymentMode.name),
        type: new FormControl(paymentMode.type),
        ledgerId: new FormControl(paymentMode.ledgerId),
        ledgerName: new FormControl(paymentMode.ledgerName),
  
        //Below Properties are required to create payment Lines.
        amount: new FormControl(index != undefined && index == 0 ? this.data.netAmount : 0),
        chequeNumber: new FormControl(),
        chequeDate: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
        cardNumber: new FormControl(),
        cardType: new FormControl()
      });

      paymentModeLine.controls["amount"].valueChanges.subscribe({
        next: (data : number) => {
          this.updateReturnAmount();
        }
      });

      this.paymentModeLines.push(paymentModeLine);
    }else{
      let paymentModeLine = this.formBuilder.group({
        jacksontype: new FormControl(),
        id: new FormControl(),
        paymentLineId: new FormControl(),
        name: new FormControl('Return Amount'),
        type: new FormControl('RETURN_AMOUNT'),
        ledgerId: new FormControl(),
        ledgerName: new FormControl(),
        amount: new FormControl({value: 0 , disabled: true}),
        chequeNumber: new FormControl(),
        chequeDate: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(),txDate.getMonth(), txDate.getDate())),
        cardNumber: new FormControl(),
        cardType: new FormControl()
      });

      this.paymentModeLines.push(paymentModeLine);
    }
  }

  private updateReturnAmount() {

    let returnAmountPaymentLine = this.formBuilder.group({});
    let paymentLinesAmount = 0;

    for(let i = 0 ; i < this.paymentModeLines.length; i++) {
      let paymentLineGroup =  this.paymentModeLines.at(i) as FormGroup;
      if(paymentLineGroup.controls["type"].value ==  'RETURN_AMOUNT') {
        returnAmountPaymentLine = paymentLineGroup;        
      }else{
        paymentLinesAmount = paymentLinesAmount + paymentLineGroup.controls["amount"].value;
      }
    }

    // Get the total payment recieved in each payment mode lines.
    this.totalPaymentRecieved = paymentLinesAmount;

    if(this.totalPaymentRecieved > this.data.netAmount) {
      returnAmountPaymentLine.patchValue({
        amount : this.totalPaymentRecieved - this.data.netAmount
      });
    }else{
      returnAmountPaymentLine.patchValue({
        amount : 0
      });
    }

    this.totalPaymentReturned = returnAmountPaymentLine.controls["amount"].value;
  }


  private updatePreEnteredValues() : void{

    for(let i = 0 ; i < this.paymentModeLines.length; i++) {
      let paymentModeLineGroup =  this.paymentModeLines.at(i) as FormGroup;
      let paymentLine = this.data.paymentLines.find((paymentLine) => paymentLine.paymentModeId === paymentModeLineGroup.controls["id"].value);
      if(!!paymentLine) {
        paymentModeLineGroup.patchValue({
          paymentLineId : paymentLine.id,
          amount: paymentLine.amount,
          chequeNumber: paymentLine.chequeNumber,
          chequeDate: paymentLine.chequeDate,
          cardNumber: paymentLine.cardNumber,
          cardType: paymentLine.cardType
        });
      }
    }
  }

  public savePaymentLines() : void {   
    this.ledgerService.getCashLedger().subscribe({
      next: (data) => {
        if(data.id == this.data.txLedgerId) {
          if(!this.isCashPaymentEquals()){
            this._snackBar.open(`Total transaction amount should be equal to ${this.data.netAmount}`,'Close', {
              duration: 5000
            });
            return; 
          }
        }
        
        for(let i = 0; i < this.paymentModeLines.length; i++) {
          let paymentLine = this.paymentModeLines.at(i) as FormGroup;

          if(paymentLine.controls["type"].value !=  'RETURN_AMOUNT') {
            this.paymentLines.push({
              jacksontype: 'PaymentLineImpl',
              id: paymentLine.controls["paymentLineId"].value,
              paymentModeId: paymentLine.controls["id"].value,
              paymentModeName: paymentLine.controls["name"].value,
              ledgerId: paymentLine.controls["ledgerId"].value,
              ledgerName: paymentLine.controls["ledgerName"].value,
              amount: paymentLine.controls["amount"].value,
              chequeDate: paymentLine.controls["chequeDate"].value,
              chequeNumber: paymentLine.controls["chequeNumber"].value,
              cardNumber: paymentLine.controls["cardNumber"].value,
              cardType: paymentLine.controls["ledgerName"].value
            });
          }          
        }

        this.orderPaymentCompRef.close({paymentLines : this.paymentLines, returnAmount: this.totalPaymentReturned, completeTx: true});
      }
    });
  }
 
  public cancelPaymentEntry() : void{
    this.orderPaymentCompRef.close({paymentLines :  this.data.paymentLines, returnAmount: this.data.returnAmount, completeTx : false});
  }


  private isCashPaymentEquals() : boolean{
    this.updateReturnAmount();
    return (this.totalPaymentRecieved - this.totalPaymentReturned) == this.data.netAmount ? true : false;
  }


  // Function to get attributes from Parent FormGroup.
  get paymentModeLines() {
    return this.paymentDetailForm.controls["paymentModeLines"] as FormArray;
  }

  public toFormGroup = (form: AbstractControl) => form as FormGroup;

  public getFormControl = (form: AbstractControl, controlName : string) => form.get(controlName) as FormControl;

  public getFormGroupControlValue(formGroup: AbstractControl, controlName : string) : string{    
    return (formGroup as FormGroup).controls[controlName].value;
  }
}
