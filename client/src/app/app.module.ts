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
import {NgxPaginationModule} from 'ngx-pagination'

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomeAddComponent } from './income-add/income-add.component';
import { IncomeListComponent } from './income-list/income-list.component';
import { IncomeDetailComponent } from './income-detail/income-detail.component';
import { ExpenseAddComponent } from './expense-add/expense-add.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserRegistrationComponent,
    DashboardComponent,
    IncomeAddComponent,
    IncomeListComponent,
    IncomeDetailComponent,
    ExpenseAddComponent,
    ExpenseListComponent,
    ExpenseDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
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
      },
      {
        path: 'income/add',
        component: IncomeAddComponent
      },
      {
        path: 'income/:id',
        component: IncomeDetailComponent
      },
      {
        path: 'expense/add',
        component: ExpenseAddComponent
      },
      {
        path: 'expense/:id',
        component: ExpenseDetailComponent
      },
      {
        path: 'incoming/list',
        component: IncomeListComponent
      },
      {
        path: 'expensing/list',
        component: ExpenseListComponent
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
