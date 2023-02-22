import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditServiceComponent } from './new-edit-service.component';

describe('NewEditServiceComponent', () => {
  let component: NewEditServiceComponent;
  let fixture: ComponentFixture<NewEditServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEditServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEditServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
