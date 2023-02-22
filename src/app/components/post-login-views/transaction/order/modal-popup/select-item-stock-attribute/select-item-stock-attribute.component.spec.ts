import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectItemStockAttributeComponent } from './select-item-stock-attribute.component';

describe('SelectItemStockAttributeComponent', () => {
  let component: SelectItemStockAttributeComponent;
  let fixture: ComponentFixture<SelectItemStockAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectItemStockAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectItemStockAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
