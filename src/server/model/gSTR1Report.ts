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
import { GSTR1AtReport } from './gSTR1AtReport';
import { GSTR1AtadjReport } from './gSTR1AtadjReport';
import { GSTR1B2bReport } from './gSTR1B2bReport';
import { GSTR1B2clReport } from './gSTR1B2clReport';
import { GSTR1B2csReport } from './gSTR1B2csReport';
import { GSTR1CdnrReport } from './gSTR1CdnrReport';
import { GSTR1CdnurReport } from './gSTR1CdnurReport';
import { GSTR1DocsReport } from './gSTR1DocsReport';
import { GSTR1ExempReport } from './gSTR1ExempReport';
import { GSTR1ExpReport } from './gSTR1ExpReport';
import { GSTR1HsnReport } from './gSTR1HsnReport';

export interface GSTR1Report { 
    b2bReport?: GSTR1B2bReport;
    atadjReport?: GSTR1AtadjReport;
    atReport?: GSTR1AtReport;
    b2clReport?: GSTR1B2clReport;
    b2csReport?: GSTR1B2csReport;
    cdnrReport?: GSTR1CdnrReport;
    cdnurReport?: GSTR1CdnurReport;
    docsReport?: GSTR1DocsReport;
    exmpReport?: GSTR1ExempReport;
    expReport?: GSTR1ExpReport;
    hsnReport?: GSTR1HsnReport;
    totalSaleTxCount?: number;
    msgs?: Array<string>;
}