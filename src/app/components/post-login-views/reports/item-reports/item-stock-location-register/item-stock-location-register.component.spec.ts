import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStockLocationRegisterComponent } from './item-stock-location-register.component';

describe('ItemStockLocationRegisterComponent', () => {
  let component: ItemStockLocationRegisterComponent;
  let fixture: ComponentFixture<ItemStockLocationRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemStockLocationRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemStockLocationRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
