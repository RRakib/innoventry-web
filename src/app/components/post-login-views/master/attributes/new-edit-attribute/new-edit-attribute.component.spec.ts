import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditAttributeComponent } from './new-edit-attribute.component';

describe('NewEditAttributeComponent', () => {
  let component: NewEditAttributeComponent;
  let fixture: ComponentFixture<NewEditAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEditAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEditAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
