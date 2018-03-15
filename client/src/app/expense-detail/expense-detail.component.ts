import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import {Subscription} from 'rxjs';

import {Angular2TokenService} from 'angular2-token'

import { ExpenseService } from '../expense.service';
import { NotificationService } from '../notification.service';
import { Expense } from '../expense';
import { Config } from '../config';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.css'],
  providers: [
    ExpenseService,
    NotificationService,
    Config
  ]
})
export class ExpenseDetailComponent implements OnInit {

  public expense: Expense;
  public errorMessage: any;

  constructor(
    public tokenService: Angular2TokenService,
    private expenseService: ExpenseService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    public location: Location
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: any) => {
        let id : string = params.id;
        this.getExpense(id);
      }
    );
  }

  private getExpense(id: string): void {
    this.expenseService.show(id).subscribe(
      successResponse => {
        this.expense = successResponse.json();
      },
      () => {
        this.errorMessage = 'Failed to load expense.';
      }
    );
  }

  public removeExpense(expense: any): void {
    this.notificationService.confirm('expenseRemove',
      () => {
        return this.expenseService.remove(this.expense.id).toPromise();
      }
      ,
      () => {
        this.notificationService.notify('expenseRemove', 'success');
        this.router.navigate(['/expensing/list']);
      },
      (dismiss: string) => {
        if(['cancel', 'timer', 'close', 'overlay'].indexOf(dismiss) == -1) {
          this.notificationService.notify('expenseRemove', 'error');
        }
      }
    );
  }

}
