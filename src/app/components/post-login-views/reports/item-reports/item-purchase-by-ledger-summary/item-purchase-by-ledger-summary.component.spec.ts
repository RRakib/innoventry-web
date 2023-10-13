import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPurchaseByLedgerSummaryComponent } from './item-purchase-by-ledger-summary.component';

describe('ItemPurchaseByLedgerSummaryComponent', () => {
  let component: ItemPurchaseByLedgerSummaryComponent;
  let fixture: ComponentFixture<ItemPurchaseByLedgerSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemPurchaseByLedgerSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPurchaseByLedgerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
