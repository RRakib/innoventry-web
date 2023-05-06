import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRegisterForLedgerComponent } from './item-register-for-ledger.component';

describe('ItemRegisterForLedgerComponent', () => {
  let component: ItemRegisterForLedgerComponent;
  let fixture: ComponentFixture<ItemRegisterForLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemRegisterForLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRegisterForLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
