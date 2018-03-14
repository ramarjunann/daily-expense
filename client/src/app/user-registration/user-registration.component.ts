import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Response } from '@angular/http';
import {Angular2TokenService} from 'angular2-token';
import {Subscription} from 'rxjs';

import { User } from '../user';
import { UserService } from '../user.service';
import { CustomValidators } from '../custom-validators';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
  providers: [
    UserService
  ]
})
export class UserRegistrationComponent implements OnInit {

  private buttonsDisabled: boolean = false;
  private userType: string;
  private validationMessages = {

    'first_name': {
      'required': 'First Name is required.',
      'maxlength': 'First Name is too long'
    },

    'last_name': {
      'required': 'Last Name is required.',
      'maxlength': 'Last Name is too long'
    },

    'email': {
      'required': 'Email is required.',
      'pattern': 'Email is invalid',
    },
    'password': {
      'required': 'Password is required',
      'minlength': 'Password is too short',
      'maxlength': 'Password is too long'
    },
    'password_confirmation': {
      'required': 'Password confirmation required',
      'mismatch': 'Password does not match confirmation'
    }
  };
  public registerRequest: Subscription;
  private isFormSubmitted: boolean;

  public errorMessage: any;
  public formErrors = {
    'first_name': '',
    'last_name': '',
    'email': '',
    'password': '',
    'password_confirmation': ''
  };

  user = new User('', '', '', '','','');
  userForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenService: Angular2TokenService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  onSubmit(): void  {
    if(this.userForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.user = this.userForm.value;
    this.userService.register(this.userForm.value).subscribe(
      () => {
        this.autoLogin();
      },
      errorResponse   => this.displayErrors(errorResponse)
    )
  }

  private displayErrors(errorResponse: Response): void {
    this.buttonsDisabled = false;
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.errorMessage = data.errors.join(', ')
    }
  }

  private autoLogin(): void {
    this.buttonsDisabled = false;
    this.userService.login(this.user).subscribe(
      successResponse => {
        let queryparams: any = {queryParams: {id: this.tokenService.currentUserData.id}};
        this.router.navigate( ['/dashboard']);
      },
      errorResponse => {
        // TODO handle auto login failure
      }
    );
  }


  private buildForm(): void {
    this.userForm = this.formBuilder.group({
      'first_name': [
        this.user.first_name, [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],

      'last_name': [
        this.user.last_name, [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],

      'email': [
        this.user.email, [
          Validators.required,
          Validators.pattern("\\S+@\\S+\\.\\S+")
        ]
      ],

      'password': [
        this.user.password, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ]
      ],
      'password_confirmation': [
        this.user.password_confirmation,
        Validators.required,
      ]
    }, {validator: CustomValidators.passwordMatchValidator});

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  private onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;

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

}
