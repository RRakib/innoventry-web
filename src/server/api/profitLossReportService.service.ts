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
import { ProfitLossReport } from '../model/profitLossReport';
import { ProfitLossReportArgument } from '../model/profitLossReportArgument';
import { ProfitLossReportServiceGetReportAsFile } from '../model/profitLossReportServiceGetReportAsFile';
import { ProfitLossReportServiceGetReportFileStream } from '../model/profitLossReportServiceGetReportFileStream';
import { ProfitLossReportServiceGetReportObj } from '../model/profitLossReportServiceGetReportObj';
import { ProfitLossReportServiceGetReportTypeArg } from '../model/profitLossReportServiceGetReportTypeArg';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class ProfitLossReportServiceService {

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
    public getReportArg(body?: ProfitLossReportArgument, observe?: 'body', reportProgress?: boolean): Observable<ProfitLossReport>;
    public getReportArg(body?: ProfitLossReportArgument, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ProfitLossReport>>;
    public getReportArg(body?: ProfitLossReportArgument, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ProfitLossReport>>;
    public getReportArg(body?: ProfitLossReportArgument, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<ProfitLossReport>('post',`${this.basePath}/admin/accounting/ProfitLossReportService/getReport_arg`,
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
    public getReportAsFile(body?: ProfitLossReportServiceGetReportAsFile, observe?: 'body', reportProgress?: boolean): Observable<FileResponse>;
    public getReportAsFile(body?: ProfitLossReportServiceGetReportAsFile, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<FileResponse>>;
    public getReportAsFile(body?: ProfitLossReportServiceGetReportAsFile, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<FileResponse>>;
    public getReportAsFile(body?: ProfitLossReportServiceGetReportAsFile, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<FileResponse>('post',`${this.basePath}/admin/accounting/ProfitLossReportService/getReportAsFile`,
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
    public getReportFileStream(body?: ProfitLossReportServiceGetReportFileStream, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getReportFileStream(body?: ProfitLossReportServiceGetReportFileStream, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getReportFileStream(body?: ProfitLossReportServiceGetReportFileStream, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getReportFileStream(body?: ProfitLossReportServiceGetReportFileStream, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<any>('post',`${this.basePath}/admin/accounting/ProfitLossReportService/getReportFileStream`,
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
    public getReportObj(body?: ProfitLossReportServiceGetReportObj, observe?: 'body', reportProgress?: boolean): Observable<ICustomReport>;
    public getReportObj(body?: ProfitLossReportServiceGetReportObj, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ICustomReport>>;
    public getReportObj(body?: ProfitLossReportServiceGetReportObj, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ICustomReport>>;
    public getReportObj(body?: ProfitLossReportServiceGetReportObj, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<ICustomReport>('post',`${this.basePath}/admin/accounting/ProfitLossReportService/getReportObj`,
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
    public getReportObject(body?: ProfitLossReportArgument, observe?: 'body', reportProgress?: boolean): Observable<ICustomReport>;
    public getReportObject(body?: ProfitLossReportArgument, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ICustomReport>>;
    public getReportObject(body?: ProfitLossReportArgument, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ICustomReport>>;
    public getReportObject(body?: ProfitLossReportArgument, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<ICustomReport>('post',`${this.basePath}/admin/accounting/ProfitLossReportService/getReportObject`,
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
    public getReportTypeArg(body?: ProfitLossReportServiceGetReportTypeArg, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getReportTypeArg(body?: ProfitLossReportServiceGetReportTypeArg, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getReportTypeArg(body?: ProfitLossReportServiceGetReportTypeArg, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getReportTypeArg(body?: ProfitLossReportServiceGetReportTypeArg, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<any>('post',`${this.basePath}/admin/accounting/ProfitLossReportService/getReport_type_arg`,
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
