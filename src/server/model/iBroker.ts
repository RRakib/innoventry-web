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
import { IContactAddress } from './iContactAddress';
import { IDocument } from './iDocument';
import { ILedgerLabel } from './iLedgerLabel';

export interface IBroker { 
    address?: string;
    stateName?: string;
    addressList?: Array<IContactAddress>;
    mobile?: string;
    email?: string;
    labels?: Array<ILedgerLabel>;
    alternateEmail?: string;
    grandFatherName?: string;
    faxNo?: string;
    ledger?: boolean;
    uid?: string;
    dateMarriageAnniversary?: Date;
    stateId?: number;
    cityId?: number;
    cityName?: string;
    contactPerson?: string;
    alternateNo1?: string;
    alternateNo2?: string;
    dateOfBirth?: Date;
    bankIfscCode?: string;
    images?: Array<IDocument>;
    accountName?: string;
    fatherName?: string;
    bankName?: string;
    branchName?: string;
    bankAcNo?: string;
    pinCode?: string;
    weblink?: string;
    name?: string;
    description?: string;
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