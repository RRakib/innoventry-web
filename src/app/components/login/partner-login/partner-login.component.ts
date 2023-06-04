import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'partner-login',
  templateUrl: './partner-login.component.html',
  styleUrls: ['./partner-login.component.css']
})
export class PartnerLoginComponent implements OnInit {

  partnerLoginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.partnerLoginForm = this.formBuilder.group({      
      username: [null, [Validators.required]],
      password: [null, Validators.required],
    });
  }

  doPartnerlogin() : void{
    let username = this.partnerLoginForm!.get("username")!.value;
    let password = this.partnerLoginForm!.get("password")!.value;

    this.partnerLoginForm.markAllAsTouched();
    if (this.partnerLoginForm.valid) {
      this.authenticationService.login(username, password, "SOLPRO")
        .subscribe({
          next: (data) => {
            // login successful if there's a  token in the response
            let userData = JSON.parse(JSON.stringify(data));
            // var authToken = response.token;
            var authToken = userData.token;
            if (authToken) {
              // store user details and  token in local storage to keep user logged in between page refreshes
              localStorage.setItem('authToken', authToken);
              localStorage.setItem('userName', username);
            }
          },
          error: (err) => { }
      });
    }
  }

  newPartnerRegistration() : void{
    window.open(environment.bePartnerURL, '_blank')?.focus(); 
  }

}
