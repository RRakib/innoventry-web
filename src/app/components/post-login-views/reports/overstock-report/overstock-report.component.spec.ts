import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverstockReportComponent } from './overstock-report.component';

describe('OverstockReportComponent', () => {
  let component: OverstockReportComponent;
  let fixture: ComponentFixture<OverstockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverstockReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverstockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
