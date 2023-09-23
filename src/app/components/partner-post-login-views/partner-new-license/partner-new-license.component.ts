import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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
  availableOnlineProducts: Array<any> = [
    {"label": "Basic Edition Online" , "value" : "NINVBEH"},
    {"label": "Personal Edition Online" , "value" : "NINVBEH"},
    {"label": "Standard Edition Online" , "value" : "NINVBEH"},
    {"label": "Premium Edition Online" , "value" : "NINVBEH"}
  ];

  availableOfflineProducts: Array<any> = [
    {"label": "Basic Edition Perpetual License" , "value" : "NINVBEOT"},
    {"label": "Personal Edition Perpetual License" , "value" : "NINVPEOT"},
    {"label": "Standard Edition Perpetual License" , "value" : "NINVSEOT"},
    {"label": "Premium Edition Perpetual License" , "value" : "NINVFEOT"},
    {"label": "Basic Edition Yearly License" , "value" : "NINVBEY"},
    {"label": "Personal Edition Yearly License" , "value" : "NINVPEY"},
    {"label": "Standard Edition Yearly License" , "value" : "NINVSEY"},
    {"label": "Premium Edition Yearly License" , "value" : "NINVFEY"}
  ];

  availableProducts: Array<PartnerItemInfo> = [];

  isFormLoaded: boolean = false;
  selectedProductRate : number | undefined;
  selectedProductCode : string | undefined;

  constructor(private breakpointObserver: BreakpointObserver, private generateLicenseService: PartnerItemLicenseGenerationServiceService,
    private formBuilder: FormBuilder,
    private itemService: PartnerItemInfoServiceService,
    private router: Router,
    public dialog: MatDialog,
    public newLicenseDialogRef: MatDialogRef<PartnerNewLicenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      action: string
    }) {

  }

  ngOnInit(): void {

    this.licenseForm = this.formBuilder.group({      
      productKey: new FormControl(null, [Validators.required]),
    });

    if(this.data.action == 'new_online'){
      this.licenseForm.addControl('companyId', new FormControl(null, [Validators.required]));
    }

    if(this.data.action == 'new_online') {
      this.isFormLoaded = true;
    }else{
      this.itemService.getItems().subscribe({
        next: (data) => {
          this.availableProducts = data;
          this.isFormLoaded = true;
        }
      });
    }

    
  }

  onProductKeyChange(): void{

    let selectedProduct;

    if(this.data.action == 'new_online') {
      selectedProduct = this.availableOnlineProducts.find((product) => product.value == this.licenseForm.controls["productKey"].value);      
    }else{
      selectedProduct = this.availableOfflineProducts.find((product) => product.value == this.licenseForm.controls["productKey"].value);
    }

    if(!!selectedProduct){
      this.selectedProductCode = selectedProduct.value;
    }
    
  }

  generateLicense() {

    this.licenseForm.controls["productKey"].markAsTouched();
    if(this.licenseForm.valid) {
      this.newLicenseDialogRef.close();
      let buyLicenseURL = `${environment.buyLicenseUrl}?partner_id=${localStorage.getItem('userName')}&productCode=${this.selectedProductCode}&action=${this.data.action}`;

      if(this.data.action == 'new_online'){
        buyLicenseURL = `${environment.buyLicenseUrl}?partner_id=${localStorage.getItem('userName')}&productCode=${this.selectedProductCode}&action=${this.data.action}&company_id=${this.licenseForm.controls["companyId"].value}`;
      }

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