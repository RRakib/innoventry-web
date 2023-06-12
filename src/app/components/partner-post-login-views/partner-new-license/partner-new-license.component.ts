import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PartnerItemInfo, PartnerItemInfoServiceService, PartnerItemLicenseGenerationServiceService } from 'src/server';

@Component({
  selector: 'app-partner-new-license',
  templateUrl: './partner-new-license.component.html',
  styleUrls: ['./partner-new-license.component.css']
})
export class PartnerNewLicenseComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  //PartnerItemLicenseRequest
  licenseForm : FormGroup;
  availableProducts: Array<PartnerItemInfo> = [];

  isFormLoaded: boolean = false;
  selectedProductRate : number | undefined;

  constructor(private breakpointObserver: BreakpointObserver, private generateLicenseService: PartnerItemLicenseGenerationServiceService,
    private formBuilder: FormBuilder,
    private itemService: PartnerItemInfoServiceService,
    private router: Router,
    public dialog: MatDialog) {

  }

  ngOnInit(): void {

    this.itemService.getItems().subscribe({
      next: (data) => {
        this.availableProducts = data;

        this.licenseForm = this.formBuilder.group({
          customerName : new FormControl(),
          mobile: new FormControl(),
          email: new FormControl(),
          address: new FormControl(),
          itemId: new FormControl(),
          requestType: new FormControl(),
          productKey: new FormControl(),
        });

        this.isFormLoaded = true;
      }
    });
  }

  onProductKeyChange(): void{
    let selectedProduct = this.availableProducts.find((product) => product.id == this.licenseForm.controls["productKey"].value);
    this.selectedProductRate = selectedProduct?.rate;
  }

  public viewCustomers() :void {
    this.router.navigate(['partnerMainView/customers']);  
  }

  generateLicense() {
    let buyLicenseURL = `${environment.buyLicenseUrl}`;
    window.open(buyLicenseURL, '_blank');
    
    const ConfirmationDialogRef = this.dialog.open(ConfirmationDialogBox,
      {disableClose: true}
    );

    ConfirmationDialogRef.afterClosed().subscribe(result => {
      this.licenseForm.reset(); 
      this.selectedProductRate = undefined;
    });
  }

}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'confirmation-dialog.component.html',
})
export class ConfirmationDialogBox {
  constructor(private router: Router, public dialogRef: MatDialogRef<ConfirmationDialogBox>) { }

  public closeDialog() :void{
    this.dialogRef.close();
    this.router.navigate(['partnerMainView/customers']);  
  }

  public generateNewLicense() : void{
    this.dialogRef.close();
  }
}