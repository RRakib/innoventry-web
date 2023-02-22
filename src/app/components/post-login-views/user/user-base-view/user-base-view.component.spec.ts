import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBaseViewComponent } from './user-base-view.component';

describe('UserBaseViewComponent', () => {
  let component: UserBaseViewComponent;
  let fixture: ComponentFixture<UserBaseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBaseViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
