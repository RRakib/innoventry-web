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
import { SFont } from './sFont';

export interface TextElement extends IReportElement { 
    contentType?: TextElement.ContentTypeEnum;
    alignment?: TextElement.AlignmentEnum;
    hpadding?: number;
    vpadding?: number;
    sfont?: SFont;
    hiddenConditionType?: TextElement.HiddenConditionTypeEnum;
    hiddenConditionArgument?: string;
    width?: number;
    text?: string;
    height?: number;
}
export namespace TextElement {
    export type ContentTypeEnum = 'STRING' | 'DOUBLE' | 'INT' | 'DATE';
    export const ContentTypeEnum = {
        STRING: 'STRING' as ContentTypeEnum,
        DOUBLE: 'DOUBLE' as ContentTypeEnum,
        INT: 'INT' as ContentTypeEnum,
        DATE: 'DATE' as ContentTypeEnum
    };
    export type AlignmentEnum = 'LEFT' | 'RIGHT' | 'CENTER';
    export const AlignmentEnum = {
        LEFT: 'LEFT' as AlignmentEnum,
        RIGHT: 'RIGHT' as AlignmentEnum,
        CENTER: 'CENTER' as AlignmentEnum
    };
    export type HiddenConditionTypeEnum = 'EMPTY_DATA_SOURCE' | 'SHOW_ONLY_ON_LAST_LAGE' | 'EMPTY_DATA_SET';
    export const HiddenConditionTypeEnum = {
        EMPTYDATASOURCE: 'EMPTY_DATA_SOURCE' as HiddenConditionTypeEnum,
        SHOWONLYONLASTLAGE: 'SHOW_ONLY_ON_LAST_LAGE' as HiddenConditionTypeEnum,
        EMPTYDATASET: 'EMPTY_DATA_SET' as HiddenConditionTypeEnum
    };
}