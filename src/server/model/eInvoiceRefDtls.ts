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
import { EInvoiceContrDtls } from './eInvoiceContrDtls';
import { EInvoiceDocPerdDtls } from './eInvoiceDocPerdDtls';
import { EInvoicePrecDocDtls } from './eInvoicePrecDocDtls';

export interface EInvoiceRefDtls { 
    invRm?: string;
    precDocDtls?: Array<EInvoicePrecDocDtls>;
    contrDtls?: Array<EInvoiceContrDtls>;
    docPerdDtls?: EInvoiceDocPerdDtls;
}