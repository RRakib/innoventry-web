import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnRegisterComponent } from './sale-return-register.component';

describe('SaleReturnRegisterComponent', () => {
  let component: SaleReturnRegisterComponent;
  let fixture: ComponentFixture<SaleReturnRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReturnRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReturnRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
