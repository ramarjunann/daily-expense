import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

import { Angular2TokenService } from 'angular2-token';

import { Config } from './config';
import { Expense } from './expense';
declare var $: any;

@Injectable()
export class ExpenseService {

  constructor(private tokenService: Angular2TokenService, config: Config) { }
  private expenseApiURL = 'expenses';


  add(expense: Expense): Observable<any> {
    return this.tokenService.post(this.expenseApiURL , expense)
  }

  show(id: string): Observable<any> {
    return this.tokenService.get(this.expenseApiURL + '/' + id);
  }

  remove(id: string): Observable<any> {
    return this.tokenService.delete(this.expenseApiURL + '/' + id);
  }

  update(id: string, expense: Expense): Observable<any> {
    return this.tokenService.put(this.expenseApiURL + '/' + id, expense);
  }

  list(pageNumber: number, expensesPerPage: number, userId: string):  Observable<any> {
    let param: any  = {
      page: pageNumber,
      per_page: expensesPerPage,
      user_id: userId
    };
    let queryParams = $.param(param);
    return this.tokenService.get(this.expenseApiURL + '?' + queryParams);
  }

}
