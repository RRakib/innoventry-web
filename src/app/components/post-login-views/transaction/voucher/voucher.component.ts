import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { map, Observable, shareReplay } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { OverlayService } from 'src/app/services/overlay.service';
import { ILedgerDetailLine, IPaymentTx, IReceiptTx, PLedgerMaster } from 'src/server';
import { LedgerServiceService } from 'src/server/api/ledgerService.service';
import { PaymentTxServiceService } from 'src/server/api/paymentTxService.service';
import { ReceiptTxServiceService } from 'src/server/api/receiptTxService.service';

export abstract class VoucherComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  headerTitle: string;

  public voucherForm!: FormGroup;
  isFormLoaded: boolean = false;
  filterLedgersByGroupNames: string[];

  constructor(private breakpointObserver: BreakpointObserver, private overlayService: OverlayService, private formBuilder: FormBuilder,
    @Inject(String) private jacksonType: String, private paymentTxService: PaymentTxServiceService,
    private receiptTxService: ReceiptTxServiceService, private ledgerService: LedgerServiceService,
    private customDateAdapterService  : CustomDateAdapterService, public dialogRef: MatDialogRef<VoucherComponent>) {
    this.headerTitle = "";    

    this.filterLedgersByGroupNames = ["Cash-in-hand", "Bank Accounts", "Bank OD A/c", "Bank OCC A/c"];
  }

  /**
   * This function is used to create new voucher form
   */
  initializeNewVoucherForm(): void {

    this.overlayService.enableProgressSpinner();

    //To fetch the cash ledger as a default ***by ledger***
    this.ledgerService.getCashLedger().subscribe({
      next: (data) => {

        this.voucherForm = this.formBuilder.group({
          jacksontype: [this.jacksonType],
          id: new FormControl(null),
          fromLedgerName: new FormControl('', [Validators.required]), //Default From Ledger is none.
          byLedgerName: new FormControl(data.name, [Validators.required]), //Default By Ledger is Cash
          transactiondate: new FormControl(this.customDateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
          vouchernumber: new FormControl({ value: "", disabled: true }, [Validators.required]),
          referenceNo: new FormControl(''),
          description: new FormControl(''),
          amount: new FormControl('', [Validators.required]),
          fromLedgerDetailLine: this.formBuilder.group({
            jacksontype: ["LedgerDetailLineImpl"],
            ledgerId: new FormControl(''),
            ledgerName: new FormControl(''),
            credit: new FormControl('')
          }),
          byLedgerDetailLine: this.formBuilder.group({
            jacksontype: ["LedgerDetailLineImpl"],
            ledgerId: new FormControl(data.id),
            ledgerName: new FormControl(data.name),
            debit: new FormControl('')
          })
        });
        
        this.getNextVoucherNumber();
        
        this.formControlValueChangeSubscriptions();

        this.overlayService.disableProgressSpinner();
      },
      error: () => { this.overlayService.disableProgressSpinner(); }
    });

  }

  /**
   * This function is used in voucher edit case.
   */
  initializeVocherFormInEditCase(paymentTx? : IPaymentTx, receiptTx? : IReceiptTx) : void {

    this.overlayService.enableProgressSpinner();

    if(paymentTx != undefined) {

      this.voucherForm = this.formBuilder.group({
        jacksontype: [this.jacksonType],
        id: new FormControl(paymentTx.id),
        fromLedgerName: new FormControl('', [Validators.required]),
        byLedgerName: new FormControl('', [Validators.required]),
        transactiondate: new FormControl(paymentTx.transactiondate ?  paymentTx.transactiondate: new Date()),
        vouchernumber: new FormControl({ value: paymentTx.vouchernumber, disabled: true }, [Validators.required]),
        referenceNo: new FormControl(paymentTx.referenceNo),
        description: new FormControl(paymentTx.description),
        amount: new FormControl('', [Validators.required]),
        fromLedgerDetailLine: this.formBuilder.group({
          jacksontype: ["LedgerDetailLineImpl"],
          ledgerId: new FormControl(''),
          ledgerName: new FormControl(''),
          credit: new FormControl('')
        }),
        byLedgerDetailLine: this.formBuilder.group({
          jacksontype: ["LedgerDetailLineImpl"],
          ledgerId: new FormControl(''),
          ledgerName: new FormControl(''),
          debit: new FormControl('')
        })
      });

      let ledgerDetailLines  = paymentTx.ledgerDetailLines;
      this.updateLedgerDetailLinesInEdit(ledgerDetailLines);
      this.formControlValueChangeSubscriptions();
      this.isFormLoaded = true;

    }else if(receiptTx != undefined) {    
     
      this.voucherForm = this.formBuilder.group({
        jacksontype: [this.jacksonType],
        id: new FormControl(receiptTx.id),
        fromLedgerName: new FormControl('', [Validators.required]),
        byLedgerName: new FormControl('', [Validators.required]),
        transactiondate: new FormControl(receiptTx.transactiondate ? receiptTx.transactiondate : new Date()),
        vouchernumber: new FormControl({ value: receiptTx.vouchernumber, disabled: true }, [Validators.required]),
        referenceNo: new FormControl(receiptTx.referenceNo),
        description: new FormControl(receiptTx.description),
        amount: new FormControl('', [Validators.required]),
        fromLedgerDetailLine: this.formBuilder.group({
          jacksontype: ["LedgerDetailLineImpl"],
          ledgerId: new FormControl(''),
          ledgerName: new FormControl(''),
          credit: new FormControl('')
        }),
        byLedgerDetailLine: this.formBuilder.group({
          jacksontype: ["LedgerDetailLineImpl"],
          ledgerId: new FormControl(''),
          ledgerName: new FormControl(''),
          debit: new FormControl('')
        })
      });
      let ledgerDetailLines  = receiptTx.ledgerDetailLines;
      
      this.updateLedgerDetailLinesInEdit(ledgerDetailLines);
      this.formControlValueChangeSubscriptions();
      this.isFormLoaded = true;
    }
    
    this.overlayService.disableProgressSpinner();
  }

  private updateLedgerDetailLinesInEdit(ledgerDetailLines: ILedgerDetailLine[] | undefined) {

    if (ledgerDetailLines && ledgerDetailLines.length > 0) {

      let fromLedgerDetailLine = ledgerDetailLines[0];
      let byLedgerDetailLine = ledgerDetailLines[1];

      this.voucherForm.patchValue({
        fromLedgerName : fromLedgerDetailLine.ledgerName,
        byLedgerName : byLedgerDetailLine.ledgerName,
        amount: fromLedgerDetailLine.credit != 0 ? fromLedgerDetailLine.credit : byLedgerDetailLine.debit
      });

      this.voucherForm.controls["fromLedgerDetailLine"].patchValue({
        ledgerId: fromLedgerDetailLine.ledgerId,
        ledgerName: fromLedgerDetailLine.ledgerName,
        credit: fromLedgerDetailLine.credit
      });

      this.voucherForm.controls["byLedgerDetailLine"].patchValue({
        ledgerId: byLedgerDetailLine.ledgerId,
        ledgerName: byLedgerDetailLine.ledgerName,
        debit: byLedgerDetailLine.debit
      });

    }
  }

  
  private formControlValueChangeSubscriptions() {
    this.voucherForm.controls["amount"].valueChanges.subscribe({
      next: (data) => {
        this.voucherForm.controls["fromLedgerDetailLine"].patchValue({
          credit: data
        });
        this.voucherForm.controls["byLedgerDetailLine"].patchValue({
          debit: data
        });
      }
    });
  }

  onFromLedgerSelection(selectedLedger: PLedgerMaster) {
    this.voucherForm.controls["fromLedgerDetailLine"].patchValue({
      ledgerId: selectedLedger.id,
      ledgerName: selectedLedger.name
    });
  }

  onByLedgerSelection(selectedLedger: PLedgerMaster) {
    this.voucherForm.controls["byLedgerDetailLine"].patchValue({
      ledgerId: selectedLedger.id,
      ledgerName: selectedLedger.name
    });
  }

  public saveVoucher(): void {
    if (this.voucherForm.valid) {

      let ledgerDetailsLines: ILedgerDetailLine[] = [];
      ledgerDetailsLines.push(this.voucherForm.controls["fromLedgerDetailLine"].value);
      ledgerDetailsLines.push(this.voucherForm.controls["byLedgerDetailLine"].value);

      let voucherForSave = this.formBuilder.group({
        jacksontype: this.voucherForm.controls["jacksontype"].value,
        id: this.voucherForm.controls["id"].value,
        transactiondate: this.voucherForm.controls["transactiondate"].value,
        vouchernumber: this.voucherForm.controls["vouchernumber"].value,
        referenceNo: this.voucherForm.controls["referenceNo"].value,
        description: this.voucherForm.controls["description"].value,
        ledgerDetailLines: [
          ledgerDetailsLines
        ]
      });

      if (this.jacksonType == "PaymentTxImpl") {

        this.overlayService.enableProgressSpinner();

        if(voucherForSave.controls["id"].value == null){

          this.paymentTxService.save(voucherForSave.value).subscribe({
            next: (data) => {
              this.initializeNewVoucherForm();
              this.overlayService.disableProgressSpinner();
            },
            error: () => { this.overlayService.disableProgressSpinner(); }
          });
        }else {

          this.paymentTxService.update(voucherForSave.value).subscribe({
            next: (data) => {    
              this.overlayService.disableProgressSpinner();         
              this.dialogRef.close();              
            },
            error: () => { this.overlayService.disableProgressSpinner(); }
          });
        }
       
      } else if (this.jacksonType = "ReceiptTxImpl") {

        this.overlayService.enableProgressSpinner();

        if(voucherForSave.controls["id"].value ==null){

          this.receiptTxService.save(voucherForSave.value).subscribe({
            next: (data) => {
              this.initializeNewVoucherForm();
              this.overlayService.disableProgressSpinner();
            },
            error: () => { this.overlayService.disableProgressSpinner(); }
          });

        }else{

          this.receiptTxService.update(voucherForSave.value).subscribe({
            next: (data) => {
              this.overlayService.disableProgressSpinner();
              this.dialogRef.close();
            },
            error: () => { this.overlayService.disableProgressSpinner(); }
          });
        }
        
      }

    }
  }

  public abstract getNextVoucherNumber() : void;

}


