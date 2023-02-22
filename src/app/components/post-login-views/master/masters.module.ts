import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MasterBaseViewComponent } from './master-base-view/master-base-view.component';
import { AllItemsComponent } from './items/all-items/all-items.component';
import { MastersRoutingModule } from './masters-routing.module';
import { ItemServiceService } from 'src/server/api/itemService.service';
import { MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { UnitServiceService } from 'src/server/api/unitService.service';
import { ItemGroupServiceService } from 'src/server/api/itemGroupService.service';
import { LedgerGroupServiceService } from 'src/server/api/ledgerGroupService.service';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';
import { TaxClassServiceService } from 'src/server/api/taxClassService.service';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
import { ItemGroupsComponent } from './item-groups/item-groups.component';
import { NewEditItemGroupComponent } from './item-groups/new-edit-item-group/new-edit-item-group.component';
import { NewItemComponent } from './items/new-item/new-item.component';
import { AllAttributesComponent } from './attributes/all-attributes/all-attributes.component';
import { AttributeServiceService } from 'src/server/api/attributeService.service';
import { NewEditAttributeComponent } from './attributes/new-edit-attribute/new-edit-attribute.component';
import { ChoiceListServiceService } from 'src/server/api/choiceListService.service';
import { AllAttributeGroupsComponent } from './attribute-groups/all-attribute-groups/all-attribute-groups.component';
import { AttributeGroupServiceService } from 'src/server/api/attributeGroupService.service';
import { NewEditAttributeGroupComponent } from './attribute-groups/new-edit-attribute-group/new-edit-attribute-group.component';
import { ManufacturerServiceService } from 'src/server/api/manufacturerService.service';
import { AllManufacturerComponent } from './manufacturer/all-manufacturer/all-manufacturer.component';
import { NewEditManufacturerComponent } from './manufacturer/new-edit-manufacturer/new-edit-manufacturer.component';
import { AllServiceGroupsComponent } from './service-groups/all-service-groups/all-service-groups.component';
import { NewEditServiceGroupComponent } from './service-groups/new-edit-service-group/new-edit-service-group.component';
import { ServiceGroupServiceService } from 'src/server/api/serviceGroupService.service';
import { ServiceServiceService } from 'src/server/api/serviceService.service';
import { AllServicesComponent } from './services/all-services/all-services.component';
import { NewEditServiceComponent } from './services/new-edit-service/new-edit-service.component';
import { AllOtherChargesComponent } from './other-charges/all-other-charges/all-other-charges.component';
import { NewEditOtherChargesComponent } from './other-charges/new-edit-other-charges/new-edit-other-charges.component';
import { OtherChargesServiceService } from 'src/server/api/otherChargesService.service';
import { AllLedgersComponent } from './ledgers/all-ledgers/all-ledgers.component';
import { NewEditLedgerComponent } from './ledgers/new-edit-ledger/new-edit-ledger.component';
import { AreaServiceService } from 'src/server/api/areaService.service';
import { StateServiceService } from 'src/server/api/stateService.service';
import { AllChoiceListComponent } from './choice-list/all-choice-list/all-choice-list.component';
import { NewEditChoiceListComponent } from './choice-list/new-edit-choice-list/new-edit-choice-list.component';


export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 0,
  hideDelay: 0,
  touchendHideDelay: 0,
};

@NgModule({
  declarations: [
    MasterBaseViewComponent,
    AllItemsComponent, NewItemComponent, 
    ItemGroupsComponent, NewEditItemGroupComponent,
    AllAttributesComponent, NewEditAttributeComponent, 
    AllAttributeGroupsComponent, NewEditAttributeGroupComponent, AllManufacturerComponent,
    NewEditManufacturerComponent, AllServiceGroupsComponent, NewEditServiceGroupComponent, 
    AllServicesComponent, NewEditServiceComponent, AllOtherChargesComponent, 
    NewEditOtherChargesComponent, AllLedgersComponent, NewEditLedgerComponent,
    AllChoiceListComponent, NewEditChoiceListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MastersRoutingModule,
    SharedModule,
    AngularMaterialModule
  ],
  providers: [
    AreaServiceService,
    AttributeServiceService,
    AttributeGroupServiceService, 
    ChoiceListServiceService,
    ItemServiceService,
    UnitServiceService,
    ItemGroupServiceService,
    LedgerGroupServiceService,
    ManufacturerServiceService,
    OtherChargesServiceService,
    LedgerServiceService,
    ServiceGroupServiceService,
    ServiceServiceService,
    StateServiceService, 
    TaxClassServiceService,
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }
  ],
  bootstrap: []
})
export class MastersModule { }
