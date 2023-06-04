import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
import { AuthGuard } from 'src/app/services/auth.guard';

import { CommonUtils } from 'src/app/shared/utils/commonUtils';
import { PartnerWelcomeRoutingModule } from './partner-welcome-routing.module';
import { PartnerWelcomeComponent } from './partner-welcome/partner-welcome.component';
import { PartnerCustomersComponent } from './partner-customers/partner-customers.component';
import { PartnerMenuListItemComponent } from './partner-menu-list-item/partner-menu-list-item.component';
import { PartnerItemLicenseReportServiceService } from 'src/server';

@NgModule({
  declarations: [
    PartnerWelcomeComponent, PartnerCustomersComponent, PartnerMenuListItemComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    PartnerWelcomeRoutingModule
  ],
  providers: [
    AuthGuard,
    CommonUtils,
    PartnerItemLicenseReportServiceService
  ],
  bootstrap: []
})
export class PartnerWelcomeModule { }
