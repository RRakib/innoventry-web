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
import { IStockDetailLine } from './iStockDetailLine';
import { ReferenceTxInfo } from './referenceTxInfo';
import { ResourceProxy } from './resourceProxy';

export interface IStockShortageTx { 
    category?: string;
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
    stockDetailLines?: Array<IStockDetailLine>;
}