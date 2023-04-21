import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTransportDetailComponent } from './order-transport-detail.component';

describe('OrderTransportDetailComponent', () => {
  let component: OrderTransportDetailComponent;
  let fixture: ComponentFixture<OrderTransportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderTransportDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTransportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
