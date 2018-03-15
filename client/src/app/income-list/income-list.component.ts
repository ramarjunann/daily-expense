import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Subscription} from 'rxjs';

import {Angular2TokenService} from 'angular2-token';

import { IncomeService } from '../income.service';
import { Income } from '../income';
import { NotificationService } from '../notification.service';
import { Config } from '../config';

declare var $:any;


@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.css'],
  providers: [
    IncomeService,
    NotificationService,
    Config
  ]
})
export class IncomeListComponent implements OnInit {

  public incomes: Income[] = [];
  private incomesErrorMessage: any;
  private incomesPerPage: number = 20;
  private incomesPageNumber: number = 1;
  public incomesRequest: Subscription;

  constructor(
    private incomeService: IncomeService,
    public tokenService: Angular2TokenService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.route.params.subscribe(
        (params: any) => {
          let id : string = params.id || this.tokenService.currentUserData['id'];
          this.getIncomes(id, this.incomesPageNumber);
        }
      );
    }, 500);
  }

  private getIncomes(id: any, pageNumber: number): void {
    this.incomes = [];
    this.incomesRequest = this.incomeService.list(pageNumber, this.incomesPerPage, id).subscribe(
      successResponse => {
        let incomes: any = successResponse.json();
        this.incomes = incomes;
        this.incomesPageNumber = pageNumber;
      },
      () => {
        this.incomesErrorMessage = 'Failed to load incomes.';
      }
    );
  }

}
