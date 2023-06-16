import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    public dialog: MatDialog,
    public newLicenseDialogRef: MatDialogRef<PartnerNewLicenseComponent>) {

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
          productKey: new FormControl(null, [Validators.required]),
        });

        this.isFormLoaded = true;
      }
    });
  }

  onProductKeyChange(): void{
    let selectedProduct = this.availableProducts.find((product) => product.name == this.licenseForm.controls["productKey"].value);
    this.selectedProductRate = selectedProduct?.rate;
  }

  generateLicense() {

    this.licenseForm.controls["productKey"].markAsTouched();
    if(this.licenseForm.valid) {
      this.newLicenseDialogRef.close();
      let buyLicenseURL = `${environment.buyLicenseUrl}?partner_id=${localStorage.getItem('userName')}&product=${this.licenseForm.controls["productKey"].value}`;
      window.open(buyLicenseURL, '_blank');
      
      this.dialog.open(ConfirmationDialogBox,
        {disableClose: true, width: '60vw'}
      );
    }   
  }

  cancelLicenseGeneration() {
    this.newLicenseDialogRef.close();
  }

}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'confirmation-dialog.component.html',
})
export class ConfirmationDialogBox {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogBox>, public dialog: MatDialog) { }

  public closeDialog() :void{
    this.dialogRef.close();
  }

  public generateNewLicense() : void{
    this.dialogRef.close();

    this.dialog.open(PartnerNewLicenseComponent,
      {disableClose: true, width: '60vw'}
    );
  }
}