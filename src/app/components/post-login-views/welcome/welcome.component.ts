import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Router } from '@angular/router';
import { NavItem } from 'src/app/models/NavItem';


import { NavService } from 'src/app/services/nav.service';
import { MatSidenav } from '@angular/material/sidenav';

import { CommonUtils } from 'src/app/shared/utils/commonUtils';
import { environment } from 'src/environments/environment';
import { CompanyPlanServiceService, PCompanyPlanInfo } from 'src/server';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit{

  topNavItems : NavItem[];
  private topMenu : NavItem[];

  public companyPlanInfo : PCompanyPlanInfo = {};

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, 
    public navService: NavService,
    private commonUtils : CommonUtils,
    private companyPlanService :  CompanyPlanServiceService) {
    
   }
  ngOnInit(): void {
    this.companyPlanService.getCompanyPlanInfo().subscribe({
      next: (data) => {
        this.companyPlanInfo = data;       
      }
    });
  }


  returnToHome() : void{    
    this.router.navigate(['/main']);
  }

  public openOldVersion() : void {
    this.commonUtils.openURL(environment.webappUrl);
  }

  logout() : void{
    localStorage.removeItem('authToken');
    localStorage.removeItem('companyId');
    localStorage.removeItem('userName');

    this.router.navigate(['/login']);    
  }

}
