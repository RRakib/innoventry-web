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
import { IRepairServiceCenterDeliveryLine } from './iRepairServiceCenterDeliveryLine';
import { IRepairServiceCenterDeliveryTx } from './iRepairServiceCenterDeliveryTx';
import { ReferenceTxInfo } from './referenceTxInfo';
import { ResourceProxy } from './resourceProxy';
import { TransactionInfo } from './transactionInfo';

export interface RepairServiceCenterDeliveryTxImpl extends IRepairServiceCenterDeliveryTx { 
    transaction?: TransactionInfo;
}