import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsBaseViewComponent } from './reports-base-view.component';

describe('ReportsBaseViewComponent', () => {
  let component: ReportsBaseViewComponent;
  let fixture: ComponentFixture<ReportsBaseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsBaseViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsBaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
