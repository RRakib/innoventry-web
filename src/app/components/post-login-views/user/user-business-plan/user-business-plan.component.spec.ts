import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBusinessPlanComponent } from './user-business-plan.component';

describe('UserBusinessPlanComponent', () => {
  let component: UserBusinessPlanComponent;
  let fixture: ComponentFixture<UserBusinessPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBusinessPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBusinessPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
