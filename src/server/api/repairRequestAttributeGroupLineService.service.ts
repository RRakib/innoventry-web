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
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { IRepairRequestAttributeGroupLine } from '../model/iRepairRequestAttributeGroupLine';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class RepairRequestAttributeGroupLineServiceService {

    protected basePath = '/rest';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * getStockableAttributeGroupLines
     * 
     * @param item 
     * @param stockLocation 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getStockableAttributeGroupLines(item?: number, stockLocation?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<IRepairRequestAttributeGroupLine>>;
    public getStockableAttributeGroupLines(item?: number, stockLocation?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<IRepairRequestAttributeGroupLine>>>;
    public getStockableAttributeGroupLines(item?: number, stockLocation?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<IRepairRequestAttributeGroupLine>>>;
    public getStockableAttributeGroupLines(item?: number, stockLocation?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {



        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (item !== undefined && item !== null) {
            queryParameters = queryParameters.set('item', <any>item);
        }
        if (stockLocation !== undefined && stockLocation !== null) {
            queryParameters = queryParameters.set('stockLocation', <any>stockLocation);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<Array<IRepairRequestAttributeGroupLine>>('get',`${this.basePath}/admin/repair/RepairRequestAttributeGroupLineService/getStockableAttributeGroupLines`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
