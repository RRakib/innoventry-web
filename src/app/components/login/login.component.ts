import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { CredentialsServiceService } from 'src/server';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  loginForm!: FormGroup;

  forgotPasswordForm!: FormGroup;
  forgotCompanyIdForm!: FormGroup;

  currentView : string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private credentialsServiceService: CredentialsServiceService,
    private _snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.authenticationService.logout();

    this.loginForm = this.formBuilder.group({
      companyId: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, Validators.required],
    });
  }


  login() {

    let companyId = this.loginForm!.get("companyId")!.value.replace(/\s/g, "");
    let username = this.loginForm!.get("username")!.value.replace(/\s/g, "");
    let password = this.loginForm!.get("password")!.value.replace(/\s/g, "");

    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {

      this.authenticationService.login(username.trim(), password, companyId)
        .subscribe({
          next: (data) => {
            // login successful if there's a  token in the response
            let userData = JSON.parse(JSON.stringify(data));
            // var authToken = response.token;
            var authToken = userData.token;
            if (authToken) {
              // store user details and  token in local storage to keep user logged in between page refreshes
              localStorage.setItem('authToken', authToken);
              localStorage.setItem('companyId', companyId);
              localStorage.setItem('userName', username);
            }

            this.router.navigate(['/main']);
          },
          error: () => {
                       
          }
        }
        );

    }
  }

  backToLoginView(){
    this.currentView = "LoginView";
  }

  enableCompanyUsernameView(){
    this.forgotCompanyIdForm = this.formBuilder.group({
      emailMobile: ['', [Validators.required]],
    })
    this.currentView = "ForgotCompanyUserName";
  }

  enableForgotPasswordView(){

    this.forgotPasswordForm = this.formBuilder.group({
      companyId: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]]
    })
    this.currentView = "ForgotPasswordView";
  }

  resetPassword(){
    this.forgotPasswordForm.markAllAsTouched();

    if(this.forgotPasswordForm.valid) {
      this.credentialsServiceService.resetPassword(
        this.forgotPasswordForm.controls["companyId"].value,
        this.forgotPasswordForm.controls["email"].value,
        this.forgotPasswordForm.controls["userName"].value,
      ).subscribe({
        next: (data) => {
          if(data.status && data.message) {
            this._snackBar.open(data.message,'Close', {
              duration: 2000
            });      
          }else{
            this._snackBar.open("Your Request Has Been Processed ,Details Has Been Sent By Email",'Close', {     
              duration: 2000
            });      
          }
          
          this.currentView = "LoginView";
        }
      });  
    }
  }

  getCompanyIdUsername(){
    this.forgotCompanyIdForm.markAllAsTouched();
    if(this.forgotCompanyIdForm.valid){
      let emailPattern=/^(([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$))/;
      let mobilePattern= /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

      if(emailPattern.test(this.forgotCompanyIdForm.controls["emailMobile"].value)){
        this.credentialsServiceService.forgotCompanyId(this.forgotCompanyIdForm.controls["emailMobile"].value).subscribe({
          next: (data) => {
            if(data.status && data.message) {
              this._snackBar.open(data.message,'Close', {
                duration: 2000
              });      
            }else{
              this._snackBar.open("Your Request Has Been Processed ,Details Has Been Sent By Email",'Close', {     
                duration: 2000
              });      
            }
            
            this.currentView = "LoginView";
          }
        });
      }else if(mobilePattern.test(this.forgotCompanyIdForm.controls["emailMobile"].value)){
        this.credentialsServiceService.forgotCompanyIdMobileNo(this.forgotCompanyIdForm.controls["emailMobile"].value).subscribe({
          next: (data) => {
            if(data.status && data.message) {
              this._snackBar.open(data.message,'Close', {
                duration: 2000
              });      
            }else{
              this._snackBar.open("Your Request Has Been Processed ,Details Has Been Sent By Email",'Close', {     
                duration: 2000
              });      
            }
            
            this.currentView = "LoginView";
          }
        });
      }
    }
  }


  newRegistration(){
    this.router.navigate(['/register']);
  }

}
