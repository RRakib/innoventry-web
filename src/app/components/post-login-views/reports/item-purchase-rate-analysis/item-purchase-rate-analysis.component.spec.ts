import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPurchaseRateAnalysisComponent } from './item-purchase-rate-analysis.component';

describe('ItemPurchaseRateAnalysisComponent', () => {
  let component: ItemPurchaseRateAnalysisComponent;
  let fixture: ComponentFixture<ItemPurchaseRateAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemPurchaseRateAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPurchaseRateAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
