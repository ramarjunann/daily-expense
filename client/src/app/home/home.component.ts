import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Response } from '@angular/http';
import { Angular2TokenService } from 'angular2-token';
import { Subscription } from 'rxjs';

import { User } from '../user';
import {UserService} from "../user.service";

declare var $:any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    UserService
  ]
})
export class HomeComponent implements OnInit {

  private validationMessages = {
    'email': {
      'required': 'Email is required.',
      'pattern': 'Email is invalid',
    },
    'password': {
      'required': 'Password is required',
    }
  };
  private isFormSubmitted: boolean;

  public loginRequest: Subscription;
  public errorMessage: any;
  public formErrors = {
    'email': '',
    'password': '',
  };

  user = new User();
  loginForm: FormGroup;

  constructor(
    public tokenService: Angular2TokenService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.route.queryParams.subscribe(
      (params) => {
        if(params['forceLogin']) {
          this.tokenService.signOut();
        }
      }
    );
    setTimeout(() => {
      if(this.tokenService.userSignedIn()){
        this.navigateFromHome();
      }
    }, 500);
  }

  onSubmit(): void {
    if(this.loginForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.user = this.loginForm.value;

    this.userService.login(this.user).subscribe(
      () => this.navigateFromHome(),
      errorResponse   => this.displayErrors(errorResponse)
    );
  }

  private navigateFromHome(): void {
    const user: any = this.tokenService.currentUserData;

    if (user) {
      if (user) {
        this.router.navigate(['dashboard']);
      }else {
        this.router.navigate(['/product/list']);
      }
    }
  }

  private displayErrors(errorResponse: Response): void {
    let json = errorResponse.json();

    if(json.errors.length > 0) {
      this.errorMessage = json.errors.join(', ')
    }
  }

  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      'email': [
        this.user.email, [
          Validators.required,
          Validators.pattern("\\S+@\\S+\\.\\S+")
        ]
      ],
      'password': [this.user.password, Validators.required]
    });

    this.loginForm.valueChanges.subscribe(() => this.onValueChanged());

    this.onValueChanged();
  }

  onValueChanged() {
    if (!this.loginForm) { return; }
    const form = this.loginForm;

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
