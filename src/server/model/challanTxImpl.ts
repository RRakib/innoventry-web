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
import { IAttributeGroupLine } from './iAttributeGroupLine';
import { IChallanTx } from './iChallanTx';
import { IDeliveryOrderLine } from './iDeliveryOrderLine';
import { IDocument } from './iDocument';
import { IItemLine } from './iItemLine';
import { ILedger } from './iLedger';
import { ILedgerDetailLine } from './iLedgerDetailLine';
import { IOtherChargesLine } from './iOtherChargesLine';
import { IPaymentLine } from './iPaymentLine';
import { ISaleOrderTx } from './iSaleOrderTx';
import { IStockDetailLine } from './iStockDetailLine';
import { ITaxableLine } from './iTaxableLine';
import { ReferenceTxInfo } from './referenceTxInfo';
import { ResourceProxy } from './resourceProxy';
import { TransactionInfo } from './transactionInfo';

export interface ChallanTxImpl extends IChallanTx { 
    importMode?: boolean;
    transaction?: TransactionInfo;
}