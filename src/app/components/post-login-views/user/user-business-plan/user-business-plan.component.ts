import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { OverlayService } from 'src/app/services/overlay.service';
import { environment } from 'src/environments/environment';

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


  public companyPlanInfo : PCompanyPlanInfo;
  public editionCount : number;

  isFormLoaded : boolean = false;

  constructor(private breakpointObserver: BreakpointObserver, private companyPlanService :  CompanyPlanServiceService,
    private overlayService : OverlayService) { }

  ngOnInit(): void {
    this.overlayService.enableProgressSpinner();

    this.companyPlanService.getCompanyPlanInfo().subscribe({
      next: (data) => {
        this.companyPlanInfo = data;
        this.editionCount = !!this.companyPlanInfo.editions ? this.companyPlanInfo.editions.length: 0;

        this.isFormLoaded = true;
        this.overlayService.disableProgressSpinner();
      }
    });
  }


  upgradePlan(productCode : string | undefined) : void{
    let upgradeURL = `${environment.upgradePlan}?company=${localStorage.getItem('companyId')}&plan=${productCode}`;
    window.open(upgradeURL, '_blank')?.focus();    
  }

}
