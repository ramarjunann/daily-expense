import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Response } from '@angular/http';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Subscription} from 'rxjs';

// Vendor Modules
import { Angular2TokenService } from 'angular2-token';
import * as _ from 'lodash';

// Retailyoda Modules
import { ExpenseService } from '../expense.service';
import { NotificationService } from '../notification.service';
import { Expense } from '../expense';
import { Config } from '../config';

@Component({
  selector: 'app-expense-add',
  templateUrl: './expense-add.component.html',
  styleUrls: ['./expense-add.component.css'],
  providers: [
    ExpenseService,
    NotificationService,
    Config
  ]
})
export class ExpenseAddComponent implements OnInit {

   // Private properties
  public errorMessage: any;
  public formErrors = {
    'description': '',
    'amount': '',
    'category': ''
  };
  public validationMessages = {
    'description': {
      'required': 'Description is required.'
    },
    'amount': {
      'required': 'Wholesale price is required.',
      'pattern': 'Wholesale price should be number'
    },
    'category': {
      'required': 'Category is required.'
    }
  };

  // Public properties
  public expense : Expense = new Expense();
  public expenseForm: FormGroup;
  public expenseUpdateRequest: Subscription;
  private isFormSubmitted: boolean;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private tokenService: Angular2TokenService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

 public onSubmit() {
    let currentUser = this.tokenService.currentUserData;
    if(this.expenseForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.expense = this.expenseForm.value;

      this.expenseService.add(this.expense).subscribe(
        successResponse => {
          this.successHandler(successResponse);
          this.notificationService.notify('expenseAdd', 'success');
        },
        errorResponse   => {
          this.errorHandler(errorResponse);
        }
      );
  }

  // Private methods
  private buildForm(): void {
    this.expenseForm = this.fb.group({
      'description': [
        this.expense.description, [
          Validators.required
        ]
      ],
      'amount':  [
        this.expense.amount, [
          Validators.required,
          Validators.pattern(/^\d/)
        ]
      ],
      'category': [
        this.expense.category, [
          Validators.required
        ]
      ]
    });

    this.expenseForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  private onValueChanged(data?: any) {
    if (!this.expenseForm) { return; }
    const form = this.expenseForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && (this.isFormSubmitted || control.dirty) && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  private successHandler(successResponse: Response): void {
    let expense = successResponse.json();
    this.notificationService.notify('expenseAdd', 'success');
    this.router.navigate(['/expense/' + expense.id]);
  }

  private errorHandler(errorResponse: Response): void {
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.errorMessage = data.errors.join(', ')
    }
  }


}
