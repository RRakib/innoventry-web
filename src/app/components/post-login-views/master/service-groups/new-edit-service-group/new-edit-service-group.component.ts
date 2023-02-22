import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';
import { OverlayService } from 'src/app/services/overlay.service';
import { IServiceGroup } from 'src/server';
import { ServiceGroupServiceService } from 'src/server/api/serviceGroupService.service';

@Component({
  selector: 'app-new-edit-service-group',
  templateUrl: './new-edit-service-group.component.html',
  styleUrls: ['./new-edit-service-group.component.css']
})
export class NewEditServiceGroupComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  public serviceGroupForm: FormGroup;
  isFormLoaded : boolean = false;
  serviceGroup: IServiceGroup;


  constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder, 
    private serviceGroupApi : ServiceGroupServiceService,
    private overlayService : OverlayService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.serviceGroup = {};

    this.route.params.subscribe(params => { 
      if (params['serviceGroupId']) {
        this.overlayService.enableProgressSpinner();

            this.serviceGroupApi.findById(params['serviceGroupId']).subscribe({
              next: (data) => {
                this.serviceGroup = data;
                this.initializeServiceGroupForm();
                this.isFormLoaded = true;

                this.overlayService.disableProgressSpinner();
              }
            });
      }else{
        this.initializeServiceGroupForm();
        this.isFormLoaded = true;
        this.overlayService.disableProgressSpinner();
      }
    });
  }


  private initializeServiceGroupForm() {
    this.serviceGroupForm = this.formBuilder.group({
      jacksontype: 'ServiceGroupImpl',
      id: new FormControl(this.serviceGroup.id),
      name: new FormControl(this.serviceGroup.name, [Validators.required]),      
      description: new FormControl(this.serviceGroup.description)     
    });

    this.isFormLoaded = true;
  }

  viewAllServiceGroups() : void{
    this.router.navigate(['main/master/allServiceGroups']);
  }

  saveServiceGroup(): void {
    if(this.serviceGroupForm.valid) {
      if(!!this.serviceGroupForm.controls["id"].value) {
        this.serviceGroupApi.update(this.serviceGroupForm.getRawValue()).subscribe({
          next: (data) => {
            this.viewAllServiceGroups();
          }
        });
      }else{
        this.serviceGroupApi.save(this.serviceGroupForm.getRawValue()).subscribe({
          next: (data) => {
            this.viewAllServiceGroups();
          }
        });
      }
    }    
  }

}
