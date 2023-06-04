import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerComponent } from '../components/progress-spinner/progress-spinner.component';
import { LedgerBoxComponent } from '../components/ledger-box/ledger-box.component';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';
import { AngularMaterialModule } from './angular-material.module';
import { ITreeTableComponent } from '../components/i-tree-table/i-tree-table.component';
import { AngularTreeGridModule } from 'angular-tree-grid';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { IMatDatepickerComponent } from '../components/i-mat-datepicker/i-mat-datepicker.component';
import { ItemBoxComponent } from '../components/item-box/item-box.component';
import { TaxGroupBoxComponent } from '../components/tax-group-box/tax-group-box.component';
import { FormControlPipe } from '../pipes/form-control.pipe';
import { AppOverlayModule } from './overlay.module';
import { ContactBoxComponent } from '../components/contact-box/contact-box.component';
import { ContactServiceService } from 'src/server/api/contactService.service';
import { AutoSelectOption } from '../directives/auto-select-option';
import { CommonUtils } from 'src/app/shared/utils/commonUtils';
import { EditReportService } from 'src/app/services/editReport.service';
import { PaymentComponent } from 'src/app/components/post-login-views/transaction/voucher/payment/payment.component';
import { ReceiptComponent } from 'src/app/components/post-login-views/transaction/voucher/receipt/receipt.component';
import { JournalComponent } from 'src/app/components/post-login-views/transaction/journal/journal.component';
import { SaleComponent } from 'src/app/components/post-login-views/transaction/order/sale/sale.component';
import { PurchaseComponent } from 'src/app/components/post-login-views/transaction/order/purchase/purchase.component';
import { SaleOrderComponent } from 'src/app/components/post-login-views/transaction/order/sale-order/sale-order.component';
import { QuotationComponent } from 'src/app/components/post-login-views/transaction/order/quotation/quotation.component';
import { VoucherNumberServiceService } from 'src/server/api/voucherNumberService.service';
import { ReceiptTxServiceService } from 'src/server/api/receiptTxService.service';
import { PaymentTxServiceService } from 'src/server/api/paymentTxService.service';
import { JournalTxServiceService } from 'src/server/api/journalTxService.service';
import { SaleOrderTxServiceService } from 'src/server/api/saleOrderTxService.service';
import { PurchaseOrderTxServiceService } from 'src/server/api/purchaseOrderTxService.service';
import { POTxServiceService } from 'src/server/api/pOTxService.service';
import { QuotationTxServiceService } from 'src/server/api/quotationTxService.service';
import { TaxClassServiceService } from 'src/server/api/taxClassService.service';
import { TaxGroupServiceService } from 'src/server/api/taxGroupService.service';
import { TaxableEntityServiceService } from 'src/server/api/taxableEntityService.service';
import { TransactionsProvider } from 'src/app/services/transactionsProvider';
import { StockLocationServiceService } from 'src/server/api/stockLocationService.service';
import { OtherChargesServiceService } from 'src/server/api/otherChargesService.service';
import { DownloadService } from 'src/app/services/download.service';
import { OrderTransportDetailComponent } from "src/app/components/post-login-views/transaction/order/order-tabs/order-transport-detail/order-transport-detail.component";
import { OrderDescriptionComponent } from 'src/app/components/post-login-views/transaction/order/order-tabs/order-description/order-description.component';
import { TermsServiceService } from 'src/server';
import { IAutocompleteBoxComponent } from '../components/i-autocomplete-box/i-autocomplete-box.component';

@NgModule({
    declarations: [       
        ProgressSpinnerComponent,
        FormControlPipe,
        ContactBoxComponent,
        LedgerBoxComponent,
        ItemBoxComponent,
        TaxGroupBoxComponent,
        ITreeTableComponent,
        IMatDatepickerComponent,
        AutoSelectOption,
        IAutocompleteBoxComponent,

        // Adding Component from Transaction Module which are required to Edit in Reports
        PaymentComponent,
        ReceiptComponent,        
        JournalComponent,        
        SaleComponent,
        PurchaseComponent,   
        SaleOrderComponent, 
        QuotationComponent,
        OrderTransportDetailComponent,
        OrderDescriptionComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        AngularTreeGridModule,
        AppOverlayModule
    ],
    exports: [     
        ProgressSpinnerComponent,
        FormControlPipe,
        ContactBoxComponent,
        LedgerBoxComponent,
        ItemBoxComponent,
        TaxGroupBoxComponent,
        ITreeTableComponent,
        IMatDatepickerComponent,
        AutoSelectOption
    ],
    providers: [
        ContactServiceService,
        DownloadService,
        LedgerServiceService,
        CustomDateAdapterService,
        DatePipe,
        CommonUtils,
        EditReportService,
        VoucherNumberServiceService,   
        ReceiptTxServiceService,
        PaymentTxServiceService,
        JournalTxServiceService,
        SaleOrderTxServiceService,
        PurchaseOrderTxServiceService,
        POTxServiceService,
        QuotationTxServiceService,
        TaxClassServiceService,
        TaxGroupServiceService,
        TaxableEntityServiceService,
        TermsServiceService,
        TransactionsProvider,
        StockLocationServiceService,
        OtherChargesServiceService    
    ]
})
export class SharedModule { }