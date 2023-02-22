import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerSaleSummaryComponent } from './ledger-sale-summary.component';

describe('LedgerSaleSummaryComponent', () => {
  let component: LedgerSaleSummaryComponent;
  let fixture: ComponentFixture<LedgerSaleSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerSaleSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerSaleSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
