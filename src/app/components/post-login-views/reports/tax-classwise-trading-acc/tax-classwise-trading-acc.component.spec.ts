import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxClasswiseTradingAccComponent } from './tax-classwise-trading-acc.component';

describe('TaxClasswiseTradingAccComponent', () => {
  let component: TaxClasswiseTradingAccComponent;
  let fixture: ComponentFixture<TaxClasswiseTradingAccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxClasswiseTradingAccComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxClasswiseTradingAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
