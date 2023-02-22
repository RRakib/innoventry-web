import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { OverlayService } from 'src/app/services/overlay.service';
import { IManufacturer } from 'src/server';
import { ManufacturerServiceService } from 'src/server/api/manufacturerService.service';

@Component({
  selector: 'app-new-edit-manufacturer',
  templateUrl: './new-edit-manufacturer.component.html',
  styleUrls: ['./new-edit-manufacturer.component.css']
})
export class NewEditManufacturerComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  public manufacturerForm: FormGroup;
  isFormLoaded : boolean = false;
  manufacturer: IManufacturer;

  constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder, 
    private manufacturerApi : ManufacturerServiceService,
    private overlayService : OverlayService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.manufacturer = {};

    this.route.params.subscribe(params => { 
      if (params['manufacturerId']) {
        this.overlayService.enableProgressSpinner();

            this.manufacturerApi.findById(params['manufacturerId']).subscribe({
              next: (data) => {
                this.manufacturer = data;
                this.initializeManufacturerForm();
                this.isFormLoaded = true;

             

                this.overlayService.disableProgressSpinner();
              }
            });
      }else{
        this.initializeManufacturerForm();
        this.isFormLoaded = true;
        this.overlayService.disableProgressSpinner();
      }
    });
  }

  private initializeManufacturerForm() {
    this.manufacturerForm = this.formBuilder.group({
      jacksontype: 'ManufacturerImpl',
      id: new FormControl(this.manufacturer.id),
      name: new FormControl(this.manufacturer.name, [Validators.required]),      
      description: new FormControl(this.manufacturer.description)     
    });

    this.isFormLoaded = true;
  }

  viewAllManufacturers() : void{
    this.router.navigate(['main/master/allManufacturers']);
  }

  saveManufacturer(): void {
    if(this.manufacturerForm.valid) {
      if(!!this.manufacturerForm.controls["id"].value) {
        this.manufacturerApi.update(this.manufacturerForm.getRawValue()).subscribe({
          next: (data) => {
            this.viewAllManufacturers();
          }
        });
      }else{
        this.manufacturerApi.save(this.manufacturerForm.getRawValue()).subscribe({
          next: (data) => {
            this.viewAllManufacturers();
          }
        });
      }
    }    
  }

}
