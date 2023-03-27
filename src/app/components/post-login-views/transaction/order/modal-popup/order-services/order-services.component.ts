import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, map, shareReplay } from 'rxjs';
import { IServiceMaster, ServiceServiceService } from 'src/server';

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
  
  retrievedServices : IServiceMaster[] = []; // From Server.
  public servicesForm! : FormGroup;

  isServicesListed : boolean = false;
  
  isTaxDeductionFromAmountEnabled : boolean = true;
  
  constructor(private breakpointObserver: BreakpointObserver,private formBuilder : FormBuilder,
    private serviceApi : ServiceServiceService,
    public orderPaymentCompRef: MatDialogRef<OrderServicesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
    }) {

  }

  ngOnInit(): void {
    // Inititalize Services Form and other properties.
    this.getServices();
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
      id: new FormControl(),
      taxableEntityId: new FormControl(''),
      taxableEntityName: new FormControl(''),
      quantity: new FormControl(),   
      rate: new FormControl(),   
      amount: new FormControl(),
      percentage: new FormControl(),
      deductTaxFromAmount : new FormControl(true),
      taxableAmountBeforeBillDiscount: new FormControl(),      
      taxGroup : new FormControl(),
      taxGroupName : new FormControl({ value: '', disabled: true }),
      taxAmount: new FormControl({value : '', disabled: true}),
      totalAmountBeforeBillDiscount: new FormControl({value : '', disabled: true})
    });
  }

  /**
   * This method updates the taxable entity name i.e. service name into the group form.
   */
  changeServiceType() : void{
    let taxableEntityId = this.servicesForm.controls["taxableEntityId"].value;
    
    let selectedService =  this.retrievedServices.find((service) => service.id == taxableEntityId);
    console.log(selectedService);

    if(!!selectedService) {
      this.servicesForm.patchValue({
        taxableEntityName : selectedService.name,
        quantity: 1,
        rate: selectedService.rate,
        amount: selectedService.rate,        
        taxGroup: selectedService.taxClassId,
        taxGroupName: selectedService.taxClassName,
        totalAmountBeforeBillDiscount: selectedService.rate
      });
    }
  }

}
