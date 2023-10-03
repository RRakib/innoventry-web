import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardQuotationComponent } from './inward-quotation.component';

describe('InwardQuotationComponent', () => {
  let component: InwardQuotationComponent;
  let fixture: ComponentFixture<InwardQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InwardQuotationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
