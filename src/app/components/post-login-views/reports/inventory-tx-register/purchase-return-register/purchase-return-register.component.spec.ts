import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReturnRegisterComponent } from './purchase-return-register.component';

describe('PurchaseReturnRegisterComponent', () => {
  let component: PurchaseReturnRegisterComponent;
  let fixture: ComponentFixture<PurchaseReturnRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseReturnRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseReturnRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
