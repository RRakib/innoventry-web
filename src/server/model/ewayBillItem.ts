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

export interface EwayBillItem { 
    productName?: string;
    productDesc?: string;
    hsnCode?: number;
    quantity?: number;
    qtyUnit?: string;
    cgstRate?: number;
    sgstRate?: number;
    igstRate?: number;
    cessRate?: number;
    cessNonadvol?: number;
    taxableAmount?: number;
}