import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { Angular2TokenService } from 'angular2-token';

import {UserService} from "./user.service";
import { User } from './user';
import { Config } from './config';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    UserService
  ]
})
export class AppComponent {

  constructor(
    private userService: UserService,
    public tokenService: Angular2TokenService,
    private router: Router
  ) {
    this.tokenService.init({
      apiPath:                    Config.getEnvironmentVariable('baseApiUrl'),

      signInPath:                 'user/sign_in',
      signInStoredUrlStorageKey:  null,

      signOutPath:                'user/sign_out',
      validateTokenPath:          'user/validate_token',

      registerAccountPath:        'user/sign_up',
      deleteAccountPath:          'sign_out',
      registerAccountCallback:    window.location.href,

      updatePasswordPath:         'reset_password',
      resetPasswordPath:          'generate_reset_password_token',
      resetPasswordCallback:      window.location.href,


      globalOptions: {
        headers: {
          'Content-Type':     'application/json',
          'Accept':           'application/json'
        }
      }
    });
  }

  onLogout(event) {
    event.preventDefault();
    this.userService.logout().subscribe(
      successResponse => {
        this.router.navigate(['/']);
      },
    );
  }

  get currentUser() {
    return this.tokenService.currentUserData;
  }

}
