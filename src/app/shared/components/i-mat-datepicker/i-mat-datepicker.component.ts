import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, shareReplay } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';

@Component({
  selector: 'i-mat-datepicker',
  templateUrl: './i-mat-datepicker.component.html',
  styleUrls: ['./i-mat-datepicker.component.css']
})
export class IMatDatepickerComponent implements OnInit{

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  @Input("label")
  label : string = 'Date';

  @Input("dateFormControl")
  dateFormControl : FormControl;

  //Used internally to update the date form control.
  dateNgModel : Date;

  constructor(private breakpointObserver: BreakpointObserver, private customDateAdapterService : CustomDateAdapterService) { }

  ngOnInit(): void {    
    this.dateNgModel = new Date(this.dateFormControl.value);
  }

  /**
   * Called from template file whenever the value is updated.
   */
  getUTCDate(event : any){    
    if(this.dateNgModel != undefined && this.dateNgModel.getDate() != undefined 
      && this.dateNgModel.getFullYear() != undefined 
      && this.dateNgModel.getMonth() != undefined)
    {
      this.dateFormControl.setValue(this.customDateAdapterService.createDate(
        this.dateNgModel.getFullYear(),
        this.dateNgModel.getMonth(),
        this.dateNgModel.getDate())
      );
    }
  }
}
