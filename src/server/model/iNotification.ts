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

export interface INotification { 
    read?: boolean;
    shortDescription?: string;
    title?: string;
    notificationType?: number;
    notificationGroup?: string;
    userToNotifyName?: string;
    url?: string;
    userToNotify?: number;
    imageUrl?: string;
    actionKey?: string;
    validTill?: Date;
    modificationdate?: Date;
    impCompanyGuid?: string;
    productUserName?: string;
    productUserId?: number;
    logInfo?: string;
    importedId?: number;
    creationdate?: Date;
    id?: number;
    jacksontype?: string;
}