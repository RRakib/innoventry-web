import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserBaseViewComponent } from './user-base-view/user-base-view.component';
import { UserBusinessPlanComponent } from './user-business-plan/user-business-plan.component';

const routes: Routes = [
    {
        path: '', component: UserBaseViewComponent,
        children: [
            { path: 'profile', component: UserBusinessPlanComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }