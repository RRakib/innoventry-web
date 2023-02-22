import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditItemGroupComponent } from './new-edit-item-group.component';

describe('NewEditItemGroupComponent', () => {
  let component: NewEditItemGroupComponent;
  let fixture: ComponentFixture<NewEditItemGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEditItemGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEditItemGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
