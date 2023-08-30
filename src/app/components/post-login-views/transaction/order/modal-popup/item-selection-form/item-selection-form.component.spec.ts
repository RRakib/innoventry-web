import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSelectionFormComponent } from './item-selection-form.component';

describe('ItemSelectionFormComponent', () => {
  let component: ItemSelectionFormComponent;
  let fixture: ComponentFixture<ItemSelectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemSelectionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
