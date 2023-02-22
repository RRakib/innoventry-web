import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveLedgersComponent } from './inactive-ledgers.component';

describe('InactiveLedgersComponent', () => {
  let component: InactiveLedgersComponent;
  let fixture: ComponentFixture<InactiveLedgersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InactiveLedgersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveLedgersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
