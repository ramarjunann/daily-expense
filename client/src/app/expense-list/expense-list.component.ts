import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Subscription} from 'rxjs';

import {Angular2TokenService} from 'angular2-token';

import { ExpenseService } from '../expense.service';
import { Expense } from '../expense';
import { NotificationService } from '../notification.service';
import { Config } from '../config';

declare var $:any;


@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css'],
  providers: [
    ExpenseService,
    NotificationService,
    Config
  ]
})
export class ExpenseListComponent implements OnInit {

  public expenses: Expense[] = [];
  private expensesErrorMessage: any;
  private expensesPerPage: number = 20;
  private expensesPageNumber: number = 1;
  public expensesRequest: Subscription;

  constructor(
    private expenseService: ExpenseService,
    public tokenService: Angular2TokenService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.route.params.subscribe(
        (params: any) => {
          let id : string = params.id || this.tokenService.currentUserData['id'];
          this.getExpenses(id, this.expensesPageNumber);
        }
      );
    }, 500);
  }

  private getExpenses(id: any, pageNumber: number): void {
    this.expenses = [];
    this.expensesRequest = this.expenseService.list(pageNumber, this.expensesPerPage, id).subscribe(
      successResponse => {
        let expenses: any = successResponse.json();
        this.expenses = expenses;
        this.expensesPageNumber = pageNumber;
      },
      () => {
        this.expensesErrorMessage = 'Failed to load expenses.';
      }
    );
  }

}
