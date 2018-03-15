import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseUpdateComponent } from './expense-update.component';

describe('ExpenseUpdateComponent', () => {
  let component: ExpenseUpdateComponent;
  let fixture: ComponentFixture<ExpenseUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
