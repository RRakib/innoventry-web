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
import { HypothecationDetailReportLine } from './hypothecationDetailReportLine';
import { ILedger } from './iLedger';

export interface HypothecationDetailReport { 
    dateFrom?: Date;
    dateTo?: Date;
    ledger?: ILedger;
    reportLines?: Array<HypothecationDetailReportLine>;
    total?: number;
    totalQty?: number;
}