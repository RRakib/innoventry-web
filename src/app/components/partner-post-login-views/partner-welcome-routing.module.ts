import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth.guard';
import { PartnerWelcomeComponent } from './partner-welcome/partner-welcome.component';
import { PartnerCustomersComponent } from './partner-customers/partner-customers.component';
import { PartnerRenewLicenseComponent } from './partner-renew-license/partner-renew-license.component';
import { PartnerNewLicenseComponent } from './partner-new-license/partner-new-license.component';

const partnerRoutes: Routes = [
    {
        path: '', component: PartnerWelcomeComponent,
        children: [
            { path: '', component: PartnerCustomersComponent },
             { path: 'customers', component: PartnerCustomersComponent },
            //  { path: 'renewLicense', component: PartnerRenewLicenseComponent} ,
             { path: 'newLicense', component: PartnerNewLicenseComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(partnerRoutes)],
    exports: [RouterModule]
})
export class PartnerWelcomeRoutingModule { }