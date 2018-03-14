import { Component, OnInit, Input } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { User } from '../user';

declare var $:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
  ]
})
export class DashboardComponent implements OnInit {

  constructor(
    public tokenService: Angular2TokenService
  ) { }

  ngOnInit() {

  }

}
