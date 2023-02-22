import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMenuListItemComponent } from './top-menu-list-item.component';

describe('TopMenuListItemComponent', () => {
  let component: TopMenuListItemComponent;
  let fixture: ComponentFixture<TopMenuListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopMenuListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopMenuListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
