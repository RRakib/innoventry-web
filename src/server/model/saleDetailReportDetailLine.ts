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
import { IGrainAgentItem } from './iGrainAgentItem';

export interface SaleDetailReportDetailLine { 
    item?: IGrainAgentItem;
    bag?: number;
    kgs?: number;
    rate?: number;
    qty?: number;
    expences?: number;
    bonus?: number;
    netAmount?: number;
    amount?: number;
    tax?: number;
}