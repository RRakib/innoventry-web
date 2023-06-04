import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  // Start Point
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { 
    path: 'main',
    canActivate: [AuthGuard],
    loadChildren: () => import(`./components/post-login-views/welcome.module`).then(
      module => module.WelcomeModule
    )
  },
  { 
    path: 'partnerMainView',
    canActivate: [AuthGuard],
    loadChildren: () => import(`./components/partner-post-login-views/partner-welcome.module`).then(
      module => module.PartnerWelcomeModule
    )
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
