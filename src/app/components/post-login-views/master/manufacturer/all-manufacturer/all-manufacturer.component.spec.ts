import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllManufacturerComponent } from './all-manufacturer.component';

describe('AllManufacturerComponent', () => {
  let component: AllManufacturerComponent;
  let fixture: ComponentFixture<AllManufacturerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllManufacturerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
