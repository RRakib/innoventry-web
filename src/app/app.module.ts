import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavService } from './services/nav.service';
import { LoginComponent } from './components/login/login.component';
import { AuthenticationService } from './services/authentication.service';
import { RegistrationComponent } from './components/registration/registration.component';
import { AngularMaterialModule } from './shared/modules/angular-material.module';
import { BASE_PATH, CredentialsServiceService,  } from 'src/server';
import { environment } from 'src/environments/environment';
import { HttpAuthInterceptor } from './services/http.interceptor';
import { DatabaseServiceService } from 'src/server/api/databaseService.service';
import { AuthGuard } from './services/auth.guard';
import { PartnerLoginComponent } from './components/login/partner-login/partner-login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    PartnerLoginComponent        
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  providers: [
    { provide: BASE_PATH, useValue: environment.apiUrl },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptor,
      multi: true
    },
    NavService,AuthGuard, AuthenticationService, DatabaseServiceService,
    CredentialsServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
