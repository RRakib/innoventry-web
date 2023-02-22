import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderstockReportComponent } from './understock-report.component';

describe('UnderstockReportComponent', () => {
  let component: UnderstockReportComponent;
  let fixture: ComponentFixture<UnderstockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnderstockReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderstockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
