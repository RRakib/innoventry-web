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
import { StitchingItemHistoryReportArgument } from './stitchingItemHistoryReportArgument';

export interface StitchingItemHistoryReportServiceGetReportFileStream { 
    type?: StitchingItemHistoryReportServiceGetReportFileStream.TypeEnum;
    arg?: StitchingItemHistoryReportArgument;
}
export namespace StitchingItemHistoryReportServiceGetReportFileStream {
    export type TypeEnum = 'BIRT_DOCUMENT' | 'PDF' | 'EXCEL' | 'REPORT_OBJECT';
    export const TypeEnum = {
        BIRTDOCUMENT: 'BIRT_DOCUMENT' as TypeEnum,
        PDF: 'PDF' as TypeEnum,
        EXCEL: 'EXCEL' as TypeEnum,
        REPORTOBJECT: 'REPORT_OBJECT' as TypeEnum
    };
}