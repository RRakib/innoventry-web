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
import { TradingAccountReportLine } from './tradingAccountReportLine';

export interface TradingAccountReport { 
    liabilitiesReportLines?: Array<TradingAccountReportLine>;
    assetsReportLines?: Array<TradingAccountReportLine>;
    dateFrom?: Date;
    dateTo?: Date;
}