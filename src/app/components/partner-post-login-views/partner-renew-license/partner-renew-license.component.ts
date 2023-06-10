import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemLicenseReportLine, PartnerItemLicenseGenerationServiceService } from 'src/server';

import { Observable, Subscription, map, shareReplay} from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NavService } from 'src/app/services/nav.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-partner-renew-license',
  templateUrl: './partner-renew-license.component.html',
  styleUrls: ['./partner-renew-license.component.css']
})
export class PartnerRenewLicenseComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  licenseSubscription : Subscription;
  licenseSearchForm : FormGroup;
  isFormLoaded : boolean = false;

  licenseKey : string;
  customerCount: number = 0;

  public dataSource = new MatTableDataSource<ItemLicenseReportLine>([]);
  @ViewChild(MatPaginator) paginator: any = MatPaginator;

    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
    public displayedColumns = ['customer',
    'item',
    'mobile',
    'email',
    'amcDate',
    'expiryDate',
    'productKey'
  ];

  allCustomers: ItemLicenseReportLine[] = [];

  constructor(private formBuilder: FormBuilder, private navService : NavService,
    private licenseGenerationService : PartnerItemLicenseGenerationServiceService,
    private router : Router, private breakpointObserver: BreakpointObserver) {
      this.licenseKey = router.getCurrentNavigation()?.extras.state?.['licenseKey'];
    }

  ngOnInit(): void {
    this.licenseSearchForm = this.formBuilder.group({
      licenseKey: new FormControl(this.licenseKey)
    });

    if(!!this.licenseKey && this.licenseKey.length > 0) {
      this.getLicenseKeyOwnerDetails();
    }

    this.isFormLoaded = true;
  }

  getLicenseKeyOwnerDetails() : void{
    this.licenseGenerationService.findItemLicenseInfo(this.licenseSearchForm.controls["licenseKey"].value).subscribe({
      next: (data) => {
        this.allCustomers = data || [];
        this.dataSource.data = data || [];
        this.customerCount = data != undefined && data.length > 0
          ? data.length : 0;
      }
    });
  }

  public generateNewLicense(): void{
    this.router.navigate(['partnerMainView/newLicense']);  
  }

  public viewCustomers() :void {
    this.router.navigate(['partnerMainView/customers']);  
  }
}
