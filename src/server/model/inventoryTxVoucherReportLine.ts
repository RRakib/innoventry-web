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
import { TransactionInfo } from './transactionInfo';

export interface InventoryTxVoucherReportLine { 
    itemId?: number;
    itemName?: string;
    stockIn?: number;
    stockOut?: number;
    unitName?: string;
    description?: string;
    rate?: number;
    amount?: number;
    primaryStockIn?: number;
    primaryStockOut?: number;
    transaction?: TransactionInfo;
    primaryUnit?: string;
}