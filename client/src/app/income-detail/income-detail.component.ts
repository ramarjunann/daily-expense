import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import {Subscription} from 'rxjs';

import {Angular2TokenService} from 'angular2-token'

import { IncomeService } from '../income.service';
import { NotificationService } from '../notification.service';
import { Income } from '../income';
import { Config } from '../config';

@Component({
  selector: 'app-income-detail',
  templateUrl: './income-detail.component.html',
  styleUrls: ['./income-detail.component.css'],
  providers: [
    IncomeService,
    NotificationService,
    Config
  ]
})
export class IncomeDetailComponent implements OnInit {

  public income: Income;
  public errorMessage: any;

  constructor(
    public tokenService: Angular2TokenService,
    private incomeService: IncomeService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    public location: Location
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: any) => {
        let id : string = params.id;
        this.getIncome(id);
      }
    );
  }

  private getIncome(id: string): void {
    this.incomeService.show(id).subscribe(
      successResponse => {
        this.income = successResponse.json();
      },
      () => {
        this.errorMessage = 'Failed to load income.';
      }
    );
  }

  public removeIncome(income: any): void {
    this.notificationService.confirm('incomeRemove',
      () => {
        console.log('ram');
        return this.incomeService.remove(income.id).toPromise();
      }
      ,
      () => {
        this.notificationService.notify('incomeRemove', 'success');
        this.router.navigate(['/incoming/list']);
      },
      (dismiss: string) => {
        if(['cancel', 'timer', 'close', 'overlay'].indexOf(dismiss) == -1) {
          this.notificationService.notify('incomeRemove', 'error');
        }
      }
    );
  }

}
