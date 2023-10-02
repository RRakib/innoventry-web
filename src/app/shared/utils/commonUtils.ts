import { Injectable } from "@angular/core";
import { AbstractControl, ValidatorFn } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { JournalComponent } from "src/app/components/post-login-views/transaction/journal/journal.component";
import { InwardQuotationComponent } from "src/app/components/post-login-views/transaction/order/inward-quotation/inward-quotation.component";
import { PurchaseComponent } from "src/app/components/post-login-views/transaction/order/purchase/purchase.component";
import { QuotationComponent } from "src/app/components/post-login-views/transaction/order/quotation/quotation.component";
import { SaleOrderComponent } from "src/app/components/post-login-views/transaction/order/sale-order/sale-order.component";
import { SaleComponent } from "src/app/components/post-login-views/transaction/order/sale/sale.component";
import { PaymentComponent } from "src/app/components/post-login-views/transaction/voucher/payment/payment.component";
import { ReceiptComponent } from "src/app/components/post-login-views/transaction/voucher/receipt/receipt.component";
import { EditReportService } from "src/app/services/editReport.service";

@Injectable()
export class CommonUtils {

    constructor(public dialog: MatDialog, private editReportService : EditReportService, private router: Router) { }

    /**
     * 
     * @returns null : If valid control, 
     * Object : If InValid Control
    */
    forbiddenNamesValidator(items: any[]): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {

            // Provide Required Validator if it is Empty value
            if (items == undefined || control == undefined || control.value == undefined || control.value == '') {
                return null;
            }
            const filteredItems = items.filter((item) => item.name.includes(control.value));
            const sameItemName = items.find((item) => item.name == control.value);

            let matchedSelectedInput = filteredItems && sameItemName && filteredItems.length > 0 ? true : false;

            //return index < 0 ? { forbiddenNames: { value: control.value } } : null;
            return !matchedSelectedInput ? 
                { forbiddenNames: { value: 'Please select any option'} } 
                : null;
        };
    }

    /**
     * This function activates the typing validator on a control
     * @param activated : True/False
     * @returns 
     */
    typingValidator() : ValidatorFn{
        return (control: AbstractControl): { [key: string]: any } | null => {           
            return { forbiddenNames: { value: 'Please select any option'} } ;
        };
    }

    /**
     * This function edit the type of reports by opening a Mat Dialog box.
     */
    editReport(selectedTxType: string, selectedTxId: string) {  
        switch(selectedTxType) {
            case "Journal" :
              const JournalDialogRef = this.dialog.open(JournalComponent, { 
                panelClass: 'custom-dialog-container', 
                data : {
                  txId : selectedTxId
                } 
              });
      
              JournalDialogRef.afterClosed().subscribe(result => {                
                this.editReportService.changeStatus(true);
              });
              break;
            case "Payment" :        
              const PaymentDialogRef = this.dialog.open(PaymentComponent, { 
                panelClass: 'custom-dialog-container', 
                data : {
                  txId : selectedTxId
                } 
              });
              PaymentDialogRef.afterClosed().subscribe(result => {
                this.editReportService.changeStatus(true);
              });
              break;
            case "Receipt" :        
              const ReceiptDialogRef = this.dialog.open(ReceiptComponent, { 
                panelClass: 'custom-dialog-container', 
                data : {
                  txId : selectedTxId
                } 
              });
              ReceiptDialogRef.afterClosed().subscribe(result => {                
                this.editReportService.changeStatus(true);
              });
              break;
            case "Sale" :      
              const SaleDialogRef = this.dialog.open(SaleComponent, { 
                panelClass: 'custom-dialog-container', 
                data : {
                  txId : selectedTxId
                } 
              });
              SaleDialogRef.afterClosed().subscribe(result => {                
                this.editReportService.changeStatus(true);
              });
              break;
            case "Purchase" :      
              const PurchaseDialogRef = this.dialog.open(PurchaseComponent, { 
                panelClass: 'custom-dialog-container', 
                data : {
                  txId : selectedTxId
                } 
              });
              PurchaseDialogRef.afterClosed().subscribe(result => {                
                this.editReportService.changeStatus(true);
              });
              break;
            case "Inward Purchase Order" :      
              const IPODialogRef = this.dialog.open(SaleOrderComponent, { 
                panelClass: 'custom-dialog-container', 
                data : {
                  txId : selectedTxId
                } 
              });
              IPODialogRef.afterClosed().subscribe(result => {                
                this.editReportService.changeStatus(true);
              });
              break;
            case "Quotation" :      
              const QuotationDialogRef = this.dialog.open(QuotationComponent, { 
                panelClass: 'custom-dialog-container', 
                data : {
                  txId : selectedTxId
                } 
              });
              QuotationDialogRef.afterClosed().subscribe(result => {                
                this.editReportService.changeStatus(true);
              });
              break;
            case "Inward Quotation" :      
              const InwardQuotationDialogRef = this.dialog.open(InwardQuotationComponent, { 
                panelClass: 'custom-dialog-container', 
                data : {
                  txId : selectedTxId
                } 
              });
              InwardQuotationDialogRef.afterClosed().subscribe(result => {                
                this.editReportService.changeStatus(true);
              });
              break;
          }  
    }

    public openURL(url : string) : void {
      window.open(url, '_blank');
    }

    public navigateToURL(route : string) : void{
      this.router.navigate([route]);
    }
}