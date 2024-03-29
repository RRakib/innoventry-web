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

export interface IProductScheme { 
    option?: IProductScheme.OptionEnum;
    qty?: number;
    amount?: number;
    itemName?: string;
    itemId?: number;
    id?: number;
    jacksontype?: string;
}
export namespace IProductScheme {
    export type OptionEnum = 'FREE_ITEM' | 'DISCOUNTED_PRICE';
    export const OptionEnum = {
        FREEITEM: 'FREE_ITEM' as OptionEnum,
        DISCOUNTEDPRICE: 'DISCOUNTED_PRICE' as OptionEnum
    };
}