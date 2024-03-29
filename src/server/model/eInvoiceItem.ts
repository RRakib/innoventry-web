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
import { EInvoiceBchDtls } from './eInvoiceBchDtls';
import { EInvoiceItemAttribute } from './eInvoiceItemAttribute';

export interface EInvoiceItem { 
    slNo?: string;
    prdDesc?: string;
    isServc?: string;
    hsnCd?: string;
    bchDtls?: EInvoiceBchDtls;
    barcde?: string;
    qty?: number;
    freeQty?: number;
    unit?: string;
    unitPrice?: number;
    totAmt?: number;
    discount?: number;
    preTaxVal?: number;
    assAmt?: number;
    gstRt?: number;
    igstAmt?: number;
    cgstAmt?: number;
    sgstAmt?: number;
    cesRt?: number;
    cesAmt?: number;
    cesNonAdvlAmt?: number;
    stateCesRt?: number;
    stateCesAmt?: number;
    stateCesNonAdvlAmt?: number;
    othChrg?: number;
    ordLineRef?: string;
    orgCntry?: string;
    prdSlNo?: string;
    totItemVal?: number;
    attribDtls?: Array<EInvoiceItemAttribute>;
}