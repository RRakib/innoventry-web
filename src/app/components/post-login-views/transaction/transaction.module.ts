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
import { AttributeGroupServiceService, ChoiceListServiceService, ItemLineServiceService, PaymentModeServiceService, ServiceServiceService, StockAttributeGroupLineServiceService, TaxConfigurationServiceService } from 'src/server';
import { SelectItemStockAttributeComponent } from './order/modal-popup/select-item-stock-attribute/select-item-stock-attribute.component';
import { OrderPaymentDetailComponent } from './order/modal-popup/order-payment-detail/order-payment-detail.component';


@NgModule({
    declarations: [
        TransactionBaseViewComponent,        
        ConfigureItemStockAttributeComponent, SelectItemStockAttributeComponent, OrderPaymentDetailComponent        
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
    providers: [       
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