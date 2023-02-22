import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaywiseLedgerBalanceComponent } from './daywise-ledger-balance.component';

describe('DaywiseLedgerBalanceComponent', () => {
  let component: DaywiseLedgerBalanceComponent;
  let fixture: ComponentFixture<DaywiseLedgerBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaywiseLedgerBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaywiseLedgerBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
