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
import { IContact } from './iContact';
import { ILedger } from './iLedger';
import { RepairRequestReportLine } from './repairRequestReportLine';

export interface RepairRequestReport { 
    dateFrom?: Date;
    dateTo?: Date;
    dueDate?: Date;
    contact?: IContact;
    serviceCenterLedger?: ILedger;
    repairItem?: string;
    status?: RepairRequestReport.StatusEnum;
    engineer?: ILedger;
    state?: string;
    reportLines?: Array<RepairRequestReportLine>;
}
export namespace RepairRequestReport {
    export type StatusEnum = 'Received' | 'With_Service_Center' | 'Received_From_Service_Center' | 'Delivered';
    export const StatusEnum = {
        Received: 'Received' as StatusEnum,
        WithServiceCenter: 'With_Service_Center' as StatusEnum,
        ReceivedFromServiceCenter: 'Received_From_Service_Center' as StatusEnum,
        Delivered: 'Delivered' as StatusEnum
    };
}