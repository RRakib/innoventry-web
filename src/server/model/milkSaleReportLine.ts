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
import { MilkSaleReportDetailLine } from './milkSaleReportDetailLine';
import { TransactionInfo } from './transactionInfo';

export interface MilkSaleReportLine { 
    date?: Date;
    ledgerString?: string;
    voucherNo?: string;
    transaction?: TransactionInfo;
    detailLines?: Array<MilkSaleReportDetailLine>;
    totalBillAmt?: number;
}