import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditServiceGroupComponent } from './new-edit-service-group.component';

describe('NewEditServiceGroupComponent', () => {
  let component: NewEditServiceGroupComponent;
  let fixture: ComponentFixture<NewEditServiceGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEditServiceGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEditServiceGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
