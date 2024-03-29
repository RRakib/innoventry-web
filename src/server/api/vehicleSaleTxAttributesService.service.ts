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

import { IVehicleSaleTxAttributes } from '../model/iVehicleSaleTxAttributes';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class VehicleSaleTxAttributesServiceService {

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
     * find
     * 
     * @param tx 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public find(tx?: number, observe?: 'body', reportProgress?: boolean): Observable<IVehicleSaleTxAttributes>;
    public find(tx?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<IVehicleSaleTxAttributes>>;
    public find(tx?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<IVehicleSaleTxAttributes>>;
    public find(tx?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (tx !== undefined && tx !== null) {
            queryParameters = queryParameters.set('tx', <any>tx);
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

        return this.httpClient.request<IVehicleSaleTxAttributes>('get',`${this.basePath}/admin/vehicledealer/VehicleSaleTxAttributesService/find`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * getVehicleSaleTxAttributesList
     * 
     * @param hpLedger 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getVehicleSaleTxAttributesList(hpLedger?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<IVehicleSaleTxAttributes>>;
    public getVehicleSaleTxAttributesList(hpLedger?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<IVehicleSaleTxAttributes>>>;
    public getVehicleSaleTxAttributesList(hpLedger?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<IVehicleSaleTxAttributes>>>;
    public getVehicleSaleTxAttributesList(hpLedger?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (hpLedger !== undefined && hpLedger !== null) {
            queryParameters = queryParameters.set('hpLedger', <any>hpLedger);
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

        return this.httpClient.request<Array<IVehicleSaleTxAttributes>>('get',`${this.basePath}/admin/vehicledealer/VehicleSaleTxAttributesService/getVehicleSaleTxAttributesList`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * save
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public save(body?: IVehicleSaleTxAttributes, observe?: 'body', reportProgress?: boolean): Observable<IVehicleSaleTxAttributes>;
    public save(body?: IVehicleSaleTxAttributes, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<IVehicleSaleTxAttributes>>;
    public save(body?: IVehicleSaleTxAttributes, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<IVehicleSaleTxAttributes>>;
    public save(body?: IVehicleSaleTxAttributes, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<IVehicleSaleTxAttributes>('post',`${this.basePath}/admin/vehicledealer/VehicleSaleTxAttributesService/save`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * update
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public update(body?: IVehicleSaleTxAttributes, observe?: 'body', reportProgress?: boolean): Observable<IVehicleSaleTxAttributes>;
    public update(body?: IVehicleSaleTxAttributes, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<IVehicleSaleTxAttributes>>;
    public update(body?: IVehicleSaleTxAttributes, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<IVehicleSaleTxAttributes>>;
    public update(body?: IVehicleSaleTxAttributes, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<IVehicleSaleTxAttributes>('post',`${this.basePath}/admin/vehicledealer/VehicleSaleTxAttributesService/update`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
