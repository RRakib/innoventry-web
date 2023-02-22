import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
    token: string | undefined;
    redirectUrl: any;
    constructor(public router: Router, private http: HttpClient) {
        // set token if saved in local storage
        if (localStorage.getItem('authToken') != null) {
            try {
                // var currentUser = JSON.parse(localStorage.getItem('currentUser'));
                this.token = localStorage.getItem('authToken') || undefined;
                // this.token = currentUser && currentUser.token;
            } catch (e) {
                localStorage.removeItem("authToken");
            }
        }
    }

    login(userName: string, password: string, companyId: string){        

       return this.http.post(environment.apiUrl+'/auth/login', JSON.stringify({ username: userName + "@" + companyId+"$$1", password: password }));
                        
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = undefined;
        localStorage.removeItem('authToken');
        localStorage.removeItem('companyId');
        localStorage.removeItem('userName');
    }
}