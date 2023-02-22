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
import { IAttributeLine } from './iAttributeLine';
import { TransactionInfo } from './transactionInfo';

export interface IStockAttributeGroupLine { 
    stockDetailLineId?: number;
    transaction?: TransactionInfo;
    quantity?: number;
    barcode?: string;
    sellingRate?: number;
    stockKey?: string;
    mrp?: number;
    attributeLines?: Array<IAttributeLine>;
    modificationdate?: Date;
    impCompanyGuid?: string;
    productUserName?: string;
    productUserId?: number;
    logInfo?: string;
    importedId?: number;
    creationdate?: Date;
    id?: number;
    jacksontype?: string;
}