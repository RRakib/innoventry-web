import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureItemStockAttributeComponent } from './configure-item-stock-attribute.component';

describe('ConfigureItemStockAttributeComponent', () => {
  let component: ConfigureItemStockAttributeComponent;
  let fixture: ComponentFixture<ConfigureItemStockAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureItemStockAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureItemStockAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
