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
import { EOrderLine } from './eOrderLine';

export interface EOrder { 
    lines?: Array<EOrderLine>;
    amount?: number;
    status?: string;
    vchNo?: string;
    id?: number;
    orderDate?: Date;
    deliveryAddress?: string;
}