import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, map, shareReplay, startWith } from 'rxjs';
import { PState, PCity, IContact, LedgerServiceService, DatabaseServiceService, AreaServiceService } from 'src/server';

@Component({
  selector: 'app-order-transport-detail',
  templateUrl: './order-transport-detail.component.html',
  styleUrls: ['./order-transport-detail.component.css']
})
export class OrderTransportDetailComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  states: string[] = [];
  cities: PCity[] = [];
  filteredCities : Observable<PCity[]>;

  @Input("orderTxForm")
  orderTxForm : FormGroup;

  constructor(private breakpointObserver: BreakpointObserver, private formBuilder : FormBuilder,
    private parentLedgerService : LedgerServiceService, private dataBaseService : DatabaseServiceService,    
    private areaService : AreaServiceService) {

   }

  ngOnInit(): void {

    console.log("from order transport detial component");
    if(!!this.orderTxForm) {
      this.dataBaseService.getStateList("INDIA").subscribe({
        next: (data) => {
          this.states = data;
          this.areaService.getCityList("INDIA", this.orderTxForm.controls["shippingAddressState"].value).subscribe({
            next: (data) => {
              this.cities = data;
              this.filteredCities = this.orderTxForm.controls["shippingAddressCity"].valueChanges.pipe(
                startWith(this.orderTxForm.controls["shippingAddressCity"].value), map(value => this._filterCities(value || '')));
            }
          });
        }
      });
  
      this.orderTxForm.controls["shippingAddressState"].valueChanges.subscribe({
        next: (data) =>{
          this.areaService.getCityList("INDIA", data).subscribe({
            next: (data) => {
              this.cities = data;
              this.filteredCities = this.orderTxForm.controls["shippingAddressCity"].valueChanges.pipe(
                startWith(this.orderTxForm.controls["shippingAddressCity"].value), map(value => this._filterCities(value || '')));
            }
          });
        }
      });
  
      this.parentLedgerService.getLedger(this.orderTxForm.controls["supervisorId"].value).subscribe({
        next: (data) => {
          if(!!data) {
            this.orderTxForm.patchValue({            
              supervisorName: data.name   
            })
          }     
        }
      });
    }    
  }

  getOrderFormControl(name: string) : FormControl{
    return this.orderTxForm.get(name) as FormControl;
  }

  //This will also executed in edit of any new added entry only.
  onTransporterSelectionChange(selectedContact : IContact) : void{   
    this.parentLedgerService.getLedger(selectedContact.id).subscribe({
      next: (data) => {
        if(!!data) {
          this.orderTxForm.patchValue({            
            transporter: data.name   
          })
        }     
      }
    });
  }

   //This will also executed in edit of any new added entry only.
   onSuperVisorSelectionChange(selectedContact : IContact) : void{   
    this.parentLedgerService.getLedger(selectedContact.id).subscribe({
      next: (data) => {
        if(!!data) {
          this.orderTxForm.patchValue({ 
            supervisorId: data.id,           
            supervisorName: data.name    
          })
        }     
      }
    });
  }

    /**
   * This function is executed when user enters any text for searching item groups.
   * The input element is bind with valueChanges event in function getItemGroups()
   * @param value User Input
   * @returns 
   */
    private _filterCities(value: string): PCity[] {

      //filter value will be null in new and actual value in edit mode.
      const filterValue = !!value ? value.toLowerCase() : '';
  
      if(filterValue.length == 0) {
        this.orderTxForm.patchValue({
          shippingAddressCity: ''
        });
      }
      return this.cities.filter(option => option.cityName!.toLowerCase().includes(filterValue));
    }

}
