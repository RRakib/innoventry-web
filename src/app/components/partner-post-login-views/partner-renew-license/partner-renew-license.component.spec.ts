import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerRenewLicenseComponent } from './partner-renew-license.component';

describe('PartnerRenewLicenseComponent', () => {
  let component: PartnerRenewLicenseComponent;
  let fixture: ComponentFixture<PartnerRenewLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerRenewLicenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerRenewLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
