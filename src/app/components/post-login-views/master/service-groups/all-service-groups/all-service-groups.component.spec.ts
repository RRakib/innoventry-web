import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllServiceGroupsComponent } from './all-service-groups.component';

describe('AllServiceGroupsComponent', () => {
  let component: AllServiceGroupsComponent;
  let fixture: ComponentFixture<AllServiceGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllServiceGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllServiceGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
