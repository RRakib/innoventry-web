import { IAttributeLine } from "src/server";

export class AttributeLine implements IAttributeLine{
    value: string;
    attributeName: string;
    attributeId: number;
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