import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionBaseViewComponent } from './transaction-base-view/transaction-base-view.component';
import { ItemServiceService } from 'src/server/api/itemService.service';
import { LedgerAttributesServiceService } from 'src/server/api/ledgerAttributesService.service';
import { BillingClassificationServiceService } from 'src/server/api/billingClassificationService.service';
import { ConfigureItemStockAttributeComponent } from './order/modal-popup/configure-item-stock-attribute/configure-item-stock-attribute.component';
import { AreaServiceService, AttributeGroupServiceService, ChoiceListServiceService, InventoryTxReportServiceService, ItemLineServiceService, PaymentModeServiceService, ServiceServiceService, StockAttributeGroupLineServiceService, TaxConfigurationServiceService } from 'src/server';
import { SelectItemStockAttributeComponent } from './order/modal-popup/select-item-stock-attribute/select-item-stock-attribute.component';
import { OrderPaymentDetailComponent } from './order/modal-popup/order-payment-detail/order-payment-detail.component';
import { OrderServicesComponent } from './order/modal-popup/order-services/order-services.component';
import { OrderChargesDiscountsComponent } from './order/modal-popup/order-charges-discounts/order-charges-discounts.component';
import { ItemSelectionFormComponent } from './order/modal-popup/item-selection-form/item-selection-form.component';



@NgModule({
    declarations: [
        TransactionBaseViewComponent,        
        ConfigureItemStockAttributeComponent, SelectItemStockAttributeComponent, 
        OrderPaymentDetailComponent, OrderServicesComponent, 
        OrderChargesDiscountsComponent, ItemSelectionFormComponent        
    ],
    imports: [
      CommonModule,    
      FormsModule,
      ReactiveFormsModule,  
      FlexLayoutModule,      
      SharedModule,
      AngularMaterialModule,
      TransactionRoutingModule
    ],
    exports: [
      
    ],
    providers: [  
      AreaServiceService,
      InventoryTxReportServiceService,     
      ItemServiceService,
      ItemLineServiceService,
      AttributeGroupServiceService,
      ChoiceListServiceService,
      BillingClassificationServiceService,
      LedgerAttributesServiceService,
      PaymentModeServiceService,
      StockAttributeGroupLineServiceService,
      TaxConfigurationServiceService,
      ServiceServiceService
    ],
    bootstrap: []
  })
  export class TransactionModule { }