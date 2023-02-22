import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditOtherChargesComponent } from './new-edit-other-charges.component';

describe('NewEditOtherChargesComponent', () => {
  let component: NewEditOtherChargesComponent;
  let fixture: ComponentFixture<NewEditOtherChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEditOtherChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEditOtherChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
