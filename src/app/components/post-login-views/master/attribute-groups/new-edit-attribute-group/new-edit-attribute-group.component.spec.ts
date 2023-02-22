import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditAttributeGroupComponent } from './new-edit-attribute-group.component';

describe('NewEditAttributeGroupComponent', () => {
  let component: NewEditAttributeGroupComponent;
  let fixture: ComponentFixture<NewEditAttributeGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEditAttributeGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEditAttributeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
