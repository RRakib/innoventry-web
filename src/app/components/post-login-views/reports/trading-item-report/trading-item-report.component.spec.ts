import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingItemReportComponent } from './trading-item-report.component';

describe('TradingItemReportComponent', () => {
  let component: TradingItemReportComponent;
  let fixture: ComponentFixture<TradingItemReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradingItemReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingItemReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
