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

import { LicenseActivationRequestInfo } from '../model/licenseActivationRequestInfo';
import { LicenseActivationResponse } from '../model/licenseActivationResponse';
import { LicenseDeactivationOTPResponse } from '../model/licenseDeactivationOTPResponse';
import { LicenseDeactivationRequestInfo } from '../model/licenseDeactivationRequestInfo';
import { LicenseDeactivationResponse } from '../model/licenseDeactivationResponse';
import { LicenseValidationRequestInfo } from '../model/licenseValidationRequestInfo';
import { LicenseValidationResponse } from '../model/licenseValidationResponse';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class LicenseServiceService {

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
     * activeLicenseOnInnoVentry
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public activeLicenseOnInnoVentry(body?: LicenseActivationRequestInfo, observe?: 'body', reportProgress?: boolean): Observable<LicenseActivationResponse>;
    public activeLicenseOnInnoVentry(body?: LicenseActivationRequestInfo, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<LicenseActivationResponse>>;
    public activeLicenseOnInnoVentry(body?: LicenseActivationRequestInfo, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<LicenseActivationResponse>>;
    public activeLicenseOnInnoVentry(body?: LicenseActivationRequestInfo, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<LicenseActivationResponse>('post',`${this.basePath}/public/base/LicenseService/activeLicenseOnInnoVentry`,
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
     * deactiveLicenseOnInnoVentry
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deactiveLicenseOnInnoVentry(body?: LicenseDeactivationRequestInfo, observe?: 'body', reportProgress?: boolean): Observable<LicenseDeactivationResponse>;
    public deactiveLicenseOnInnoVentry(body?: LicenseDeactivationRequestInfo, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<LicenseDeactivationResponse>>;
    public deactiveLicenseOnInnoVentry(body?: LicenseDeactivationRequestInfo, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<LicenseDeactivationResponse>>;
    public deactiveLicenseOnInnoVentry(body?: LicenseDeactivationRequestInfo, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<LicenseDeactivationResponse>('post',`${this.basePath}/public/base/LicenseService/deactiveLicenseOnInnoVentry`,
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
     * generateDeactivationOTP
     * 
     * @param productKey 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public generateDeactivationOTP(productKey?: string, observe?: 'body', reportProgress?: boolean): Observable<LicenseDeactivationOTPResponse>;
    public generateDeactivationOTP(productKey?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<LicenseDeactivationOTPResponse>>;
    public generateDeactivationOTP(productKey?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<LicenseDeactivationOTPResponse>>;
    public generateDeactivationOTP(productKey?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (productKey !== undefined && productKey !== null) {
            queryParameters = queryParameters.set('productKey', <any>productKey);
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

        return this.httpClient.request<LicenseDeactivationOTPResponse>('get',`${this.basePath}/public/base/LicenseService/generateDeactivationOTP`,
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
     * validateLicenseOnInnoVentry
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public validateLicenseOnInnoVentry(body?: LicenseValidationRequestInfo, observe?: 'body', reportProgress?: boolean): Observable<LicenseValidationResponse>;
    public validateLicenseOnInnoVentry(body?: LicenseValidationRequestInfo, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<LicenseValidationResponse>>;
    public validateLicenseOnInnoVentry(body?: LicenseValidationRequestInfo, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<LicenseValidationResponse>>;
    public validateLicenseOnInnoVentry(body?: LicenseValidationRequestInfo, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


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

        return this.httpClient.request<LicenseValidationResponse>('post',`${this.basePath}/public/base/LicenseService/validateLicenseOnInnoVentry`,
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
