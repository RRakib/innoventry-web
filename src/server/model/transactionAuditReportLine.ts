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
import { DayBookLine } from './dayBookLine';
import { TransactionInfo } from './transactionInfo';

export interface TransactionAuditReportLine { 
    dayBookLine?: DayBookLine;
    status?: TransactionAuditReportLine.StatusEnum;
    auditNote?: string;
    transaction?: TransactionInfo;
}
export namespace TransactionAuditReportLine {
    export type StatusEnum = 'COMPLETED' | 'HAS_ISSUES' | 'NO_STATUS';
    export const StatusEnum = {
        COMPLETED: 'COMPLETED' as StatusEnum,
        HASISSUES: 'HAS_ISSUES' as StatusEnum,
        NOSTATUS: 'NO_STATUS' as StatusEnum
    };
}