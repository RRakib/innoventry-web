import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from 'src/app/services/authentication.service';

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

  currentView : string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver) {

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
    this.currentView = "ForgotCompanyUserName";
  }

  enableForgotPasswordView(){
    this.currentView = "ForgotPasswordView";
  }


  newRegistration(){
    this.router.navigate(['/register']);
  }

}
