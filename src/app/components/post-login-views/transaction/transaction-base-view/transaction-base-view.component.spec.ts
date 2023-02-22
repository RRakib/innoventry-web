import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionBaseViewComponent } from './transaction-base-view.component';

describe('TransactionBaseViewComponent', () => {
  let component: TransactionBaseViewComponent;
  let fixture: ComponentFixture<TransactionBaseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionBaseViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionBaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
