import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditLedgerComponent } from './new-edit-ledger.component';

describe('NewEditLedgerComponent', () => {
  let component: NewEditLedgerComponent;
  let fixture: ComponentFixture<NewEditLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEditLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEditLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
