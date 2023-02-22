export interface InventoryTxReportGridLine{
    id?: string;
    parent? : string;
    txDate? : Date;
    ledger? : string;   
    gstin? : string;
    voucherNo? : number;
    particulars? : string;
    hsn? : string;
    quantity? : string;
    unit? : string;
    rate? : string;
    amount? : string;
    gstRate? : string;
    cgst? : string;
    sgst? : string;
    igst? : string;
    cess? : string;
    netAmountWithTax? : string;
    roundAmount? : number;
    billAmount? : number;
}