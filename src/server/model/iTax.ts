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

export interface ITax { 
    value?: number;
    reverseChargeInputAcId?: number;
    reverseChargeInputAcName?: string;
    reverseChargeOutputAcName?: string;
    reverseChargeOutputAcId?: number;
    taxOnTax?: boolean;
    saleLedgerId?: number;
    taxOnTaxList?: Array<ITax>;
    fixed?: boolean;
    abbr?: string;
    label?: string;
    saleLedgerName?: string;
    purchaseLedgerName?: string;
    purchaseLedgerId?: number;
    name?: string;
    description?: string;
    modificationdate?: Date;
    impCompanyGuid?: string;
    productUserName?: string;
    productUserId?: number;
    logInfo?: string;
    importedId?: number;
    creationdate?: Date;
    id?: number;
    jacksontype?: string;
}