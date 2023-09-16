import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerBuyApiComponent } from './partner-buy-api.component';

describe('PartnerBuyApiComponent', () => {
  let component: PartnerBuyApiComponent;
  let fixture: ComponentFixture<PartnerBuyApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerBuyApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerBuyApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
