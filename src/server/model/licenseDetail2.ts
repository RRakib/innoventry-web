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

export interface LicenseDetail2 { 
    productKey?: string;
    expiryDate?: Date;
    amcDate?: Date;
    licenseType?: LicenseDetail2.LicenseTypeEnum;
    yearly?: boolean;
}
export namespace LicenseDetail2 {
    export type LicenseTypeEnum = 'NONE' | 'LITE' | 'BASIC' | 'PERSONAL' | 'STANDARD' | 'FULL';
    export const LicenseTypeEnum = {
        NONE: 'NONE' as LicenseTypeEnum,
        LITE: 'LITE' as LicenseTypeEnum,
        BASIC: 'BASIC' as LicenseTypeEnum,
        PERSONAL: 'PERSONAL' as LicenseTypeEnum,
        STANDARD: 'STANDARD' as LicenseTypeEnum,
        FULL: 'FULL' as LicenseTypeEnum
    };
}