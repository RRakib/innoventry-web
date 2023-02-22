import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAttributeGroupsComponent } from './all-attribute-groups.component';

describe('AllAttributeGroupsComponent', () => {
  let component: AllAttributeGroupsComponent;
  let fixture: ComponentFixture<AllAttributeGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllAttributeGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAttributeGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
