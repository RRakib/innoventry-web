import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemGroupsComponent } from './item-groups/item-groups.component';
import { NewEditItemGroupComponent } from './item-groups/new-edit-item-group/new-edit-item-group.component';
import { AllItemsComponent } from './items/all-items/all-items.component';
import { MasterBaseViewComponent } from './master-base-view/master-base-view.component';
import { NewItemComponent } from './items/new-item/new-item.component';
import { AllAttributesComponent } from './attributes/all-attributes/all-attributes.component';
import { NewEditAttributeComponent } from './attributes/new-edit-attribute/new-edit-attribute.component';
import { AllAttributeGroupsComponent } from './attribute-groups/all-attribute-groups/all-attribute-groups.component';
import { NewEditAttributeGroupComponent } from './attribute-groups/new-edit-attribute-group/new-edit-attribute-group.component';
import { AllManufacturerComponent } from './manufacturer/all-manufacturer/all-manufacturer.component';
import { NewEditManufacturerComponent } from './manufacturer/new-edit-manufacturer/new-edit-manufacturer.component';
import { AllServiceGroupsComponent } from './service-groups/all-service-groups/all-service-groups.component';
import { NewEditServiceGroupComponent } from './service-groups/new-edit-service-group/new-edit-service-group.component';
import { AllServicesComponent } from './services/all-services/all-services.component';
import { NewEditServiceComponent } from './services/new-edit-service/new-edit-service.component';
import { AllOtherChargesComponent } from './other-charges/all-other-charges/all-other-charges.component';
import { NewEditOtherChargesComponent } from './other-charges/new-edit-other-charges/new-edit-other-charges.component';
import { AllLedgersComponent } from './ledgers/all-ledgers/all-ledgers.component';
import { NewEditLedgerComponent } from './ledgers/new-edit-ledger/new-edit-ledger.component';
import { AllChoiceListComponent } from './choice-list/all-choice-list/all-choice-list.component';
import { NewEditChoiceListComponent } from './choice-list/new-edit-choice-list/new-edit-choice-list.component';

const routes: Routes = [
    {
        path: '', component: MasterBaseViewComponent,
        children: [
            { path: 'allItems', component: AllItemsComponent },
            { path: 'newItem', component: NewItemComponent },
            { path: 'editItem/:itemId', component: NewItemComponent },

            { path: 'allLedgers', component: AllLedgersComponent },
            { path: 'newLedger/:type', component: NewEditLedgerComponent },
            { path: 'editLedger/:ledgerId', component: NewEditLedgerComponent },

            { path: 'allItemGroups', component: ItemGroupsComponent },
            { path: 'newItemGroup', component: NewEditItemGroupComponent },
            { path: 'editItemGroup/:itemGroupId', component: NewEditItemGroupComponent },

            { path: 'allAttributes', component: AllAttributesComponent },
            { path: 'newAttribute', component: NewEditAttributeComponent },
            { path: 'editAttribute/:attributeId', component: NewEditAttributeComponent },

            { path: 'allAttributeGroups', component: AllAttributeGroupsComponent },
            { path: 'newAttributeGroup', component: NewEditAttributeGroupComponent },
            { path: 'editAttributeGroup/:attributeGroupId', component: NewEditAttributeGroupComponent },

            { path: 'allChoiceList', component: AllChoiceListComponent },
            { path: 'newChoiceList', component: NewEditChoiceListComponent },
            { path: 'editChoiceList/:choiceListId', component: NewEditChoiceListComponent },

            { path: 'allManufacturers', component: AllManufacturerComponent},
            { path: 'newManufacturer', component: NewEditManufacturerComponent},
            { path: 'editManufacturer/:manufacturerId', component: NewEditManufacturerComponent},         

            { path: 'allServiceGroups', component: AllServiceGroupsComponent},
            { path: 'newServiceGroup', component: NewEditServiceGroupComponent},
            { path: 'editServiceGroup/:serviceGroupId', component: NewEditServiceGroupComponent},

            { path: 'allServices', component: AllServicesComponent},
            { path: 'newService', component: NewEditServiceComponent},
            { path: 'editService/:serviceId', component: NewEditServiceComponent},

            { path: 'allOtherCharges', component: AllOtherChargesComponent},
            { path: 'newOtherCharge', component: NewEditOtherChargesComponent},
            { path: 'editOtherCharge/:chargesId', component: NewEditOtherChargesComponent}           
            
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MastersRoutingModule { }