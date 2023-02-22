import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTxRegisterComponent } from './item-tx-register.component';

describe('ItemTxRegisterComponent', () => {
  let component: ItemTxRegisterComponent;
  let fixture: ComponentFixture<ItemTxRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemTxRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTxRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
