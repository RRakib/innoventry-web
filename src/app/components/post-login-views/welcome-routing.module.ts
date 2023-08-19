import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/services/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
    {
        path: '', component: WelcomeComponent,
        children: [
            { path: '', component: DashboardComponent },
            { 
                path: 'master',
                canActivate: [AuthGuard],
                loadChildren: () => import(`./master/masters.module`).then(
                  module => module.MastersModule
                )
            },
            { 
                path: 'transaction',
                canActivate: [AuthGuard],
                loadChildren: () => import(`./transaction/transaction.module`).then(
                  module => module.TransactionModule
                )
            },
            { 
                path: 'report',
                canActivate: [AuthGuard],
                loadChildren: () => import(`./reports/reports.module`).then(
                  module => module.ReportsModule
                )
            },
            { 
                path: 'user',
                canActivate: [AuthGuard],
                loadChildren: () => import(`./user/user.module`).then(
                  module => module.UserModule
                )
            }
        ]
    }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WelcomeRoutingModule { }