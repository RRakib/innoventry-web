import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllChoiceListComponent } from './all-choice-list.component';

describe('AllChoiceListComponent', () => {
  let component: AllChoiceListComponent;
  let fixture: ComponentFixture<AllChoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllChoiceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllChoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
