import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, shareReplay, forkJoin } from 'rxjs';
import { PCompany, PCompanyInput, PCountry, PState } from 'src/server';
import { AreaServiceService } from 'src/server/api/areaService.service';
import { DatabaseServiceService } from 'src/server/api/databaseService.service';
import { StateServiceService } from 'src/server/api/stateService.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  public registrationForm: FormGroup;
  isFormLoaded : boolean = false;

  countries : string[];
  states: string[] = [];

  gstinPattern = "^([0][1-9]|[1-2][0-9]|[3][0-5])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$";

  constructor(private breakpointObserver: BreakpointObserver,
    private dataBaseService : DatabaseServiceService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {

    this.registrationForm = this.formBuilder.group({
      companyId : new FormControl('', [Validators.required]),
      name: new FormControl(''),
      username: new FormControl(''),
      password: new FormControl(''),
      country: new FormControl("INDIA"),
      state: new FormControl(''),
      mobile: new FormControl(''),
      address1: new FormControl(''),
      email: new FormControl(''),
      weblink: new FormControl(''),
      //gstin: new FormControl('' , [Validators.pattern(this.gstinPattern)]),
      gstin: new FormControl(''),
      gstType: new FormControl('Unregistered')
    });


    this.onPageLoadHttpRequests().subscribe({
      next: (data) => {

        this.countries = data[0];

        // Load default states of selected country
        this.dataBaseService.getStateList(this.registrationForm.controls["country"].value).subscribe({
          next: (data) => {
            this.states = data;
          }
        });
    }});

    this.isFormLoaded = true;
  }


  public onPageLoadHttpRequests(): Observable<any[]> {    
    let countries$ : Observable<string[]> = this.dataBaseService.getCountryList();
    return forkJoin([countries$]);
  }

  public enableLoginView() : void{
    this.router.navigate(['/login']);
  }

  public validateCompanyId(event : any) : void{
    if(!!event.target.value && event.target.value != "") {
      this.dataBaseService.isCompanyIdAvailable(event.target.value).subscribe({
        next: (data)=> {
          if(!data) {
            this.registrationForm.controls["companyId"].setErrors({forbiddenNames: { value: 'Company Id is not available.'}});    
          }else{
            this.registrationForm.controls["companyId"].setErrors(null);
          }
        }
      });
    }    
  }

  public registerCompany() : void{

    this.registrationForm.markAllAsTouched();

    if(this.registrationForm.valid) {

      let companyInput: PCompanyInput = {};
      let company : PCompany = {};

      companyInput.product = "inventory";
      companyInput.adminEmail = this.registrationForm.controls["email"].value;
      companyInput.adminMobile = this.registrationForm.controls["mobile"].value;
      companyInput.adminName = this.registrationForm.controls["name"].value;
      companyInput.username = this.registrationForm.controls["username"].value;
      companyInput.password = this.registrationForm.controls["password"].value;

      this.registrationForm.removeControl("username");
      this.registrationForm.removeControl("password");

      company = !!this.registrationForm.value ?  this.registrationForm.value : {};
      company.financialYearStart = new Date();
      company.address2 = "";
      company.address3 = "";
      company.contactperson = "";
      company.description = "";
      company.fax = "";
      company.pan = "";
      company.phone = "";
      company.pin = ""; 

      companyInput.company = company;

      this.dataBaseService.createPCompany(companyInput).subscribe({
        next: (data) => {
          this.router.navigate(['/login']);
        }
      });

    }
  }
}
