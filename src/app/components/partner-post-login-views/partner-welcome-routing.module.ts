import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth.guard';
import { PartnerWelcomeComponent } from './partner-welcome/partner-welcome.component';
import { PartnerCustomersComponent } from './partner-customers/partner-customers.component';

const partnerRoutes: Routes = [
    {
        path: '', component: PartnerWelcomeComponent,
        children: [
            { path: '', component: PartnerCustomersComponent },
             { path: 'customers', component: PartnerCustomersComponent }            
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(partnerRoutes)],
    exports: [RouterModule]
})
export class PartnerWelcomeRoutingModule { }