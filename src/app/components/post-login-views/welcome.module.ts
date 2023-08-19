import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from 'src/app/services/auth.guard';
import { SecurityManagerServiceService } from 'src/server/api/securityManagerService.service';
import { PermissionsProvider } from 'src/app/services/permissions.provider';

import { CommonUtils } from 'src/app/shared/utils/commonUtils';
import { EditReportService } from 'src/app/services/editReport.service';
import { CompanyPlanServiceService } from 'src/server';
import { SideNavigationComponent } from '../layouts/side-navigation/side-navigation.component';
import { TopNavbarComponent } from '../layouts/top-navbar/top-navbar.component';

@NgModule({
  declarations: [       
    WelcomeComponent,
    DashboardComponent,
    SideNavigationComponent,
    TopNavbarComponent 
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    WelcomeRoutingModule
  ],
  providers: [AuthGuard, SecurityManagerServiceService, PermissionsProvider, 
    CommonUtils,
    EditReportService,
    CompanyPlanServiceService],
  bootstrap: []
})
export class WelcomeModule { }
