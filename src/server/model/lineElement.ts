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
import { IReportElement } from './iReportElement';

export interface LineElement extends IReportElement { 
    style?: number;
    length?: number;
    tag?: string;
    direction?: LineElement.DirectionEnum;
}
export namespace LineElement {
    export type DirectionEnum = 'HORIZONTAL' | 'VERTICAL';
    export const DirectionEnum = {
        HORIZONTAL: 'HORIZONTAL' as DirectionEnum,
        VERTICAL: 'VERTICAL' as DirectionEnum
    };
}