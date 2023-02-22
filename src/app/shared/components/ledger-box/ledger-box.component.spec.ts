import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerBoxComponent } from './ledger-box.component';

describe('LedgerBoxComponent', () => {
  let component: LedgerBoxComponent;
  let fixture: ComponentFixture<LedgerBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
