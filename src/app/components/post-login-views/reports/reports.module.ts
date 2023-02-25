import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { ReportsRoutingModule } from './reports-routing.module';
import { CashInHandComponent } from './cash-in-hand/cash-in-hand.component';
import { ReportsBaseViewComponent } from './reports-base-view/reports-base-view.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OverstockReportComponent } from './overstock-report/overstock-report.component';
import { AttributeGroupServiceService, CashInHandReportServiceService, ChoiceListServiceService, ItemLineServiceService, PaymentModeServiceService, StockAttributeGroupLineServiceService, TaxConfigurationServiceService } from 'src/server';
import { DayBookComponent } from './day-book/day-book.component';
import { LedgerBookComponent } from './ledger-book/ledger-book.component';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AngularMaterialModule } from 'src/app/shared/modules/angular-material.module';
import { OverstockReportServiceService } from 'src/server/api/overstockReportService.service';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { BalanceSheetReportServiceService } from 'src/server/api/balanceSheetReportService.service';
import { DayBookServiceService } from 'src/server/api/dayBookService.service';
import { SaleRegisterComponent } from './sale-register/sale-register.component';
import { PurchaseRegisterComponent } from './purchase-register/purchase-register.component';
import { ItemRegisterComponent } from './item-register/item-register.component';

import { ItemServiceService } from 'src/server/api/itemService.service';
import { BillingClassificationServiceService } from 'src/server/api/billingClassificationService.service';
import { LedgerAttributesServiceService } from 'src/server/api/ledgerAttributesService.service';

import { InventoryTxReportServiceService } from 'src/server/api/inventoryTxReportService.service';
import { LedgerReportServiceService } from 'src/server/api/ledgerReportService.service';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { ProfitLossReportServiceService } from 'src/server/api/profitLossReportService.service';
import { UnderstockReportComponent } from './understock-report/understock-report.component';
import { ItemGroupServiceService } from 'src/server/api/itemGroupService.service';
import { UnderstockReportServiceService } from 'src/server/api/understockReportService.service';
import { ItemRegisterReportServiceService } from 'src/server/api/itemRegisterReportService.service';
import { LedgerPurchaseSummaryComponent } from './ledger-purchase-summary/ledger-purchase-summary.component';
import { LedgerSaleSummaryComponent } from './ledger-sale-summary/ledger-sale-summary.component';
import { LedgerSaleSummaryReportServiceService } from 'src/server/api/ledgerSaleSummaryReportService.service';
import { LedgerPurchaseSummaryReportServiceService } from 'src/server/api/ledgerPurchaseSummaryReportService.service';
import { StockSummaryComponent } from './stock-summary/stock-summary.component';
import { StockSummaryReportService2Service } from 'src/server/api/stockSummaryReportService2.service';
import { SaleOrderReportComponent } from './sale-order-report/sale-order-report.component';
import { OutstandingsReportComponent } from './outstandings-report/outstandings-report.component';
import { LedgerGroupServiceService } from 'src/server/api/ledgerGroupService.service';
import { CityServiceService } from 'src/server/api/cityService.service';
import { OutstandingReportServiceService } from 'src/server/api/outstandingReportService.service';
import { InactiveLedgersComponent } from './inactive-ledgers/inactive-ledgers.component';
import { InActiveLedgersReportServiceService } from 'src/server/api/inActiveLedgersReportService.service';
import { ItemSaleSummaryComponent } from './item-sale-summary/item-sale-summary.component';
import { ItemSaleSummaryReportServiceService } from 'src/server/api/itemSaleSummaryReportService.service';
import { DaywiseLedgerBalanceComponent } from './daywise-ledger-balance/daywise-ledger-balance.component';
import { DayWiseLedgerBalanceReportServiceService } from 'src/server/api/dayWiseLedgerBalanceReportService.service';
import { DaywiseLedgerGroupBalanceComponent } from './daywise-ledger-group-balance/daywise-ledger-group-balance.component';
import { DayWiseLedgerGroupBalanceReportServiceService } from 'src/server/api/dayWiseLedgerGroupBalanceReportService.service';
import { ItemTxRegisterComponent } from './item-tx-register/item-tx-register.component';
import { ItemTransactionRegisterReportServiceService } from 'src/server/api/itemTransactionRegisterReportService.service';
import { ItemPurchaseRateVariationAnalysisComponent } from './item-purchase-rate-variation-analysis/item-purchase-rate-variation-analysis.component';
import { ItemPurchaseRateVariationAnalysisReportServiceService } from 'src/server/api/itemPurchaseRateVariationAnalysisReportService.service';
import { ItemPurchaseRateAnalysisComponent } from './item-purchase-rate-analysis/item-purchase-rate-analysis.component';
import { ItemPurchaseRateAnalysisServiceService } from 'src/server/api/itemPurchaseRateAnalysisService.service';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';

@NgModule({
  declarations: [ 
    ReportsBaseViewComponent,    
    CashInHandComponent,
    OverstockReportComponent,
    DayBookComponent,
    LedgerBookComponent,
    BalanceSheetComponent,
    SaleRegisterComponent,
    PurchaseRegisterComponent,
    ItemRegisterComponent,
    ProfitLossComponent,
    UnderstockReportComponent,
    LedgerPurchaseSummaryComponent,
    LedgerSaleSummaryComponent,
    StockSummaryComponent,
    SaleOrderReportComponent,
    OutstandingsReportComponent,
    InactiveLedgersComponent,
    ItemSaleSummaryComponent,
    DaywiseLedgerBalanceComponent,
    DaywiseLedgerGroupBalanceComponent,
    ItemTxRegisterComponent,
    ItemPurchaseRateVariationAnalysisComponent,
    ItemPurchaseRateAnalysisComponent,
    TrialBalanceComponent    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,    
    ReportsRoutingModule,  
    FlexLayoutModule,
    SharedModule,
    AngularMaterialModule
    
  ],
  providers: [
    AttributeGroupServiceService,
    CashInHandReportServiceService,
    ChoiceListServiceService,
    CityServiceService,
    DayBookServiceService,
    LedgerServiceService,
    LedgerGroupServiceService,
    OverstockReportServiceService,
    BalanceSheetReportServiceService,    
    DayWiseLedgerBalanceReportServiceService,
    DayWiseLedgerGroupBalanceReportServiceService,
    InventoryTxReportServiceService, 
    ItemServiceService,
    ItemLineServiceService,
    InActiveLedgersReportServiceService,
    ItemSaleSummaryReportServiceService,
    ItemGroupServiceService,
    ItemRegisterReportServiceService,
    ItemTransactionRegisterReportServiceService,
    ItemPurchaseRateAnalysisServiceService,
    ItemPurchaseRateVariationAnalysisReportServiceService,
    BillingClassificationServiceService,
    LedgerAttributesServiceService,
    LedgerReportServiceService,
    PaymentModeServiceService,
    OutstandingReportServiceService,
    LedgerSaleSummaryReportServiceService,
    LedgerPurchaseSummaryReportServiceService,
    ProfitLossReportServiceService,
    UnderstockReportServiceService,
    StockSummaryReportService2Service,
    StockAttributeGroupLineServiceService,
    TaxConfigurationServiceService 
  ],
  bootstrap: []
})
export class ReportsModule { }
