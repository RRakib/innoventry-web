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

export interface ImportDataColumnDefintion { 
    title?: string;
    type?: ImportDataColumnDefintion.TypeEnum;
    format?: string;
    columnSize?: number;
}
export namespace ImportDataColumnDefintion {
    export type TypeEnum = 'STRING' | 'DOUBLE' | 'INT' | 'DATE' | 'BOOLEAN';
    export const TypeEnum = {
        STRING: 'STRING' as TypeEnum,
        DOUBLE: 'DOUBLE' as TypeEnum,
        INT: 'INT' as TypeEnum,
        DATE: 'DATE' as TypeEnum,
        BOOLEAN: 'BOOLEAN' as TypeEnum
    };
}