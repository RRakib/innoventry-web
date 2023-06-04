import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerCustomersComponent } from './partner-customers.component';

describe('PartnerCustomersComponent', () => {
  let component: PartnerCustomersComponent;
  let fixture: ComponentFixture<PartnerCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
