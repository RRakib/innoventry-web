import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ItemLicenseReportLine, PartnerItemLicenseGenerationServiceService } from 'src/server';
import { ConfirmationDialogBox } from '../partner-new-license/partner-new-license.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partner-buy-api',
  templateUrl: './partner-buy-api.component.html',
  styleUrls: ['./partner-buy-api.component.css']
})
export class PartnerBuyApiComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  buyApiForm : FormGroup;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['customer',
    'item',
    'mobile',
    'email',
    'amcDate',
    'expiryDate',
    'productKey'
  ];

  public dataSource = new MatTableDataSource<ItemLicenseReportLine>([]);
  
  constructor(private breakpointObserver: BreakpointObserver, public dialog: MatDialog,
    public buyApiDialogRef: MatDialogRef<PartnerBuyApiComponent>,
    private router : Router,
    private licenseGenerationService : PartnerItemLicenseGenerationServiceService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { 
      apiType: string
    }) { }

  ngOnInit(): void {
    this.buyApiForm = this.formBuilder.group({ 
      customerId: new FormControl(null, [Validators.required]),
      apiKey: new FormControl(this.data.apiType),
      count: new FormControl("1000")
    });
  }

  getLicenseKeyOwnerDetails() : void{
    this.buyApiForm.controls["customerId"].markAllAsTouched();
    if(this.buyApiForm.valid) {
      this.licenseGenerationService.findItemLicenseInfo(this.buyApiForm.controls["customerId"].value).subscribe({
        next: (data) => {        
          this.dataSource.data = data || [];        
        }
      });
    }
  }

  buyApi() : void{
    this.buyApiForm.controls["customerId"].markAllAsTouched();
    if(this.buyApiForm.valid) {
      let buyLicenseURL = `${environment.buyLicenseUrl}?partner_id=${localStorage.getItem('userName')}&apiKey=${this.data.apiType}&action=api&customer_user_id=${this.buyApiForm.controls["customerId"].value}&count=${this.buyApiForm.controls["count"].value}`;
      window.open(buyLicenseURL, '_blank');

      this.dialog.open(ConfirmationDialogBox,
        {disableClose: true, width: '60vw'}
      );

      this.buyApiDialogRef.close();

      this.router.navigate(["partnerMainView"]);
    }
  }

  cancelBuyApi() :void{
    this.buyApiDialogRef.close();
  }
}
