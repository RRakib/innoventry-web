import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerPurchaseSummaryComponent } from './ledger-purchase-summary.component';

describe('LedgerPurchaseSummaryComponent', () => {
  let component: LedgerPurchaseSummaryComponent;
  let fixture: ComponentFixture<LedgerPurchaseSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerPurchaseSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerPurchaseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
