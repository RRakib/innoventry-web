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
import { IItemLine } from './iItemLine';
import { ILedgerDetailLine } from './iLedgerDetailLine';
import { IOpeningStockTx } from './iOpeningStockTx';
import { IStockDetailLine } from './iStockDetailLine';
import { ReferenceTxInfo } from './referenceTxInfo';
import { ResourceProxy } from './resourceProxy';
import { TransactionInfo } from './transactionInfo';

export interface OpeningStockTxImpl extends IOpeningStockTx { 
    transaction?: TransactionInfo;
}