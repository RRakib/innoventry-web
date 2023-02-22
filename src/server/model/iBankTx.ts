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
import { ReferenceTxInfo } from './referenceTxInfo';
import { ResourceProxy } from './resourceProxy';

export interface IBankTx { 
    type?: IBankTx.TypeEnum;
    draftOrChequeDate?: Date;
    draftOrChequeNo?: string;
    refNo?: string;
    amount?: number;
    expenses?: number;
    totalAmount?: number;
    totalCredit?: number;
    totalDebit?: number;
    voucherConfigType?: number;
    generatedVchNumSeq?: number;
    voucherConfigTypeName?: string;
    tdsTypeWithPan?: boolean;
    vouchernumber?: string;
    tdsTypeId?: number;
    tdsTypeName?: string;
    tdsRate?: number;
    typeName?: string;
    description?: string;
    transactionType?: number;
    transactiondate?: Date;
    otherReferences?: string;
    referenceTxInfoList?: Array<ReferenceTxInfo>;
    storeName?: string;
    storeId?: number;
    referenceNo?: string;
    termsId?: number;
    resourceProxy?: ResourceProxy;
    txStatus?: number;
    modificationdate?: Date;
    impCompanyGuid?: string;
    productUserName?: string;
    productUserId?: number;
    logInfo?: string;
    importedId?: number;
    creationdate?: Date;
    id?: number;
    jacksontype?: string;
    ledgerDetailLines?: Array<ILedgerDetailLine>;
}
export namespace IBankTx {
    export type TypeEnum = 'CHEQUE_ISSUED' | 'DRAFT_ISSUED' | 'CHEQUE_DRAFT_RTGS_RECEIVED' | 'DEPOSIT_CASH_INTO_BANK' | 'WITHDRAW_CASH_FROM_BANK' | 'BANK_EXPENSES' | 'NEFT_RTGS_IMPS_TRANSFER';
    export const TypeEnum = {
        CHEQUEISSUED: 'CHEQUE_ISSUED' as TypeEnum,
        DRAFTISSUED: 'DRAFT_ISSUED' as TypeEnum,
        CHEQUEDRAFTRTGSRECEIVED: 'CHEQUE_DRAFT_RTGS_RECEIVED' as TypeEnum,
        DEPOSITCASHINTOBANK: 'DEPOSIT_CASH_INTO_BANK' as TypeEnum,
        WITHDRAWCASHFROMBANK: 'WITHDRAW_CASH_FROM_BANK' as TypeEnum,
        BANKEXPENSES: 'BANK_EXPENSES' as TypeEnum,
        NEFTRTGSIMPSTRANSFER: 'NEFT_RTGS_IMPS_TRANSFER' as TypeEnum
    };
}