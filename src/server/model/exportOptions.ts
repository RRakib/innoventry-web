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

export interface ExportOptions { 
    dateFrom?: Date;
    dateTo?: Date;
    lastExportdate?: Date;
    exportType?: ExportOptions.ExportTypeEnum;
    exportYearEndData?: boolean;
    fullSync?: boolean;
}
export namespace ExportOptions {
    export type ExportTypeEnum = 'LEGAL_BOOK' | 'EXPORT_TRANSACTION' | 'SYNC_WITH_ACCOUNTANT';
    export const ExportTypeEnum = {
        LEGALBOOK: 'LEGAL_BOOK' as ExportTypeEnum,
        EXPORTTRANSACTION: 'EXPORT_TRANSACTION' as ExportTypeEnum,
        SYNCWITHACCOUNTANT: 'SYNC_WITH_ACCOUNTANT' as ExportTypeEnum
    };
}