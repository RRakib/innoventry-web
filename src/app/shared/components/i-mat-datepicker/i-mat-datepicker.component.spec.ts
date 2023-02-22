import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IMatDatepickerComponent } from './i-mat-datepicker.component';

describe('IMatDatepickerComponent', () => {
  let component: IMatDatepickerComponent;
  let fixture: ComponentFixture<IMatDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IMatDatepickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IMatDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
