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
import { InvoiceFiscalizationResult } from './invoiceFiscalizationResult';

export interface InventoryAllBillPrintServiceGetPrintFijiReportTypeResTxFormatIndex { 
    reportType?: InventoryAllBillPrintServiceGetPrintFijiReportTypeResTxFormatIndex.ReportTypeEnum;
    res?: InvoiceFiscalizationResult;
    tx?: number;
    format?: string;
    index?: number;
}
export namespace InventoryAllBillPrintServiceGetPrintFijiReportTypeResTxFormatIndex {
    export type ReportTypeEnum = 'BIRT_DOCUMENT' | 'PDF' | 'EXCEL' | 'REPORT_OBJECT';
    export const ReportTypeEnum = {
        BIRTDOCUMENT: 'BIRT_DOCUMENT' as ReportTypeEnum,
        PDF: 'PDF' as ReportTypeEnum,
        EXCEL: 'EXCEL' as ReportTypeEnum,
        REPORTOBJECT: 'REPORT_OBJECT' as ReportTypeEnum
    };
}