import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAttributesComponent } from './all-attributes.component';

describe('AllAttributesComponent', () => {
  let component: AllAttributesComponent;
  let fixture: ComponentFixture<AllAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllAttributesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
