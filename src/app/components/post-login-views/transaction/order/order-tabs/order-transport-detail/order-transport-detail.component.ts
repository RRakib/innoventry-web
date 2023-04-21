import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, map, shareReplay } from 'rxjs';
import { PState, PCity } from 'src/server';

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

  states: PState[] = [];
  cities: PCity[] = [];
  filteredCities : Observable<PCity[]>;

  constructor(private breakpointObserver: BreakpointObserver, private formBuilder : FormBuilder) {

   }

  ngOnInit(): void {
  }

}
