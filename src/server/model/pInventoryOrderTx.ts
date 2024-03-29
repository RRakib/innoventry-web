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
import { PInventoryOrderTxChargesLine } from './pInventoryOrderTxChargesLine';
import { PInventoryOrderTxLine } from './pInventoryOrderTxLine';

export interface PInventoryOrderTx { 
    id?: number;
    type?: string;
    date?: Date;
    vchNo?: string;
    description?: string;
    refNo?: string;
    ledger?: number;
    printName?: string;
    lines?: Array<PInventoryOrderTxLine>;
    chargesLines?: Array<PInventoryOrderTxChargesLine>;
    status?: string;
    closed?: boolean;
}