import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {

    verticalPosition: MatSnackBarVerticalPosition = 'top';
    horizontalPosition: MatSnackBarHorizontalPosition = 'end';    

    constructor(private _snackBar: MatSnackBar,private router: Router) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = localStorage.getItem('authToken');
        req = req.clone({
            setHeaders: {
                'X-Authorization': "Bearer " + authToken,
                'Content-Type': 'application/json'
            }
        });
        return next.handle(req).pipe(

            /**
             * catch error handles all the kind of response errors.
             * 1. If error in response. E.g. Not a json response format.
             * 2. If 404 or any other Http Error Status code is returned.
            */
            catchError((err : HttpErrorResponse) => {
                if (404 === err.status) { // Show Snack Bar only in case of 404 error.
                    this._snackBar.open(err.error, 'Dismiss', {
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        duration: 2000,
                    });
                }  
                
                if(401 == err.status) {
                    this._snackBar.open('Authentication failed', 'Dismiss', {
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        duration: 2000,
                    });

                    localStorage.clear();
                    this.router.navigate(['/login']);
                }

              return throwError(() => new Error(err.error)); // This is handled by error callback of subscribe method of API call.
            })
        );
    }
}