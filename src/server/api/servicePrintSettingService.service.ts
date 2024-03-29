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

import { ServicePrintSetting } from '../model/servicePrintSetting';
import { ServicePrintSettingInfo } from '../model/servicePrintSettingInfo';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class ServicePrintSettingServiceService {

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
     * getPrintFormatList
     * 
     * @param transType 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getPrintFormatList(transType?: string, observe?: 'body', reportProgress?: boolean): Observable<Array<ServicePrintSettingInfo>>;
    public getPrintFormatList(transType?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<ServicePrintSettingInfo>>>;
    public getPrintFormatList(transType?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<ServicePrintSettingInfo>>>;
    public getPrintFormatList(transType?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (transType !== undefined && transType !== null) {
            queryParameters = queryParameters.set('transType', <any>transType);
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

        return this.httpClient.request<Array<ServicePrintSettingInfo>>('get',`${this.basePath}/admin/service/ServicePrintSettingService/getPrintFormatList`,
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
     * getPrintFormatNames
     * 
     * @param transType 
     * @param includeFixedFormats 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getPrintFormatNames(transType?: string, includeFixedFormats?: boolean, observe?: 'body', reportProgress?: boolean): Observable<Array<string>>;
    public getPrintFormatNames(transType?: string, includeFixedFormats?: boolean, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<string>>>;
    public getPrintFormatNames(transType?: string, includeFixedFormats?: boolean, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<string>>>;
    public getPrintFormatNames(transType?: string, includeFixedFormats?: boolean, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {



        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (transType !== undefined && transType !== null) {
            queryParameters = queryParameters.set('transType', <any>transType);
        }
        if (includeFixedFormats !== undefined && includeFixedFormats !== null) {
            queryParameters = queryParameters.set('includeFixedFormats', <any>includeFixedFormats);
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

        return this.httpClient.request<Array<string>>('get',`${this.basePath}/admin/service/ServicePrintSettingService/getPrintFormatNames`,
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
     * getPrintSetting
     * 
     * @param transType 
     * @param name 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getPrintSetting(transType?: string, name?: string, observe?: 'body', reportProgress?: boolean): Observable<ServicePrintSetting>;
    public getPrintSetting(transType?: string, name?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ServicePrintSetting>>;
    public getPrintSetting(transType?: string, name?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ServicePrintSetting>>;
    public getPrintSetting(transType?: string, name?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {



        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (transType !== undefined && transType !== null) {
            queryParameters = queryParameters.set('transType', <any>transType);
        }
        if (name !== undefined && name !== null) {
            queryParameters = queryParameters.set('name', <any>name);
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

        return this.httpClient.request<ServicePrintSetting>('get',`${this.basePath}/admin/service/ServicePrintSettingService/getPrintSetting`,
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
    public save(body?: ServicePrintSetting, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public save(body?: ServicePrintSetting, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public save(body?: ServicePrintSetting, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public save(body?: ServicePrintSetting, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<string>('post',`${this.basePath}/admin/service/ServicePrintSettingService/save`,
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
