import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleRegisterComponent } from '../reports/sale-register/sale-register.component';
import { JournalComponent } from './journal/journal.component';
import { PurchaseComponent } from './order/purchase/purchase.component';
import { QuotationComponent } from './order/quotation/quotation.component';
import { SaleOrderComponent } from './order/sale-order/sale-order.component';
import { SaleComponent } from './order/sale/sale.component';
import { TransactionBaseViewComponent } from './transaction-base-view/transaction-base-view.component';
import { PaymentComponent } from './voucher/payment/payment.component';
import { ReceiptComponent } from './voucher/receipt/receipt.component';
import { InwardQuotationRegisterComponent } from '../reports/inventory-tx-register/inward-quotation-register/inward-quotation-register.component';
import { InwardQuotationComponent } from './order/inward-quotation/inward-quotation.component';
import { SaleReturnRegisterComponent } from '../reports/inventory-tx-register/sale-return-register/sale-return-register.component';
import { SaleReturnComponent } from './order/sale-return/sale-return.component';
import { PurchaseRegisterComponent } from '../reports/purchase-register/purchase-register.component';
import { PurchaseReturnRegisterComponent } from '../reports/inventory-tx-register/purchase-return-register/purchase-return-register.component';
import { PurchaseReturnComponent } from './order/purchase-return/purchase-return.component';


const routes: Routes = [
    {
        path: '', component: TransactionBaseViewComponent,
        children: [
            { path: 'newVoucher/Payment', component: PaymentComponent},
            { path: 'edit-payment/:paymentId', component: PaymentComponent},
            { path: 'newVoucher/Receipt', component: ReceiptComponent},
            { path: 'edit-receipt/:receiptId', component: ReceiptComponent},
            { path: 'journal', component: JournalComponent},
            { path: 'edit-journal/:journalId', component: JournalComponent},

            { path: 'sale', component: SaleRegisterComponent},
            { path: 'sale/new', component: SaleComponent},

            { path: 'saleReturn', component: SaleReturnRegisterComponent},
            { path: 'saleReturn/new', component: SaleReturnComponent},

            { path: 'purchase', component: PurchaseRegisterComponent},
            { path: 'purchase/new', component: PurchaseComponent},

            { path: 'purchaseReturn', component: PurchaseReturnRegisterComponent},
            { path: 'purchaseReturn/new', component: PurchaseReturnComponent},
            
            { path: 'newOrder/purchase', component: PurchaseComponent},
            { path: 'newOrder/saleOrder', component: SaleOrderComponent},
            { path: 'newOrder/quotation', component: QuotationComponent},
            { path: 'inwardQuotation', component: InwardQuotationRegisterComponent},
            { path: 'inwardQuotation/new', component: InwardQuotationComponent},
        ]
    },
    {
        path: 'editTx/:txType/:txId', component : TransactionBaseViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransactionRoutingModule { }
