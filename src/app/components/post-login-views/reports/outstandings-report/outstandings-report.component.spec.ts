import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingsReportComponent } from './outstandings-report.component';

describe('OutstandingsReportComponent', () => {
  let component: OutstandingsReportComponent;
  let fixture: ComponentFixture<OutstandingsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutstandingsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
