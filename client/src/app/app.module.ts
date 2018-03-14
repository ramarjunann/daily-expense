import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  LocationStrategy,
  HashLocationStrategy
} from '@angular/common';
import { Angular2TokenService } from 'angular2-token';
import { AuthenticatedHttpService } from './authenticated-http.service';
import { UserService } from './user.service';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserRegistrationComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'user/register',
        component: UserRegistrationComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [Angular2TokenService]
      }
    ])
  ],
  providers: [Angular2TokenService,
               UserService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: Http, useClass: AuthenticatedHttpService },
    UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
