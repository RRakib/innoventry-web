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
import { IQCStatusLine } from './iQCStatusLine';
import { IQCStatusTx } from './iQCStatusTx';
import { ReferenceTxInfo } from './referenceTxInfo';
import { ResourceProxy } from './resourceProxy';
import { TransactionInfo } from './transactionInfo';

export interface QCStatusTxImpl extends IQCStatusTx { 
    transaction?: TransactionInfo;
}