import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, map, shareReplay } from 'rxjs';
import { AreaServiceService, DatabaseServiceService, ITerms, PCity, TermsServiceService } from 'src/server';

@Component({
  selector: 'app-order-description',
  templateUrl: './order-description.component.html',
  styleUrls: ['./order-description.component.css']
})
export class OrderDescriptionComponent implements OnInit {

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

  availableTerms : ITerms[];
  
  constructor(private breakpointObserver: BreakpointObserver, private formBuilder : FormBuilder,
    private termsService : TermsServiceService, private dataBaseService : DatabaseServiceService,    
    private areaService : AreaServiceService) { }

  ngOnInit(): void {
    this.termsService.getObjects().subscribe({
      next:(data) => {
        this.availableTerms = data;
      }
    });
  }

}
