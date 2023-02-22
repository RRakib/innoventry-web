import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditManufacturerComponent } from './new-edit-manufacturer.component';

describe('NewEditManufacturerComponent', () => {
  let component: NewEditManufacturerComponent;
  let fixture: ComponentFixture<NewEditManufacturerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEditManufacturerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEditManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
