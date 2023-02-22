import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPurchaseRateVariationAnalysisComponent } from './item-purchase-rate-variation-analysis.component';

describe('ItemPurchaseRateVariationAnalysisComponent', () => {
  let component: ItemPurchaseRateVariationAnalysisComponent;
  let fixture: ComponentFixture<ItemPurchaseRateVariationAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemPurchaseRateVariationAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPurchaseRateVariationAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
