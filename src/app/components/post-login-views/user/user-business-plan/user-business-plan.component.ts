import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-user-business-plan',
  templateUrl: './user-business-plan.component.html',
  styleUrls: ['./user-business-plan.component.scss']
})
export class UserBusinessPlanComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Basic', cols: 4, rows: 2 },
        { title: 'Personal', cols: 4, rows: 2 },
        { title: 'Standard', cols: 4, rows: 2 },
        { title: 'Premium', cols: 4, rows: 2 }

          // { title: 'Basic', cols: 2, rows: 1 },
          // { title: 'Personal', cols: 2, rows: 1 },
          // { title: 'Standard', cols: 2, rows: 1 },
          // { title: 'Premium', cols: 2, rows: 1 }
        ];
      }

      return [
        { title: 'Basic', cols: 1, rows: 2 },
        { title: 'Personal', cols: 1, rows: 2 },
        { title: 'Standard', cols: 1, rows: 2 },
        { title: 'Premium', cols: 1, rows: 2 }
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
  }

}
