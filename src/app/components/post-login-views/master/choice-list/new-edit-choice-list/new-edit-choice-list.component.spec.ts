import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditChoiceListComponent } from './new-edit-choice-list.component';

describe('NewEditChoiceListComponent', () => {
  let component: NewEditChoiceListComponent;
  let fixture: ComponentFixture<NewEditChoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEditChoiceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEditChoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
