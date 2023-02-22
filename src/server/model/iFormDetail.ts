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
import { IFormReportLine } from './iFormReportLine';
import { IMandi } from './iMandi';

export interface IFormDetail { 
    mandi?: IMandi;
    dateFrom?: Date;
    dateTo?: Date;
    item?: number;
    totalBags?: number;
    totalKgs?: number;
    totalQty?: number;
    totalAmount?: number;
    totalExpenses?: number;
    totalNetAmount?: number;
    totalBillAmount?: number;
    totalBonus?: number;
    getiFormDetailReportLine?: Array<IFormReportLine>;
}