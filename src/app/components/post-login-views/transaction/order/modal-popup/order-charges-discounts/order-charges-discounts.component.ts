import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription, map, shareReplay } from 'rxjs';
import { IItemLine, IOtherCharges, IOtherChargesLine, OtherChargesServiceService } from 'src/server';

@Component({
  selector: 'app-order-charges-discounts',
  templateUrl: './order-charges-discounts.component.html',
  styleUrls: ['./order-charges-discounts.component.css']
})
export class OrderChargesDiscountsComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  retrievedOtherCharges : IOtherCharges[] = []; // From server.

  public otherChargesDiscountForm! : FormGroup;
  otherChargeValueSubscription : Subscription;

  isFormLoaded : boolean = false;
  
  constructor(private breakpointObserver: BreakpointObserver,private formBuilder : FormBuilder,
    private otherChargesService : OtherChargesServiceService,
    public orderChargesDiscountsCompRef: MatDialogRef<OrderChargesDiscountsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      itemLinesTotalAmount: number,
      selectedOtherChargeLineForEdit: IOtherChargesLine | undefined
    }) { }

  ngOnInit(): void {
    this.getOtherCharges();
  }

  public getOtherCharges() {
    this.otherChargesService.getObjects().subscribe({
      next: (data) => {
        this.retrievedOtherCharges = data;
        this.initializeOtherChargesDiscountForm();
      }
    });
  }

  /**
   * This function initialize the other charges discount form.
   */
  public initializeOtherChargesDiscountForm() {
    this.otherChargesDiscountForm = this.formBuilder.group({      
      chargesId: new FormControl(''),
      chargesName: new FormControl(''),
      billAmount: new FormControl({ value: 0, disabled: true }),      
      discount: new FormControl(''),
      type: new FormControl(''),
      value : new FormControl(0),
      displayedValue : new FormControl(0),
      amount: new FormControl(0),
      displayedAmount: new FormControl(0)
    });

    if(!!this.data.selectedOtherChargeLineForEdit) {
      this.updateOtherChargesFormValues();
    }

    this.isFormLoaded = true;
  }

  /**
   * This function is executed when user changes the other charges/discount type.
   * value and amount is updated when user click on ADD button.
   */
  public changeOtherChargesType() : void{
    let selectedChargeId = this.otherChargesDiscountForm.controls["chargesId"].value;
    
    let selectedOtherCharge =  this.retrievedOtherCharges.find((otherCharge) => otherCharge.id == selectedChargeId);

    if(!!selectedOtherCharge) {
      console.log(selectedOtherCharge);

      this.otherChargesDiscountForm.patchValue({
        chargesName : selectedOtherCharge.name,
        billAmount : this.data.itemLinesTotalAmount,
        type : selectedOtherCharge.type,
        discount : selectedOtherCharge.discount
      });

      if(this.otherChargesDiscountForm.controls["type"].value == "PERCENT") {
        
        this.otherChargesDiscountForm.controls["displayedValue"].enable();
        this.otherChargesDiscountForm.controls["displayedAmount"].enable();

        let amount = this.otherChargesDiscountForm.controls["billAmount"].value * selectedOtherCharge.value!/100;

        this.otherChargesDiscountForm.patchValue({
          displayedValue : Math.abs(selectedOtherCharge.value!),          
          displayedAmount : Math.abs(amount)
        });

        // Subscribe for value change in displayed value control.
        this.addSubscriptionOnOtherChargeValue();


      } else if(this.otherChargesDiscountForm.controls["type"].value == "FIXED") {
        
        this.otherChargesDiscountForm.controls["displayedValue"].disable();
        this.otherChargesDiscountForm.controls["displayedAmount"].enable();

        this.otherChargesDiscountForm.patchValue({
          value : 0, 
          displayedValue : 0,
          displayedAmount : Math.abs(selectedOtherCharge.value!) 
        });
      }
    }

  }

  /**
   * This function add the subscription on other charge value if PERCENT type of other charge is selected.
   */
  private addSubscriptionOnOtherChargeValue() {
    this.otherChargeValueSubscription = this.otherChargesDiscountForm.controls["displayedValue"].valueChanges.subscribe({
      next: (data) => {
        console.log("Triggered value change subscribe");
        let amount = Math.abs(this.otherChargesDiscountForm.controls["billAmount"].value * data / 100);

        this.otherChargesDiscountForm.patchValue({
          displayedAmount: amount
        });
      }
    });
  }

  /**
   * This function is executed when user add or edit an other change line.
   * Only works on click of ADD button.
   */
  public addOrEditOtherChargesLine() : void {
    let isDiscount = this.otherChargesDiscountForm.controls["discount"].value;
    let displayedValue = this.otherChargesDiscountForm.controls["displayedValue"].value;
    let displayedAmount = this.otherChargesDiscountForm.controls["displayedAmount"].value;

    if(isDiscount) {
      this.otherChargesDiscountForm.patchValue({
        value: displayedValue * -1,
        amount: displayedAmount * -1
      });
    }else{
      this.otherChargesDiscountForm.patchValue({
        value: displayedValue,
        amount: displayedAmount
      });
    }

    this.orderChargesDiscountsCompRef.close({
      chargesDiscountsFormRawValue : this.otherChargesDiscountForm.getRawValue()
    });
  }

  private updateOtherChargesFormValues() : void{
     // Get original other charge line to get type and discount value.
     let originalOtherCharge =  this.retrievedOtherCharges
     .find((otherCharge) => otherCharge.id == this.data.selectedOtherChargeLineForEdit?.chargesId);    
   
    this.otherChargesDiscountForm.patchValue({
    chargesId: this.data.selectedOtherChargeLineForEdit?.chargesId,
    chargesName: this.data.selectedOtherChargeLineForEdit?.chargesName,
    discount: originalOtherCharge?.discount,
    type: originalOtherCharge?.type,
    billAmount: this.data.itemLinesTotalAmount,
    value: this.data.selectedOtherChargeLineForEdit?.value,
    amount: this.data.selectedOtherChargeLineForEdit?.amount,
    displayedValue: Math.abs(this.data.selectedOtherChargeLineForEdit?.value!),
    displayedAmount: Math.abs(this.data.selectedOtherChargeLineForEdit?.amount!)
    }); 

    if(this.otherChargesDiscountForm.controls["type"].value == "PERCENT") {        
    this.otherChargesDiscountForm.controls["displayedValue"].enable();
    this.otherChargesDiscountForm.controls["displayedAmount"].enable();

    this.addSubscriptionOnOtherChargeValue(); // Adding subscription again as 
                                              // it was unsubscribed after addition of other charge line.

    }else{
    this.otherChargesDiscountForm.controls["displayedValue"].disable();
    this.otherChargesDiscountForm.controls["displayedAmount"].enable();
    }
  }
}
