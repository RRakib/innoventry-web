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
import { JFormDetail } from '../model/jFormDetail';
import { JFormDetailReportArgument } from '../model/jFormDetailReportArgument';
import { JFormDetailReportServiceGetReportAsFile } from '../model/jFormDetailReportServiceGetReportAsFile';
import { JFormDetailReportServiceGetReportFileStream } from '../model/jFormDetailReportServiceGetReportFileStream';
import { JFormDetailReportServiceGetReportObj } from '../model/jFormDetailReportServiceGetReportObj';
import { JFormDetailReportServiceGetReportTypeArg } from '../model/jFormDetailReportServiceGetReportTypeArg';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class JFormDetailReportServiceService {

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
     * getJFromDetail
     * 
     * @param mandi 
     * @param dateFrom 
     * @param dateTo 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getJFromDetail(mandi?: number, dateFrom?: string, dateTo?: string, observe?: 'body', reportProgress?: boolean): Observable<JFormDetail>;
    public getJFromDetail(mandi?: number, dateFrom?: string, dateTo?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<JFormDetail>>;
    public getJFromDetail(mandi?: number, dateFrom?: string, dateTo?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<JFormDetail>>;
    public getJFromDetail(mandi?: number, dateFrom?: string, dateTo?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {




        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (mandi !== undefined && mandi !== null) {
            queryParameters = queryParameters.set('mandi', <any>mandi);
        }
        if (dateFrom !== undefined && dateFrom !== null) {
            queryParameters = queryParameters.set('dateFrom', <any>dateFrom);
        }
        if (dateTo !== undefined && dateTo !== null) {
            queryParameters = queryParameters.set('dateTo', <any>dateTo);
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

        return this.httpClient.request<JFormDetail>('get',`${this.basePath}/admin/grainagent/JFormDetailReportService/getJFromDetail`,
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
    public getReportArg(body?: JFormDetailReportArgument, observe?: 'body', reportProgress?: boolean): Observable<JFormDetail>;
    public getReportArg(body?: JFormDetailReportArgument, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<JFormDetail>>;
    public getReportArg(body?: JFormDetailReportArgument, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<JFormDetail>>;
    public getReportArg(body?: JFormDetailReportArgument, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<JFormDetail>('post',`${this.basePath}/admin/grainagent/JFormDetailReportService/getReport_arg`,
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
    public getReportAsFile(body?: JFormDetailReportServiceGetReportAsFile, observe?: 'body', reportProgress?: boolean): Observable<FileResponse>;
    public getReportAsFile(body?: JFormDetailReportServiceGetReportAsFile, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<FileResponse>>;
    public getReportAsFile(body?: JFormDetailReportServiceGetReportAsFile, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<FileResponse>>;
    public getReportAsFile(body?: JFormDetailReportServiceGetReportAsFile, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<FileResponse>('post',`${this.basePath}/admin/grainagent/JFormDetailReportService/getReportAsFile`,
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
    public getReportFileStream(body?: JFormDetailReportServiceGetReportFileStream, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getReportFileStream(body?: JFormDetailReportServiceGetReportFileStream, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getReportFileStream(body?: JFormDetailReportServiceGetReportFileStream, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getReportFileStream(body?: JFormDetailReportServiceGetReportFileStream, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<any>('post',`${this.basePath}/admin/grainagent/JFormDetailReportService/getReportFileStream`,
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
    public getReportObj(body?: JFormDetailReportServiceGetReportObj, observe?: 'body', reportProgress?: boolean): Observable<ICustomReport>;
    public getReportObj(body?: JFormDetailReportServiceGetReportObj, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ICustomReport>>;
    public getReportObj(body?: JFormDetailReportServiceGetReportObj, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ICustomReport>>;
    public getReportObj(body?: JFormDetailReportServiceGetReportObj, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<ICustomReport>('post',`${this.basePath}/admin/grainagent/JFormDetailReportService/getReportObj`,
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
    public getReportObject(body?: JFormDetailReportArgument, observe?: 'body', reportProgress?: boolean): Observable<ICustomReport>;
    public getReportObject(body?: JFormDetailReportArgument, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ICustomReport>>;
    public getReportObject(body?: JFormDetailReportArgument, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ICustomReport>>;
    public getReportObject(body?: JFormDetailReportArgument, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<ICustomReport>('post',`${this.basePath}/admin/grainagent/JFormDetailReportService/getReportObject`,
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
    public getReportTypeArg(body?: JFormDetailReportServiceGetReportTypeArg, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getReportTypeArg(body?: JFormDetailReportServiceGetReportTypeArg, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getReportTypeArg(body?: JFormDetailReportServiceGetReportTypeArg, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getReportTypeArg(body?: JFormDetailReportServiceGetReportTypeArg, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<any>('post',`${this.basePath}/admin/grainagent/JFormDetailReportService/getReport_type_arg`,
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
