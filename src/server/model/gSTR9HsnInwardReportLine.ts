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

export interface GSTR9HsnInwardReportLine { 
    hsnCode?: string;
    desc?: string;
    uqc?: string;
    totalQuantity?: number;
    totalTaxableVal?: number;
    isApplicableForConcessionalRateOfTax?: string;
    rateOfTax?: string;
    igst?: number;
    sgst?: number;
    cgst?: number;
    cess?: number;
    action?: string;
    sheetValidationError?: string;
    gstPortalValidationError?: string;
}