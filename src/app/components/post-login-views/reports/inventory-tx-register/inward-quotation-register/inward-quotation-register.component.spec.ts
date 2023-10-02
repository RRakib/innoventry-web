import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardQuotationRegisterComponent } from './inward-quotation-register.component';

describe('InwardQuotationRegisterComponent', () => {
  let component: InwardQuotationRegisterComponent;
  let fixture: ComponentFixture<InwardQuotationRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InwardQuotationRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardQuotationRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
