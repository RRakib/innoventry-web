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
import { GetObjectsArgument } from '../model/getObjectsArgument';
import { GetObjectsResultISMSInfo } from '../model/getObjectsResultISMSInfo';
import { ICustomReport } from '../model/iCustomReport';
import { ISMSInfo } from '../model/iSMSInfo';
import { NameInfoResult } from '../model/nameInfoResult';
import { SMSInfoServiceGetReport } from '../model/sMSInfoServiceGetReport';
import { SMSInfoServiceGetReportAsFile } from '../model/sMSInfoServiceGetReportAsFile';
import { SMSInfoServiceGetReportObj } from '../model/sMSInfoServiceGetReportObj';
import { VoidResponse } from '../model/voidResponse';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class SMSInfoServiceService {

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

        return this.httpClient.request<string>('get',`${this.basePath}/admin/base/SMSInfoService/delete`,
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

        return this.httpClient.request<boolean>('get',`${this.basePath}/admin/base/SMSInfoService/canDelete`,
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

        return this.httpClient.request<string>('get',`${this.basePath}/admin/base/SMSInfoService/deleteById`,
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

        return this.httpClient.request<VoidResponse>('get',`${this.basePath}/admin/base/SMSInfoService/deleteObjectById`,
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
    public findByGuid(uid?: string, observe?: 'body', reportProgress?: boolean): Observable<ISMSInfo>;
    public findByGuid(uid?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ISMSInfo>>;
    public findByGuid(uid?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ISMSInfo>>;
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

        return this.httpClient.request<ISMSInfo>('get',`${this.basePath}/admin/base/SMSInfoService/findByGuid`,
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
    public findById(id?: number, observe?: 'body', reportProgress?: boolean): Observable<ISMSInfo>;
    public findById(id?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ISMSInfo>>;
    public findById(id?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ISMSInfo>>;
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

        return this.httpClient.request<ISMSInfo>('get',`${this.basePath}/admin/base/SMSInfoService/findById`,
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
     * @param name 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public findByName(name?: string, observe?: 'body', reportProgress?: boolean): Observable<ISMSInfo>;
    public findByName(name?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ISMSInfo>>;
    public findByName(name?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ISMSInfo>>;
    public findByName(name?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
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

        return this.httpClient.request<ISMSInfo>('get',`${this.basePath}/admin/base/SMSInfoService/findByName`,
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
    public findForUpdate(id?: number, observe?: 'body', reportProgress?: boolean): Observable<ISMSInfo>;
    public findForUpdate(id?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ISMSInfo>>;
    public findForUpdate(id?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ISMSInfo>>;
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

        return this.httpClient.request<ISMSInfo>('get',`${this.basePath}/admin/base/SMSInfoService/findForUpdate`,
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
     * getCount
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCount(body?: GetObjectsArgument, observe?: 'body', reportProgress?: boolean): Observable<number>;
    public getCount(body?: GetObjectsArgument, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<number>>;
    public getCount(body?: GetObjectsArgument, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<number>>;
    public getCount(body?: GetObjectsArgument, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<number>('post',`${this.basePath}/admin/base/SMSInfoService/getCount`,
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
     * getLastModifiedDate
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getLastModifiedDate(observe?: 'body', reportProgress?: boolean): Observable<string>;
    public getLastModifiedDate(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public getLastModifiedDate(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public getLastModifiedDate(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<string>('get',`${this.basePath}/admin/base/SMSInfoService/getLastModifiedDate`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * getNameInfoList
     * 
     * @param query 
     * @param startPage 
     * @param pageSize 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getNameInfoList(query?: string, startPage?: number, pageSize?: number, observe?: 'body', reportProgress?: boolean): Observable<NameInfoResult>;
    public getNameInfoList(query?: string, startPage?: number, pageSize?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<NameInfoResult>>;
    public getNameInfoList(query?: string, startPage?: number, pageSize?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<NameInfoResult>>;
    public getNameInfoList(query?: string, startPage?: number, pageSize?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {




        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (query !== undefined && query !== null) {
            queryParameters = queryParameters.set('query', <any>query);
        }
        if (startPage !== undefined && startPage !== null) {
            queryParameters = queryParameters.set('startPage', <any>startPage);
        }
        if (pageSize !== undefined && pageSize !== null) {
            queryParameters = queryParameters.set('pageSize', <any>pageSize);
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

        return this.httpClient.request<NameInfoResult>('get',`${this.basePath}/admin/base/SMSInfoService/getNameInfoList`,
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
    public getObjects(observe?: 'body', reportProgress?: boolean): Observable<Array<ISMSInfo>>;
    public getObjects(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<ISMSInfo>>>;
    public getObjects(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<ISMSInfo>>>;
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

        return this.httpClient.request<Array<ISMSInfo>>('get',`${this.basePath}/admin/base/SMSInfoService/getObjects`,
            {
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
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getObjectsSearchArg(body?: GetObjectsArgument, observe?: 'body', reportProgress?: boolean): Observable<GetObjectsResultISMSInfo>;
    public getObjectsSearchArg(body?: GetObjectsArgument, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<GetObjectsResultISMSInfo>>;
    public getObjectsSearchArg(body?: GetObjectsArgument, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<GetObjectsResultISMSInfo>>;
    public getObjectsSearchArg(body?: GetObjectsArgument, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<GetObjectsResultISMSInfo>('post',`${this.basePath}/admin/base/SMSInfoService/getObjects_searchArg`,
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
     * getObjects
     * 
     * @param startIndex 
     * @param countOfObjects 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getObjectsStartIndexCountOfObjects(startIndex?: number, countOfObjects?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<ISMSInfo>>;
    public getObjectsStartIndexCountOfObjects(startIndex?: number, countOfObjects?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<ISMSInfo>>>;
    public getObjectsStartIndexCountOfObjects(startIndex?: number, countOfObjects?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<ISMSInfo>>>;
    public getObjectsStartIndexCountOfObjects(startIndex?: number, countOfObjects?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {



        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (startIndex !== undefined && startIndex !== null) {
            queryParameters = queryParameters.set('startIndex', <any>startIndex);
        }
        if (countOfObjects !== undefined && countOfObjects !== null) {
            queryParameters = queryParameters.set('countOfObjects', <any>countOfObjects);
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

        return this.httpClient.request<Array<ISMSInfo>>('get',`${this.basePath}/admin/base/SMSInfoService/getObjects_startIndex_countOfObjects`,
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
     * getReport
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getReport(body?: SMSInfoServiceGetReport, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getReport(body?: SMSInfoServiceGetReport, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getReport(body?: SMSInfoServiceGetReport, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getReport(body?: SMSInfoServiceGetReport, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<any>('post',`${this.basePath}/admin/base/SMSInfoService/getReport`,
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
    public getReportAsFile(body?: SMSInfoServiceGetReportAsFile, observe?: 'body', reportProgress?: boolean): Observable<FileResponse>;
    public getReportAsFile(body?: SMSInfoServiceGetReportAsFile, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<FileResponse>>;
    public getReportAsFile(body?: SMSInfoServiceGetReportAsFile, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<FileResponse>>;
    public getReportAsFile(body?: SMSInfoServiceGetReportAsFile, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<FileResponse>('post',`${this.basePath}/admin/base/SMSInfoService/getReportAsFile`,
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
    public getReportObj(body?: SMSInfoServiceGetReportObj, observe?: 'body', reportProgress?: boolean): Observable<ICustomReport>;
    public getReportObj(body?: SMSInfoServiceGetReportObj, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ICustomReport>>;
    public getReportObj(body?: SMSInfoServiceGetReportObj, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ICustomReport>>;
    public getReportObj(body?: SMSInfoServiceGetReportObj, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<ICustomReport>('post',`${this.basePath}/admin/base/SMSInfoService/getReportObj`,
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
    public save(body?: ISMSInfo, observe?: 'body', reportProgress?: boolean): Observable<ISMSInfo>;
    public save(body?: ISMSInfo, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ISMSInfo>>;
    public save(body?: ISMSInfo, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ISMSInfo>>;
    public save(body?: ISMSInfo, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<ISMSInfo>('post',`${this.basePath}/admin/base/SMSInfoService/save`,
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
    public update(body?: ISMSInfo, observe?: 'body', reportProgress?: boolean): Observable<ISMSInfo>;
    public update(body?: ISMSInfo, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ISMSInfo>>;
    public update(body?: ISMSInfo, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ISMSInfo>>;
    public update(body?: ISMSInfo, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<ISMSInfo>('post',`${this.basePath}/admin/base/SMSInfoService/update`,
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
