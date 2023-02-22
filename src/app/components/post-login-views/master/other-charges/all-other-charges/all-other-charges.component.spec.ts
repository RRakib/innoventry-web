import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOtherChargesComponent } from './all-other-charges.component';

describe('AllOtherChargesComponent', () => {
  let component: AllOtherChargesComponent;
  let fixture: ComponentFixture<AllOtherChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllOtherChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllOtherChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
