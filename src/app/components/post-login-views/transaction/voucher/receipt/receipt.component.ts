import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { OverlayService } from 'src/app/services/overlay.service';
import {  IReceiptTx } from 'src/server';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';
import { PaymentTxServiceService } from 'src/server/api/paymentTxService.service';
import { ReceiptTxServiceService } from 'src/server/api/receiptTxService.service';
import { VoucherNumberServiceService } from 'src/server/api/voucherNumberService.service';
import { VoucherComponent } from '../voucher.component';

@Component({
    selector: 'app-payment-transaction',
    templateUrl: '../voucher.component.html',
    styleUrls: ['../voucher.component.css']
})
export class ReceiptComponent extends VoucherComponent implements OnInit {
   
    receiptTx: IReceiptTx;

    constructor(private receiptBreakpointObserver: BreakpointObserver,private route: ActivatedRoute,  private receiptOverlayService : OverlayService, private receiptFormBuilder: FormBuilder,
        private voucherNumberService: VoucherNumberServiceService,  private paymentService: PaymentTxServiceService, 
        private receiptService: ReceiptTxServiceService, private  receiptLedgerService : LedgerServiceService,
        private receiptDateAdapterService  : CustomDateAdapterService,
        @Inject(MAT_DIALOG_DATA) public data: { txId: number },
        public receiptDialogRef: MatDialogRef<ReceiptComponent>) {
        super(receiptBreakpointObserver,receiptOverlayService,  receiptFormBuilder, "ReceiptTxImpl", paymentService, receiptService, receiptLedgerService,receiptDateAdapterService, receiptDialogRef);
        this.headerTitle = "Receipt";
    }

    ngOnInit(): void {
        this.receiptTx = {};
        
        if (!!this.data.txId) {
            this.receiptService.findById(this.data.txId).subscribe({
                next: (data) => {                
                //Initialize voucher form with the returned data
                this.initializeVocherFormInEditCase(undefined, data);
                },
                error: () =>{}
            });
        }else {
            this.initializeNewVoucherForm();               
        }        
    }

    public getNextVoucherNumber(): void {
        let voucherClass = "in.solpro.nucleus.accounting.model.IReceiptTx";
        let voucherSubType = 0;

        this.voucherNumberService.getNextVoucherNumber(new Date().toISOString(), voucherClass, voucherSubType).subscribe({
            next: (data) => {
                this.voucherForm.patchValue({
                    vouchernumber: data.voucherNumber,
                    amount: this.receiptTx.totalDebit
                });
                this.isFormLoaded = true;
            },
            error: () => { }
        });
    }

    
}
