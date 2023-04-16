import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderServicesComponent } from './order-services.component';

describe('OrderServicesComponent', () => {
  let component: OrderServicesComponent;
  let fixture: ComponentFixture<OrderServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
