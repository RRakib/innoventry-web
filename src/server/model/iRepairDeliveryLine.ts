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
import { IAbstractTransaction } from './iAbstractTransaction';
import { IRepairRequestLine } from './iRepairRequestLine';

export interface IRepairDeliveryLine { 
    type?: IRepairDeliveryLine.TypeEnum;
    description?: string;
    transaction?: IAbstractTransaction;
    details?: string;
    amount?: number;
    srNo?: string;
    repairRequestLine?: IRepairRequestLine;
    id?: number;
    jacksontype?: string;
}
export namespace IRepairDeliveryLine {
    export type TypeEnum = 'REPAIR' | 'REPLACE' | 'WARRANTY';
    export const TypeEnum = {
        REPAIR: 'REPAIR' as TypeEnum,
        REPLACE: 'REPLACE' as TypeEnum,
        WARRANTY: 'WARRANTY' as TypeEnum
    };
}