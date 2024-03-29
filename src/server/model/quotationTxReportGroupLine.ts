/**
 * 
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { ITransactionStatus } from './iTransactionStatus';
import { InventoryTxReportGroupLine } from './inventoryTxReportGroupLine';
import { InventoryTxReportLine } from './inventoryTxReportLine';
import { TransactionInfo } from './transactionInfo';

export interface QuotationTxReportGroupLine { 
    status?: string;
    contact?: string;
    mobile?: string;
    alternateNo1?: string;
    alternateNo2?: string;
    txDate?: Date;
    particulars?: string;
    billAmount?: number;
    transaction?: TransactionInfo;
    voucherNo?: string;
    usageReportGroupLines?: Array<InventoryTxReportGroupLine>;
    transactionStatus?: ITransactionStatus;
    details?: string;
    inventoryTxReportLines?: Array<InventoryTxReportLine>;
}