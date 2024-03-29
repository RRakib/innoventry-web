import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, map, shareReplay } from 'rxjs';
import { TransactionsProvider } from 'src/app/services/transactionsProvider';
import { IItemLine, IServiceMaster, ITax, ITaxGroup, ServiceServiceService, TaxGroupServiceService, TaxableEntityServiceService } from 'src/server';

@Component({
  selector: 'app-order-services',
  templateUrl: './order-services.component.html',
  styleUrls: ['./order-services.component.css']
})
export class OrderServicesComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
  taxGroups: Array<ITaxGroup>;

  retrievedServices : IServiceMaster[] = []; // From Server.
  public servicesForm! : FormGroup;

  isServicesListed : boolean = false;
  selectedService : IServiceMaster | undefined;

  constructor(private breakpointObserver: BreakpointObserver,private formBuilder : FormBuilder,
    private serviceApi : ServiceServiceService,
    private taxGroupServiceService: TaxGroupServiceService,
    private taxableEntityServiceService : TaxableEntityServiceService,
    private txProvider: TransactionsProvider,
    public orderServicesCompRef: MatDialogRef<OrderServicesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      isTaxDeductionEnabled : boolean,
      serviceLine: IItemLine,
      itemLinesTotalAmount: number
    }) {

  }

  ngOnInit(): void {    
    // Inititalize Services Form and other properties.
    this.taxGroupServiceService.getObjects().subscribe({
      next: (data) => {
        if(!!data) {
          this.taxGroups = data;
          this.getServices();
        }
      }
    });
    
  }

  /** 
   * This method get all the configured services
   */
  public getServices() : void{
    this.serviceApi.getObjectsSearchArg({startPageIndex : 0, genericSearch: false}).subscribe({
      next: (data) => {
          this.retrievedServices = !!data && !!data.objects && data.objects?.length > 0 ?  data.objects : [];
          this.initializeServicesForm();

          this.isServicesListed = true;
      }
    });
  }

  /**
   * This function initialize the other charges discount form.
   */
  public initializeServicesForm() {
    this.servicesForm = this.formBuilder.group({      
      jacksontype: new FormControl('ServiceLineImpl'),
      id: new FormControl(!!this.data.serviceLine ? this.data.serviceLine.id : null),
      taxableEntityId: new FormControl(!!this.data.serviceLine ? this.data.serviceLine.itemId : ''),
      taxableEntityName: new FormControl(!!this.data.serviceLine ? this.data.serviceLine.itemName : ''),
      quantity: new FormControl(!!this.data.serviceLine ? this.data.serviceLine.quantity : 1),   
      rate: new FormControl(!!this.data.serviceLine ? this.data.serviceLine.rate : 0),   
      netRate: new FormControl(),
      amount: new FormControl(!!this.data.serviceLine ? this.data.serviceLine.totalAmountBeforeBillDiscount : 0),
      percentage: new FormControl(),
      taxableAmountBeforeBillDiscount: new FormControl({value : !!this.data.serviceLine ? this.data.serviceLine.taxableAmountBeforeBillDiscount : '', disabled: true}),      
      taxGroup : new FormControl(!!this.data.serviceLine ? this.data.serviceLine.taxGroup : null),
      taxGroupName : new FormControl({ value: !!this.data.serviceLine ? this.data.serviceLine.taxGroupName : '', disabled: true }),
      taxAmount: new FormControl({ value: !!this.data.serviceLine ? this.data.serviceLine.taxAmount : null, disabled: true }),
      totalAmountBeforeBillDiscount: new FormControl({ value: !!this.data.serviceLine ? this.data.serviceLine.totalAmountBeforeBillDiscount : 0, disabled: true })
    });

    this.servicesForm.patchValue({
      netRate: this.servicesForm.controls["rate"].value * this.servicesForm.controls["quantity"].value
    });

    if(!!this.data.serviceLine) {
      let taxableEntityId = this.servicesForm.controls["taxableEntityId"].value;    
      this.selectedService =  this.retrievedServices.find((service) => service.id == taxableEntityId);
    }


    this.servicesForm.controls['quantity'].valueChanges.subscribe((data) => {
      if(this.selectedService) {
        let rate = this.servicesForm.controls["rate"].value;
        if(this.selectedService.percentage) {
          rate =( rate * this.data.itemLinesTotalAmount)/100;
        }

        this.servicesForm.patchValue({
          netRate: rate * data,
          totalAmountBeforeBillDiscount: rate * data
        });
        this.updateTax(rate * data);
      }      
    });

    this.servicesForm.controls['rate'].valueChanges.subscribe((data) => {
      if(this.selectedService){
        if(this.selectedService.percentage) {
          data =( data * this.data.itemLinesTotalAmount)/100;
        }

        this.servicesForm.patchValue({     
          netRate: this.servicesForm.controls["quantity"].value * data,     
          totalAmountBeforeBillDiscount:  data * this.servicesForm.controls['quantity'].value
        });
        this.updateTax(data * this.servicesForm.controls['quantity'].value);
        } 
      }
    );

    // this.servicesForm.controls['totalAmountBeforeBillDiscount'].valueChanges.subscribe((data) => {
    //   if(this.selectedService && this.selectedService.rate) {
    //     this.servicesForm.patchValue({          
    //       rate:  this.servicesForm.controls['totalAmountBeforeBillDiscount'].value / this.servicesForm.controls['quantity'].value
    //     });
    //     this.updateTax(this.servicesForm.controls["rate"].value * this.servicesForm.controls['quantity'].value);
    //   }      
    // });
  }

  /**
   * This method updates the taxable entity name i.e. service name into the group form.
   */
  changeServiceType() : void{
    let taxableEntityId = this.servicesForm.controls["taxableEntityId"].value;
    
    this.selectedService =  this.retrievedServices.find((service) => service.id == taxableEntityId);
    

    if(!!this.selectedService && this.selectedService.rate) {
      this.servicesForm.patchValue({
        taxableEntityName : this.selectedService.name,
        quantity: 1,
        rate: this.selectedService.rate,
        amount: this.calculateAmount(this.selectedService)
      });
    }
  }
  
  calculateAmount(selectedService: IServiceMaster  | undefined): void {
    if(selectedService){      
      this.taxableEntityServiceService.getTaxGroup(this.txProvider.billingClassification().id, this.txProvider.billingGroup().id, selectedService.taxClassId)
          .subscribe((taxGroupObj: ITaxGroup) => {

            if (taxGroupObj  && selectedService.rate) {
              this.servicesForm.patchValue({       
                taxGroup: taxGroupObj.id,
                taxGroupName: taxGroupObj.name        
              });

              if(selectedService.percentage) {
                this.updateTax(selectedService.rate * this.data.itemLinesTotalAmount / 100);
              }else{
                this.updateTax(selectedService.rate);
              }
              
            }
      });
    }
  }


  updateTax(netRate: number) {

    let taxGroup : ITaxGroup | undefined;
    let totalTaxValue : number = 0;

    let quantity = this.servicesForm.controls['quantity'].value;
    if (quantity != 0) {
      if (this.data.isTaxDeductionEnabled) {
        let totalAmount = netRate;
        if (this.taxGroups) {
          taxGroup = this.taxGroups.find(res => res.id === this.servicesForm.controls['taxGroup'].value);
        }
        
        let totalAmountTemp = netRate;
        if (taxGroup && taxGroup.taxList) {
          totalTaxValue = !!taxGroup.taxRate ? taxGroup.taxRate : 0;
          for (let tax of taxGroup.taxList) {
            if (tax.fixed && tax.value && tax.taxOnTaxList) {
              totalAmountTemp = totalAmountTemp - quantity * tax.value;
              for (let taxOnTax of tax.taxOnTaxList) {
                taxOnTax.value = !!taxOnTax.value ? taxOnTax.value : 0;
                totalAmountTemp = parseFloat((totalAmountTemp - (quantity * tax.value * taxOnTax.value / 100)).toFixed(2));
              }
            }

          }
        }
        let amountWithoutTax: number = parseFloat((totalAmountTemp * 100 / (100 + totalTaxValue)).toFixed(2));
        let taxAmount: number;
        let amount: number;
        let diff: number
        taxAmount = this.getTaxAmount(amountWithoutTax);
        amount = amountWithoutTax;
        amount = parseFloat((amount).toFixed(2));
        diff = parseFloat((totalAmount - (taxAmount + amount)).toFixed(2));
        if (diff != 0) {
          amount = amount + diff;
        }
        
        this.servicesForm.controls['taxableAmountBeforeBillDiscount'].setValue(amount.toFixed(2));
        this.servicesForm.controls['taxAmount'].setValue(taxAmount.toFixed(2));
        this.servicesForm.controls['totalAmountBeforeBillDiscount'].setValue(netRate.toFixed(2));
      } else {
        let amount: number = netRate;
        let taxAmount = this.getTaxAmount(amount);
        let totalAmount = amount + taxAmount;
        this.servicesForm.controls['amount'].setValue((netRate).toFixed(2));
        this.servicesForm.controls['totalAmountBeforeBillDiscount'].setValue((totalAmount).toFixed(2));
        this.servicesForm.controls['taxAmount'].setValue(taxAmount.toFixed(2));

      }
    } else {
      // this.commonUtils.showToastMessage('Quantity must have positive numeric value')
    }

  }


  getTaxAmount(amountWithoutTax: number, taxGroup?: ITaxGroup) {
    let taxList : ITax[] | undefined;

    let tg = this.servicesForm.controls['taxGroup'].value
    if (tg) {
      taxGroup = this.taxGroups.find(res => res.id === tg);
    }
    let taxAmount = 0;

    if (taxGroup != null) {
      taxList = !!taxGroup.taxList ? taxGroup.taxList : [];

      for (let tax of taxList) {
        let taxLineAmount = 0;
        let qty = this.servicesForm.controls['quantity'].value;
        tax.value = !!tax.value ? tax.value : 0
        if (tax.fixed) {          
          taxLineAmount = tax.value * parseFloat(qty);
        }
        else {
          taxLineAmount = parseFloat((amountWithoutTax * tax.value / 100).toFixed(2));
        }

        taxAmount = taxAmount + taxLineAmount;

        if(!!tax.taxOnTaxList) {
          for (let taxOnTax of tax.taxOnTaxList) {
            taxOnTax.value = !!taxOnTax.value ? taxOnTax.value : 0;
            taxAmount = taxAmount + parseFloat((taxLineAmount * taxOnTax.value / 100).toFixed(2));
          }
        }
      }
    }
    return taxAmount;
  }

  /**
   * This method executed when user click on Add button in service popup.
   * This is a callback method.
   */
  saveUpdateServiceLine(): void{
    this.orderServicesCompRef.close({
      servicesFormRawValue : this.servicesForm.getRawValue()
    });
  }

  cancelServiceAddition() : void{
    this.orderServicesCompRef.close({
      servicesFormRawValue : undefined
    });
  }

}
