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
import { TaxWiseSalePurchaseQuarterlySummaryLine } from './taxWiseSalePurchaseQuarterlySummaryLine';

export interface TaxWiseSalePurchaseQuarterlySummary { 
    dateFrom?: Date;
    dateTo?: Date;
    reportLines?: Array<TaxWiseSalePurchaseQuarterlySummaryLine>;
    outputTax?: number;
    inputTax?: number;
    openingAmount?: number;
    netAmount?: number;
}