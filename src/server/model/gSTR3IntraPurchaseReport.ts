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
import { GSTR3IntraPurchaseReportLine } from './gSTR3IntraPurchaseReportLine';

export interface GSTR3IntraPurchaseReport { 
    itemLines?: Array<GSTR3IntraPurchaseReportLine>;
    totalItemValue?: number;
    totalItemCgst?: number;
    totalItemCess?: number;
    totalItemSgst?: number;
    totalItemTaxableValue?: number;
    serviceLines?: Array<GSTR3IntraPurchaseReportLine>;
    totalServiceValue?: number;
    totalServiceCgst?: number;
    totalServiceCess?: number;
    totalServiceSgst?: number;
    totalServiceTaxableValue?: number;
}