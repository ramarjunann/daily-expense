import { Injectable } from '@angular/core';
import { Angular2TokenService} from 'angular2-token';
import {Observable} from "rxjs/Observable";
import { Http } from '@angular/http';
import { Config } from './config';
import { User } from './user';

@Injectable()
export class UserService {

  constructor(private tokenService: Angular2TokenService, private http: Http) { }

  register(user: User): Observable<any> {
    return this.tokenService.registerAccount({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      passwordConfirmation: user.password_confirmation
    });
  }

  login(user: User): Observable<any> {
    return this.tokenService.signIn({
      email: user.email,
      password: user.password
    });
  }

  logout(): Observable<any> {
    return this.tokenService.signOut();
  }

}
