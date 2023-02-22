import { IAttributeLine, IItemAttributeGroupLine, TransactionInfo } from "src/server";

export class AttributeGroupLine implements IItemAttributeGroupLine{
    itemLineId?: number;
    transaction?: TransactionInfo;
    quantity: number;
    barcode?: string;
    sellingRate?: number;
    stockKey?: string;
    mrp?: number;
    attributeLines?: Array<IAttributeLine>;
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