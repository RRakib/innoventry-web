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
import { ILedgerDetailLine } from './iLedgerDetailLine';
import { IServiceOrderTx } from './iServiceOrderTx';
import { ITaxableLine } from './iTaxableLine';
import { ReferenceTxInfo } from './referenceTxInfo';
import { ResourceProxy } from './resourceProxy';
import { TransactionInfo } from './transactionInfo';

export interface ServiceOrderTxImpl extends IServiceOrderTx { 
    importMode?: boolean;
    transaction?: TransactionInfo;
}