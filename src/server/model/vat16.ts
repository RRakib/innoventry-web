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
import { Vat16Entry } from './vat16Entry';

export interface Vat16 { 
    name?: string;
    tin?: string;
    address?: string;
    pin?: string;
    telephone?: string;
    fax?: string;
    email?: string;
    pan?: string;
    quarter?: string;
    financialYear?: string;
    valueOfImport?: number;
    valueOfInterStatePurchase?: number;
    valueOfIntraStatePurchaseUs19?: number;
    valueOfIntraStatePurchaseUs20?: number;
    valueOfIntraStatePurchaseFromExemptedUnits?: number;
    valueOfIntraStatePurchaseFromTaxablePersons?: number;
    valueOfIntraStatePurchaseFromNonTaxablePersons?: number;
    vatOnPurchasesActualITC?: number;
    vatOnPurchasesNotionalITC?: number;
    vatOnPurchasesITCBf?: number;
    valueOfExportsOutOfIndia?: number;
    valueOfInterStateSales?: number;
    valueOfIntraStateSalesToTaxablePersons?: number;
    valueOfIntraStateSalesToNonTaxablePersons?: number;
    valueOfInterStateSalesVatOnSales?: number;
    entriesSaleIntraStateActual?: Array<Vat16Entry>;
    entriesPurchaseIntraStateActual?: Array<Vat16Entry>;
    entriesSaleIntraStateExtra?: Array<Vat16Entry>;
    entriesPurchaseIntraStateExtra?: Array<Vat16Entry>;
    entriesInter?: Array<Vat16Entry>;
    outputTax?: number;
    netTaxPayable?: number;
    itc?: number;
}