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

import { IAttribute } from '../model/iAttribute';
import { IBillingGroup } from '../model/iBillingGroup';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class TaxConfigurationServiceService {

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
     * getDefaultPurchaseBillingGroup
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getDefaultPurchaseBillingGroup(observe?: 'body', reportProgress?: boolean): Observable<IBillingGroup>;
    public getDefaultPurchaseBillingGroup(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<IBillingGroup>>;
    public getDefaultPurchaseBillingGroup(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<IBillingGroup>>;
    public getDefaultPurchaseBillingGroup(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<IBillingGroup>('get',`${this.basePath}/admin/taxsupport/TaxConfigurationService/getDefaultPurchaseBillingGroup`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * getDefaultSaleBillingGroup
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getDefaultSaleBillingGroup(observe?: 'body', reportProgress?: boolean): Observable<IBillingGroup>;
    public getDefaultSaleBillingGroup(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<IBillingGroup>>;
    public getDefaultSaleBillingGroup(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<IBillingGroup>>;
    public getDefaultSaleBillingGroup(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<IBillingGroup>('get',`${this.basePath}/admin/taxsupport/TaxConfigurationService/getDefaultSaleBillingGroup`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * getInterStateBillingGroupsForAutoTaxClass
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getInterStateBillingGroupsForAutoTaxClass(observe?: 'body', reportProgress?: boolean): Observable<Array<IBillingGroup>>;
    public getInterStateBillingGroupsForAutoTaxClass(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<IBillingGroup>>>;
    public getInterStateBillingGroupsForAutoTaxClass(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<IBillingGroup>>>;
    public getInterStateBillingGroupsForAutoTaxClass(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<Array<IBillingGroup>>('get',`${this.basePath}/admin/taxsupport/TaxConfigurationService/getInterStateBillingGroupsForAutoTaxClass`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * getIntraStateBillingGroupsForAutoTaxClass
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getIntraStateBillingGroupsForAutoTaxClass(observe?: 'body', reportProgress?: boolean): Observable<Array<IBillingGroup>>;
    public getIntraStateBillingGroupsForAutoTaxClass(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<IBillingGroup>>>;
    public getIntraStateBillingGroupsForAutoTaxClass(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<IBillingGroup>>>;
    public getIntraStateBillingGroupsForAutoTaxClass(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<Array<IBillingGroup>>('get',`${this.basePath}/admin/taxsupport/TaxConfigurationService/getIntraStateBillingGroupsForAutoTaxClass`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * getItemAttributes
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getItemAttributes(observe?: 'body', reportProgress?: boolean): Observable<Array<IAttribute>>;
    public getItemAttributes(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<IAttribute>>>;
    public getItemAttributes(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<IAttribute>>>;
    public getItemAttributes(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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

        return this.httpClient.request<Array<IAttribute>>('get',`${this.basePath}/admin/taxsupport/TaxConfigurationService/getItemAttributes`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
