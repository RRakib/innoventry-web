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
import { ILedger } from './iLedger';
import { ISite } from './iSite';
import { ProcurementRequestReportLine } from './procurementRequestReportLine';

export interface ProcurementRequestRegister { 
    site?: ISite;
    dateFrom?: Date;
    dateTo?: Date;
    showClosed?: boolean;
    contractor?: ILedger;
    reportLines?: Array<ProcurementRequestReportLine>;
}