import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaywiseLedgerGroupBalanceComponent } from './daywise-ledger-group-balance.component';

describe('DaywiseLedgerGroupBalanceComponent', () => {
  let component: DaywiseLedgerGroupBalanceComponent;
  let fixture: ComponentFixture<DaywiseLedgerGroupBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaywiseLedgerGroupBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaywiseLedgerGroupBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
