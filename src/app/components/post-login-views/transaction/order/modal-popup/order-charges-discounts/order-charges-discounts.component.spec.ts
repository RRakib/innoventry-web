import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderChargesDiscountsComponent } from './order-charges-discounts.component';

describe('OrderChargesDiscountsComponent', () => {
  let component: OrderChargesDiscountsComponent;
  let fixture: ComponentFixture<OrderChargesDiscountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderChargesDiscountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderChargesDiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
