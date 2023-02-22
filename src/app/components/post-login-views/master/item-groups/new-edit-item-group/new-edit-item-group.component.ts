import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, shareReplay, startWith } from 'rxjs';
import { OverlayService } from 'src/app/services/overlay.service';
import { IItemGroup } from 'src/server';
import { ItemGroupServiceService } from 'src/server/api/itemGroupService.service';

@Component({
  selector: 'app-new-edit-item-group',
  templateUrl: './new-edit-item-group.component.html',
  styleUrls: ['./new-edit-item-group.component.css']
})
export class NewEditItemGroupComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );


  public itemGroupForm: FormGroup;
  isFormLoaded : boolean = false;
  parentItemGroupList : IItemGroup[];
  itemGroup : IItemGroup;
  filteredParentItemGroupList:  Observable<IItemGroup[]>;
  
  constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder, 
    private itemGroupService : ItemGroupServiceService,
    private overlayService : OverlayService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.itemGroup = {};

    // Get all Parent Item Groups.
    this.itemGroupService.getObjects().subscribe({
      next: (data) => {
        this.parentItemGroupList = data;   
        
        this.route.params.subscribe(params => {          
          if (params['itemGroupId']) { // Get Item Group.

            this.overlayService.enableProgressSpinner();

            this.itemGroupService.findById(params['itemGroupId']).subscribe({
              next: (data) => {
                this.itemGroup = data;
                this.initializeItemGroupForm();
                this.isFormLoaded = true;
                this.overlayService.disableProgressSpinner();
              }
            });
            
          }else{
            this.initializeItemGroupForm();
            this.isFormLoaded = true;
            this.overlayService.disableProgressSpinner();
          }
        });        

                
      },
      error: () =>{
        this.overlayService.disableProgressSpinner();
      }
    });
   
  }

  private initializeItemGroupForm() {
    this.itemGroupForm = this.formBuilder.group({
      jacksontype: new FormControl("ItemGroupImpl"),
      id: new FormControl(this.itemGroup.id),
      name: new FormControl(this.itemGroup.name, [Validators.required]),
      parentItemGroupId: new FormControl(this.itemGroup.parentItemGroupId),
      parentItemGroupName: new FormControl(this.itemGroup.parentItemGroupName),
      description: new FormControl(this.itemGroup.description)
    });

    this.filteredParentItemGroupList = this.itemGroupForm.controls["parentItemGroupName"].valueChanges
          .pipe(startWith(this.itemGroupForm.controls["parentItemGroupName"].value), map(value => this._filterParentItemGroups(value)));

    this.itemGroupForm.controls["parentItemGroupName"].valueChanges.subscribe({
      next: (data) => {
        let itemGroups =  this._filterParentItemGroups(data);
        if(itemGroups == undefined || itemGroups.length == 0) {
          this.itemGroupForm.patchValue({
            parentItemGroupId : undefined,
            parentItemGroupName : undefined
          });
        }

      }
    });
  }

  viewAllItemGroups() : void{
    this.router.navigate(['main/master/allItemGroups']);
  }


  saveItemGroup() : void {    
    if(this.itemGroupForm.valid) {
      this.overlayService.enableProgressSpinner();

      if(!!this.itemGroupForm.controls["id"].value) { // Update Item Group
        this.itemGroupService.update(this.itemGroupForm.value).subscribe({
          next: (data) => {
            if(!!data.id) {
              this.overlayService.disableProgressSpinner();
              this.viewAllItemGroups();
            }else{
              this.overlayService.disableProgressSpinner();
            }
          },
          error: () => {
            this.overlayService.disableProgressSpinner();
          }
        });
      } else{ // New Item Group
        this.itemGroupService.save(this.itemGroupForm.value).subscribe({
          next: (data) => {
            if(!!data.id) {
              this.overlayService.disableProgressSpinner();
              this.viewAllItemGroups();
            }else{
              this.overlayService.disableProgressSpinner();
            }
          },
          error: () => {
            this.overlayService.disableProgressSpinner();
          }
        });
      }
     
    }    
  }

  public onParentItemGroupSelectionChanged(event : MatAutocompleteSelectedEvent) {
    const filterValue = event.option.value.toLowerCase();

    let parentItemGroup  = this.parentItemGroupList.find((parentItemGroup) => parentItemGroup.name?.toLowerCase() == filterValue);

    if(!!parentItemGroup) {
      this.itemGroupForm.patchValue({
        parentItemGroupId : parentItemGroup.id
      });
    }  
  }

  private _filterParentItemGroups(value: string) : IItemGroup[]{
    const filterValue = !!value ? value.toLowerCase() : '';

    let parentItemGroups : IItemGroup[] = this.parentItemGroupList;

    return parentItemGroups?.filter(option => option.name?.toLowerCase().includes(filterValue));    
  }

}
