import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Response } from '@angular/http';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Subscription} from 'rxjs';

// Vendor Modules
import { Angular2TokenService } from 'angular2-token';
import * as _ from 'lodash';

import { IncomeService } from '../income.service';
import { NotificationService } from '../notification.service';
import { Income } from '../income';
import { Config } from '../config';


@Component({
  selector: 'app-income-add',
  templateUrl: './income-add.component.html',
  styleUrls: ['./income-add.component.css'],
  providers: [
    IncomeService,
    NotificationService,
    Config
  ]
})
export class IncomeAddComponent implements OnInit {

   // Private properties
  public errorMessage: any;
  public formErrors = {
    'description': '',
    'amount': ''
  };
  public validationMessages = {
    'description': {
      'required': 'Description is required.'
    },
    'amount': {
      'required': 'Amount is required.',
      'pattern': 'Amount should be number'
    }
  };

  // Public properties
  public income : Income = new Income();
  public incomeForm: FormGroup;
  private isFormSubmitted: boolean;

  constructor(
    private fb: FormBuilder,
    private incomeService: IncomeService,
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
    if(this.incomeForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.income = this.incomeForm.value;
      console.log('32111')
      this.incomeService.add(this.income).subscribe(
        successResponse => {
          this.successHandler(successResponse);
        },
        errorResponse   => {
          this.errorHandler(errorResponse);
        }
      );
  }

  // Private methods
  private buildForm(): void {
    this.incomeForm = this.fb.group({
      'description': [
        this.income.description, [
          Validators.required
        ]
      ],
      'amount':  [
        this.income.amount, [
          Validators.required,
          Validators.pattern(/^\d/)
        ]
      ]
    });

    this.incomeForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  private onValueChanged(data?: any) {
    if (!this.incomeForm) { return; }
    const form = this.incomeForm;

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
    let income = successResponse.json();
    this.notificationService.notify('incomeAdd', 'success');
    this.router.navigate(['/income/' + income.id]);
  }

  private errorHandler(errorResponse: Response): void {
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.errorMessage = data.errors.join(', ')
    }
  }

  public onIncomeCancel(): void {
    this.router.navigate(['/incoming/list']);
  }

}
