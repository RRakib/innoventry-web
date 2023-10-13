import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGroupwiseTradingAccComponent } from './item-groupwise-trading-acc.component';

describe('ItemGroupwiseTradingAccComponent', () => {
  let component: ItemGroupwiseTradingAccComponent;
  let fixture: ComponentFixture<ItemGroupwiseTradingAccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemGroupwiseTradingAccComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGroupwiseTradingAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
