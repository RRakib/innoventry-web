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

import { FileResponse } from '../model/fileResponse';
import { ICustomReport } from '../model/iCustomReport';
import { ILedgerItemDiscount } from '../model/iLedgerItemDiscount';
import { LedgerItemDiscountServiceGetReport } from '../model/ledgerItemDiscountServiceGetReport';
import { LedgerItemDiscountServiceGetReportAsFile } from '../model/ledgerItemDiscountServiceGetReportAsFile';
import { LedgerItemDiscountServiceGetReportObj } from '../model/ledgerItemDiscountServiceGetReportObj';
import { VoidResponse } from '../model/voidResponse';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class LedgerItemDiscountServiceService {

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
     * delete
     * 
     * @param pojo 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public _delete(pojo?: number, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public _delete(pojo?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public _delete(pojo?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public _delete(pojo?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (pojo !== undefined && pojo !== null) {
            queryParameters = queryParameters.set('pojo', <any>pojo);
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

        return this.httpClient.request<string>('get',`${this.basePath}/admin/inventory/LedgerItemDiscountService/delete`,
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
     * canDelete
     * 
     * @param pojo 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public canDelete(pojo?: number, observe?: 'body', reportProgress?: boolean): Observable<boolean>;
    public canDelete(pojo?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<boolean>>;
    public canDelete(pojo?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<boolean>>;
    public canDelete(pojo?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (pojo !== undefined && pojo !== null) {
            queryParameters = queryParameters.set('pojo', <any>pojo);
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

        return this.httpClient.request<boolean>('get',`${this.basePath}/admin/inventory/LedgerItemDiscountService/canDelete`,
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
     * deleteById
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteById(id?: number, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public deleteById(id?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public deleteById(id?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public deleteById(id?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (id !== undefined && id !== null) {
            queryParameters = queryParameters.set('id', <any>id);
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

        return this.httpClient.request<string>('get',`${this.basePath}/admin/inventory/LedgerItemDiscountService/deleteById`,
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
     * deleteObjectById
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteObjectById(id?: number, observe?: 'body', reportProgress?: boolean): Observable<VoidResponse>;
    public deleteObjectById(id?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<VoidResponse>>;
    public deleteObjectById(id?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<VoidResponse>>;
    public deleteObjectById(id?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (id !== undefined && id !== null) {
            queryParameters = queryParameters.set('id', <any>id);
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

        return this.httpClient.request<VoidResponse>('get',`${this.basePath}/admin/inventory/LedgerItemDiscountService/deleteObjectById`,
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
     * findByGuid
     * 
     * @param uid 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public findByGuid(uid?: string, observe?: 'body', reportProgress?: boolean): Observable<ILedgerItemDiscount>;
    public findByGuid(uid?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ILedgerItemDiscount>>;
    public findByGuid(uid?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ILedgerItemDiscount>>;
    public findByGuid(uid?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (uid !== undefined && uid !== null) {
            queryParameters = queryParameters.set('uid', <any>uid);
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

        return this.httpClient.request<ILedgerItemDiscount>('get',`${this.basePath}/admin/inventory/LedgerItemDiscountService/findByGuid`,
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
     * find
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public findById(id?: number, observe?: 'body', reportProgress?: boolean): Observable<ILedgerItemDiscount>;
    public findById(id?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ILedgerItemDiscount>>;
    public findById(id?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ILedgerItemDiscount>>;
    public findById(id?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (id !== undefined && id !== null) {
            queryParameters = queryParameters.set('id', <any>id);
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

        return this.httpClient.request<ILedgerItemDiscount>('get',`${this.basePath}/admin/inventory/LedgerItemDiscountService/findById`,
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
     * findForUpdate
     * 
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public findForUpdate(id?: number, observe?: 'body', reportProgress?: boolean): Observable<ILedgerItemDiscount>;
    public findForUpdate(id?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ILedgerItemDiscount>>;
    public findForUpdate(id?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ILedgerItemDiscount>>;
    public findForUpdate(id?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (id !== undefined && id !== null) {
            queryParameters = queryParameters.set('id', <any>id);
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

        return this.httpClient.request<ILedgerItemDiscount>('get',`${this.basePath}/admin/inventory/LedgerItemDiscountService/findForUpdate`,
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
     * getApplicableFixedDiscount
     * 
     * @param item 
     * @param ledger 
     * @param date 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getApplicableFixedDiscount(item?: number, ledger?: number, date?: string, observe?: 'body', reportProgress?: boolean): Observable<number>;
    public getApplicableFixedDiscount(item?: number, ledger?: number, date?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<number>>;
    public getApplicableFixedDiscount(item?: number, ledger?: number, date?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<number>>;
    public getApplicableFixedDiscount(item?: number, ledger?: number, date?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {




        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (item !== undefined && item !== null) {
            queryParameters = queryParameters.set('item', <any>item);
        }
        if (ledger !== undefined && ledger !== null) {
            queryParameters = queryParameters.set('ledger', <any>ledger);
        }
        if (date !== undefined && date !== null) {
            queryParameters = queryParameters.set('date', <any>date);
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

        return this.httpClient.request<number>('get',`${this.basePath}/admin/inventory/LedgerItemDiscountService/getApplicableFixedDiscount`,
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
     * getObjects
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getObjects(observe?: 'body', reportProgress?: boolean): Observable<Array<ILedgerItemDiscount>>;
    public getObjects(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<ILedgerItemDiscount>>>;
    public getObjects(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<ILedgerItemDiscount>>>;
    public getObjects(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<Array<ILedgerItemDiscount>>('get',`${this.basePath}/admin/inventory/LedgerItemDiscountService/getObjects`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * getReport
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getReport(body?: LedgerItemDiscountServiceGetReport, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getReport(body?: LedgerItemDiscountServiceGetReport, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getReport(body?: LedgerItemDiscountServiceGetReport, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getReport(body?: LedgerItemDiscountServiceGetReport, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
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

        return this.httpClient.request<any>('post',`${this.basePath}/admin/inventory/LedgerItemDiscountService/getReport`,
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
     * getReportAsFile
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getReportAsFile(body?: LedgerItemDiscountServiceGetReportAsFile, observe?: 'body', reportProgress?: boolean): Observable<FileResponse>;
    public getReportAsFile(body?: LedgerItemDiscountServiceGetReportAsFile, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<FileResponse>>;
    public getReportAsFile(body?: LedgerItemDiscountServiceGetReportAsFile, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<FileResponse>>;
    public getReportAsFile(body?: LedgerItemDiscountServiceGetReportAsFile, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<FileResponse>('post',`${this.basePath}/admin/inventory/LedgerItemDiscountService/getReportAsFile`,
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
     * getReportObj
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getReportObj(body?: LedgerItemDiscountServiceGetReportObj, observe?: 'body', reportProgress?: boolean): Observable<ICustomReport>;
    public getReportObj(body?: LedgerItemDiscountServiceGetReportObj, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ICustomReport>>;
    public getReportObj(body?: LedgerItemDiscountServiceGetReportObj, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ICustomReport>>;
    public getReportObj(body?: LedgerItemDiscountServiceGetReportObj, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<ICustomReport>('post',`${this.basePath}/admin/inventory/LedgerItemDiscountService/getReportObj`,
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
     * save
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public save(body?: ILedgerItemDiscount, observe?: 'body', reportProgress?: boolean): Observable<ILedgerItemDiscount>;
    public save(body?: ILedgerItemDiscount, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ILedgerItemDiscount>>;
    public save(body?: ILedgerItemDiscount, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ILedgerItemDiscount>>;
    public save(body?: ILedgerItemDiscount, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<ILedgerItemDiscount>('post',`${this.basePath}/admin/inventory/LedgerItemDiscountService/save`,
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
    public update(body?: ILedgerItemDiscount, observe?: 'body', reportProgress?: boolean): Observable<ILedgerItemDiscount>;
    public update(body?: ILedgerItemDiscount, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ILedgerItemDiscount>>;
    public update(body?: ILedgerItemDiscount, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ILedgerItemDiscount>>;
    public update(body?: ILedgerItemDiscount, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<ILedgerItemDiscount>('post',`${this.basePath}/admin/inventory/LedgerItemDiscountService/update`,
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
