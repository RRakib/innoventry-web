import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
import { UserBusinessPlanComponent } from './user-business-plan/user-business-plan.component';
import { UserRoutingModule } from './user-routing.module';
import { UserBaseViewComponent } from './user-base-view/user-base-view.component';


@NgModule({
    declarations: [
        UserBaseViewComponent,
        UserBusinessPlanComponent
    ],
    imports: [
        UserRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        SharedModule,
        AngularMaterialModule
    ],
    providers: [
    ],
    bootstrap: []
})
export class UserModule { }
