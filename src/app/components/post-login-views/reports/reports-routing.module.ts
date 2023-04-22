import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { CashInHandComponent } from './cash-in-hand/cash-in-hand.component';
import { DayBookComponent } from './day-book/day-book.component';
import { DaywiseLedgerBalanceComponent } from './daywise-ledger-balance/daywise-ledger-balance.component';
import { DaywiseLedgerGroupBalanceComponent } from './daywise-ledger-group-balance/daywise-ledger-group-balance.component';
import { InactiveLedgersComponent } from './inactive-ledgers/inactive-ledgers.component';
import { ItemPurchaseRateAnalysisComponent } from './item-purchase-rate-analysis/item-purchase-rate-analysis.component';
import { ItemPurchaseRateVariationAnalysisComponent } from './item-purchase-rate-variation-analysis/item-purchase-rate-variation-analysis.component';
import { ItemRegisterComponent } from './item-register/item-register.component';
import { ItemSaleSummaryComponent } from './item-sale-summary/item-sale-summary.component';
import { ItemTxRegisterComponent } from './item-tx-register/item-tx-register.component';
import { LedgerBookComponent } from './ledger-book/ledger-book.component';
import { LedgerPurchaseSummaryComponent } from './ledger-purchase-summary/ledger-purchase-summary.component';
import { LedgerSaleSummaryComponent } from './ledger-sale-summary/ledger-sale-summary.component';
import { OutstandingsReportComponent } from './outstandings-report/outstandings-report.component';
import { OverstockReportComponent } from './overstock-report/overstock-report.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { PurchaseRegisterComponent } from './purchase-register/purchase-register.component';
import { ReportsBaseViewComponent } from './reports-base-view/reports-base-view.component';
import { SaleOrderReportComponent } from './sale-order-report/sale-order-report.component';
import { SaleRegisterComponent } from './sale-register/sale-register.component';
import { StockSummaryComponent } from './stock-summary/stock-summary.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';
import { UnderstockReportComponent } from './understock-report/understock-report.component';
import { ItemAttributeSearchComponent } from './item-reports/item-attribute-search/item-attribute-search.component';


const routes: Routes = [
    {
        path: '', component: ReportsBaseViewComponent,
        children: [
            { path: 'cashInHand', component: CashInHandComponent},
            { path: 'overStockReport', component: OverstockReportComponent},
            { path: 'underStockReport', component: UnderstockReportComponent },
            { path: 'dayBook', component: DayBookComponent},
            { path: 'ledgerBook', component: LedgerBookComponent},
            { path: 'balanceSheet', component: BalanceSheetComponent},
            { path: 'profitLoss', component : ProfitLossComponent },
            { path: 'saleRegister', component: SaleRegisterComponent},
            { path: 'purchaseRegister', component: PurchaseRegisterComponent},
            { path: 'itemRegister', component: ItemRegisterComponent},
            { path: 'itemTxRegister', component: ItemTxRegisterComponent},
            { path: 'itemPrRateAnalysis', component: ItemPurchaseRateAnalysisComponent },
            { path: 'itemPrRateVarAnalysis', component: ItemPurchaseRateVariationAnalysisComponent },
            { path: 'ledgerSaleSummary', component: LedgerSaleSummaryComponent},
            { path: 'ledgerPurchaseSummary', component: LedgerPurchaseSummaryComponent},
            { path: 'stockSummary', component: StockSummaryComponent},
            { path: 'saleOrderRegister', component: SaleOrderReportComponent},
            { path: 'trialBalance', component: TrialBalanceComponent},
            { path: 'outstandingsReport', component: OutstandingsReportComponent},
            { path: 'inactiveLedgers', component: InactiveLedgersComponent},
            { path: 'itemSaleSummary', component: ItemSaleSummaryComponent},
            { path: 'daywiseLedgerBalanceSummary', component: DaywiseLedgerBalanceComponent},
            { path: 'daywiseLedgerGroupBalanceSummary', component: DaywiseLedgerGroupBalanceComponent},

            /** Item Reports Routes */
            { path: 'itemAttributeSearchSummary', component: ItemAttributeSearchComponent}
        ]

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRoutingModule { }