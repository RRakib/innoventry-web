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
import { IStockDetailLine } from './iStockDetailLine';

export interface ConsumptionItemDetailReport { 
    stockDetailLines?: Array<IStockDetailLine>;
    totalQuantity?: number;
    totalAmount?: number;
    stockLocation?: string;
    item?: string;
    dateFrom?: Date;
    dateTo?: Date;
}