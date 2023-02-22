import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterBaseViewComponent } from './master-base-view.component';

describe('MasterBaseViewComponent', () => {
  let component: MasterBaseViewComponent;
  let fixture: ComponentFixture<MasterBaseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterBaseViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterBaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
