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
import { OutstandingReport } from '../model/outstandingReport';
import { OutstandingReportArgument } from '../model/outstandingReportArgument';
import { OutstandingReportSendSmsArg } from '../model/outstandingReportSendSmsArg';
import { OutstandingReportServiceGetReportAsFile } from '../model/outstandingReportServiceGetReportAsFile';
import { OutstandingReportServiceGetReportFileStream } from '../model/outstandingReportServiceGetReportFileStream';
import { OutstandingReportServiceGetReportObj } from '../model/outstandingReportServiceGetReportObj';
import { OutstandingReportServiceGetReportTypeArg } from '../model/outstandingReportServiceGetReportTypeArg';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class OutstandingReportServiceService {

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
     * getReport
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getReportArg(body?: OutstandingReportArgument, observe?: 'body', reportProgress?: boolean): Observable<OutstandingReport>;
    public getReportArg(body?: OutstandingReportArgument, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<OutstandingReport>>;
    public getReportArg(body?: OutstandingReportArgument, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<OutstandingReport>>;
    public getReportArg(body?: OutstandingReportArgument, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<OutstandingReport>('post',`${this.basePath}/admin/accounting/OutstandingReportService/getReport_arg`,
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
    public getReportAsFile(body?: OutstandingReportServiceGetReportAsFile, observe?: 'body', reportProgress?: boolean): Observable<FileResponse>;
    public getReportAsFile(body?: OutstandingReportServiceGetReportAsFile, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<FileResponse>>;
    public getReportAsFile(body?: OutstandingReportServiceGetReportAsFile, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<FileResponse>>;
    public getReportAsFile(body?: OutstandingReportServiceGetReportAsFile, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<FileResponse>('post',`${this.basePath}/admin/accounting/OutstandingReportService/getReportAsFile`,
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
     * getReportFileStream
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getReportFileStream(body?: OutstandingReportServiceGetReportFileStream, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getReportFileStream(body?: OutstandingReportServiceGetReportFileStream, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getReportFileStream(body?: OutstandingReportServiceGetReportFileStream, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getReportFileStream(body?: OutstandingReportServiceGetReportFileStream, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<any>('post',`${this.basePath}/admin/accounting/OutstandingReportService/getReportFileStream`,
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
    public getReportObj(body?: OutstandingReportServiceGetReportObj, observe?: 'body', reportProgress?: boolean): Observable<ICustomReport>;
    public getReportObj(body?: OutstandingReportServiceGetReportObj, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ICustomReport>>;
    public getReportObj(body?: OutstandingReportServiceGetReportObj, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ICustomReport>>;
    public getReportObj(body?: OutstandingReportServiceGetReportObj, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<ICustomReport>('post',`${this.basePath}/admin/accounting/OutstandingReportService/getReportObj`,
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
     * getReportObject
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getReportObject(body?: OutstandingReportArgument, observe?: 'body', reportProgress?: boolean): Observable<ICustomReport>;
    public getReportObject(body?: OutstandingReportArgument, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ICustomReport>>;
    public getReportObject(body?: OutstandingReportArgument, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ICustomReport>>;
    public getReportObject(body?: OutstandingReportArgument, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<ICustomReport>('post',`${this.basePath}/admin/accounting/OutstandingReportService/getReportObject`,
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
     * getReport
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getReportTypeArg(body?: OutstandingReportServiceGetReportTypeArg, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getReportTypeArg(body?: OutstandingReportServiceGetReportTypeArg, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getReportTypeArg(body?: OutstandingReportServiceGetReportTypeArg, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getReportTypeArg(body?: OutstandingReportServiceGetReportTypeArg, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<any>('post',`${this.basePath}/admin/accounting/OutstandingReportService/getReport_type_arg`,
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
     * sendSMS
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public sendSMS(body?: OutstandingReportSendSmsArg, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public sendSMS(body?: OutstandingReportSendSmsArg, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public sendSMS(body?: OutstandingReportSendSmsArg, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public sendSMS(body?: OutstandingReportSendSmsArg, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<string>('post',`${this.basePath}/admin/accounting/OutstandingReportService/sendSMS`,
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
