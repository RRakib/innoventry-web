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
import { ILedger } from './iLedger';

export interface BonusReportLine { 
    purchaseLedger?: ILedger;
    item?: IGrainAgentItem;
    qty?: number;
    bonus?: number;
    regPageNo?: string;
    addBonusReportLine?: any;
    framerLedger?: ILedger;
    jformNo?: string;
    prno?: string;
    transactinDate?: Date;
}