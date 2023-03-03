import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

import { BusinessPlanFeatures } from 'src/app/components/post-login-views/user/user-business-plan/BusinessPlanFeatures';
import { CompanyPlanServiceService, PCompanyPlanInfo } from 'src/server';

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

  private basicPlanDetails = BusinessPlanFeatures.BasicPlanFeatures;
  private personalPlanDetails = BusinessPlanFeatures.PersonalPlanFeatures;
  private standardPlanDetails = BusinessPlanFeatures.StandardPlanFeatures;
  private premiumPlanDetails = BusinessPlanFeatures.PremiumPlanFeatures;

  public companyPlanInfo : PCompanyPlanInfo;
  public editionCount : number;

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Basic', cols: 4, rows: 2, price: this.basicPlanDetails.PlanPrice, features: this.basicPlanDetails.Features },
          { title: 'Personal', cols: 4, rows: 2, price: this.personalPlanDetails.PlanPrice, features: this.personalPlanDetails.Features },
          { title: 'Standard', cols: 4, rows: 2, price: this.standardPlanDetails.PlanPrice, features: this.standardPlanDetails.Features },
          { title: 'Premium', cols: 4, rows: 2, price: this.premiumPlanDetails.PlanPrice, features: this.premiumPlanDetails.Features }
        ];
      }

      return [
        // { title: 'Basic', cols: 1, rows: 2, price: this.basicPlanDetails.PlanPrice, features: this.basicPlanDetails.Features },
        { title: 'Personal', cols: 1, rows: 2, price: this.personalPlanDetails.PlanPrice, features: this.personalPlanDetails.Features },
        { title: 'Standard', cols: 1, rows: 2, price: this.standardPlanDetails.PlanPrice, features: this.standardPlanDetails.Features },
        { title: 'Premium', cols: 1, rows: 2, price: this.premiumPlanDetails.PlanPrice, features: this.premiumPlanDetails.Features }
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver, private companyPlanService :  CompanyPlanServiceService) { }

  ngOnInit(): void {
    this.companyPlanService.getCompanyPlanInfo().subscribe({
      next: (data) => {
        this.companyPlanInfo = data;
        this.editionCount = !!this.companyPlanInfo.editions ? this.companyPlanInfo.editions.length: 0;
      }
    });
  }

}
