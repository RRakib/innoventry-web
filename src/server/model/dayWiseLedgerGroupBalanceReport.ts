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
import { DayWiseLedgerGroupBalanceReportLine } from './dayWiseLedgerGroupBalanceReportLine';

export interface DayWiseLedgerGroupBalanceReport { 
    dateFrom?: Date;
    dateTo?: Date;
    ledgerGroupName?: string;
    ledgerGroupId?: number;
    reportLines?: Array<DayWiseLedgerGroupBalanceReportLine>;
    showZeroBalance?: boolean;
}