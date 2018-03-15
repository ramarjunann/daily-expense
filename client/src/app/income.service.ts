import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

import { Angular2TokenService } from 'angular2-token';

import { Config } from './config';
import { Income } from './income'
declare var $: any;

@Injectable()
export class IncomeService {

  constructor(private tokenService: Angular2TokenService, config: Config) { }
  private incomeApiURL = 'incomes';

  add(income: Income): Observable<any> {
    return this.tokenService.post(this.incomeApiURL , income)
  }

  show(id: string): Observable<any> {
    return this.tokenService.get(this.incomeApiURL + '/' + id);
  }

  remove(id: string): Observable<any> {
    return this.tokenService.delete(this.incomeApiURL + '/' + id);
  }

  list(pageNumber: number, incomesPerPage: number, userId: string):  Observable<any> {
    let param: any  = {
      page: pageNumber,
      per_page: incomesPerPage,
      user_id: userId
    };
    let queryParams = $.param(param);
    return this.tokenService.get(this.incomeApiURL + '?' + queryParams);
  }


}
