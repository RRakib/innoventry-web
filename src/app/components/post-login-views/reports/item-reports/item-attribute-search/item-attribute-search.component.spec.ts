import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAttributeSearchComponent } from './item-attribute-search.component';

describe('ItemAttributeSearchComponent', () => {
  let component: ItemAttributeSearchComponent;
  let fixture: ComponentFixture<ItemAttributeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemAttributeSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAttributeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
