import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
import { AuthGuard } from 'src/app/services/auth.guard';

import { CommonUtils } from 'src/app/shared/utils/commonUtils';
import { PartnerWelcomeRoutingModule } from './partner-welcome-routing.module';
import { PartnerWelcomeComponent } from './partner-welcome/partner-welcome.component';
import { PartnerCustomersComponent } from './partner-customers/partner-customers.component';
import { PartnerMenuListItemComponent } from './partner-menu-list-item/partner-menu-list-item.component';
import { PartnerItemInfoServiceService, PartnerItemLicenseGenerationServiceService, PartnerItemLicenseReportServiceService } from 'src/server';
import { PartnerRenewLicenseComponent } from './partner-renew-license/partner-renew-license.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NavService } from 'src/app/services/nav.service';
import { PartnerNewLicenseComponent } from './partner-new-license/partner-new-license.component';

@NgModule({
  declarations: [
    PartnerWelcomeComponent, PartnerCustomersComponent, PartnerMenuListItemComponent, PartnerRenewLicenseComponent, PartnerNewLicenseComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    PartnerWelcomeRoutingModule
  ],
  providers: [
    AuthGuard,
    CommonUtils,
    NavService,
    PartnerItemLicenseReportServiceService,
    PartnerItemLicenseGenerationServiceService,
    PartnerItemInfoServiceService
  ],
  bootstrap: []
})
export class PartnerWelcomeModule { }
