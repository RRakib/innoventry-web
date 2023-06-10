import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerNewLicenseComponent } from './partner-new-license.component';

describe('PartnerNewLicenseComponent', () => {
  let component: PartnerNewLicenseComponent;
  let fixture: ComponentFixture<PartnerNewLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerNewLicenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerNewLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
