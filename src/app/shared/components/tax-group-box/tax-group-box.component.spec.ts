import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxGroupBoxComponent } from './tax-group-box.component';

describe('TaxGroupBoxComponent', () => {
  let component: TaxGroupBoxComponent;
  let fixture: ComponentFixture<TaxGroupBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxGroupBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxGroupBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
