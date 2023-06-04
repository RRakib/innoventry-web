import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerMenuListItemComponent } from './partner-menu-list-item.component';

describe('PartnerMenuListItemComponent', () => {
  let component: PartnerMenuListItemComponent;
  let fixture: ComponentFixture<PartnerMenuListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerMenuListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerMenuListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
