import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map, Observable, shareReplay, startWith } from 'rxjs';
import { OverlayService } from 'src/app/services/overlay.service';
import { IAttribute, IAttributeGroup } from 'src/server';
import { AttributeGroupServiceService } from 'src/server/api/attributeGroupService.service';
import { AttributeServiceService } from 'src/server/api/attributeService.service';

@Component({
  selector: 'app-new-edit-attribute-group',
  templateUrl: './new-edit-attribute-group.component.html',
  styleUrls: ['./new-edit-attribute-group.component.css']
})
export class NewEditAttributeGroupComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  public attributeGroupForm: FormGroup;
  isFormLoaded : boolean = false;
  attributeGroup: IAttributeGroup;

  attributeName: FormControl; // User Input in AutoComplete.
  attributeList : IAttribute[]; // Fetched from server.
  filteredAttributeList:  Observable<IAttribute[]>; //Filtered Attributes from Attributes List as per attributeName

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['name','displayName', 'description'];

  private selectedAttribute : IAttribute | undefined;   
  public dataSource = new MatTableDataSource<IAttribute>([]);

  selectedRowIndex = -1;

  constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder,
    private overlayService : OverlayService,
    private router: Router,
    private route: ActivatedRoute,
    private attributeGroupApi : AttributeGroupServiceService,
    private attributeServiceApi : AttributeServiceService) { }

  ngOnInit(): void {

    this.attributeGroup = {};
    this.attributeName = new FormControl();   

    this.route.params.subscribe(params => { 
      if (params['attributeGroupId']) {
        this.overlayService.enableProgressSpinner();

        // Group all observables and execute concurrently
        let attributeGroupDetail$ = this.attributeGroupApi.findById(params['attributeGroupId']);
        let allPageRequest : Observable<any[]> = forkJoin([this.getAttributesObservable(), attributeGroupDetail$]);

        allPageRequest.subscribe({ // concurrent execution.
          next: (data) => {
            this.getAllAttributes(data[0]);
            this.getAttributeGroupDetails(data[1]);            
            this.overlayService.disableProgressSpinner();
          },
          error: () => {
            this.overlayService.disableProgressSpinner();
          }
        });

            
      }else{
        this.initializeAttributeGroupForm();
        this.isFormLoaded = true;

        this.getAttributesObservable().subscribe({
          next: (data) => {
            this.getAllAttributes(data);            
            this.overlayService.disableProgressSpinner();
          },
          error: () => {
            this.overlayService.disableProgressSpinner();
          }
        });
      }
    });   
  }

  /**
   * This functions bind the attribute group detail in edit mode.
   * @param data : IAttributeGroup
   */
  private getAttributeGroupDetails(data: IAttributeGroup) {
    this.attributeGroup = data;
    this.initializeAttributeGroupForm();
    this.isFormLoaded = true;
  }


  /**
   * This function initializes the attribute group form.
   */
  private initializeAttributeGroupForm() : void{
    this.attributeGroupForm = this.formBuilder.group({
      jacksontype: 'AttributeGroupImpl',
      id: new FormControl(this.attributeGroup.id),
      name: new FormControl(this.attributeGroup.name, [Validators.required]),
      displayName: new FormControl(this.attributeGroup.displayName, [Validators.required]),
      description: new FormControl(this.attributeGroup.description),
      attributeList : []    
    });

    this.attributeGroupForm.patchValue({
      attributeList : this.attributeGroup.attributeList
    });

    console.log(this.attributeGroupForm.value);

    this.dataSource.data = this.attributeGroupForm.controls["attributeList"].value;
  }


  /**
   * This function returns an attribute observable which is further subscribed in new or edit ngOnInit.
   * @returns Observable<IAttribute[]> 
   */
  getAttributesObservable() : Observable<IAttribute[]> {
    return this.attributeServiceApi.getObjects();    
  }

  /**
   * This function get all the attributes as parameter and bind with the autocomplete dropdown.
   * @param data : IAttribute[]
   */
  getAllAttributes(data: IAttribute[]) : void{    
    this.attributeList = data;

    this.filteredAttributeList = this.attributeName.valueChanges
    .pipe(startWith(this.attributeName.value), map(value => this._filterAttribute(value)));
  }

  /** 
   * This function updates the display name as per the attribute group name entered by user.
   */
  updateDisplayName() : void{
    this.attributeGroupForm.controls["displayName"].setValue(this.attributeGroupForm.controls["name"].value);
  }


  /**
   * This function adds the attribute into the attribute list.
   */
  addAttribute() : void{
    let preSelectedAttributes : IAttribute[] = this.attributeGroupForm.controls["attributeList"].value;

    preSelectedAttributes = !!preSelectedAttributes ? preSelectedAttributes : [];

    if(!!this.selectedAttribute) {
      preSelectedAttributes = [...preSelectedAttributes, this.selectedAttribute];
      this.attributeGroupForm.controls["attributeList"].setValue(preSelectedAttributes);

      this.dataSource.data = preSelectedAttributes;
      this.selectedAttribute = undefined;
      this.attributeName.setValue('');
    }   
  }

  /**
   * This function delete the attribute from the list of attributes which has been added into the list.
   */
  deleteAttribute() : void {    
    let preSelectedAttributes : IAttribute[] = this.attributeGroupForm.controls["attributeList"].value;

    let selectedElementIndex =  preSelectedAttributes.findIndex((attribute) => attribute.id == this.selectedRowIndex);

    if(selectedElementIndex != -1) {
      preSelectedAttributes.splice(selectedElementIndex, 1);
      this.attributeGroupForm.controls["attributeList"].setValue(preSelectedAttributes);  
      this.dataSource.data = preSelectedAttributes;
      this.selectedRowIndex = -1;
    }    
  }

  /**
   * This function view all attribute groups.
   */
  viewAllAttributeGroups() : void{
    this.router.navigate(['main/master/allAttributeGroups']);
  }

  onAttributeSelectionChanged(event : MatAutocompleteSelectedEvent){
    const filterValue = event.option.value.toLowerCase();

    this.selectedAttribute = this.attributeList.find((attribute) => attribute.name?.toLowerCase() == filterValue);
  }

  /**
   * This function filters all the attributes with matching input in auto complete dropdown.
   * @param value 
   * @returns 
   */
  private _filterAttribute(value: string) : IAttribute[]{
    const filterValue = !!value ? value.toLowerCase() : '';

    let parentItemGroups : IAttribute[] = this.attributeList;

    return parentItemGroups?.filter(option => option.name?.toLowerCase().includes(filterValue));    
  }

  highlight(row : IAttribute){
    this.selectedRowIndex = row.id || -1;
  }

  saveAttributeGroup() : void { 
    
    this.attributeGroupForm.controls["name"].markAsTouched();
    this.attributeGroupForm.controls["displayName"].markAsTouched();

    if(this.attributeGroupForm.valid) {
      this.overlayService.enableProgressSpinner();

      if(!!this.attributeGroupForm.controls["id"].value) {
        this.attributeGroupApi.update(this.attributeGroupForm.getRawValue()).subscribe({
          next: (data) => {
            this.router.navigate(['main/master/allAttributeGroups']);
            this.overlayService.disableProgressSpinner();
          }
        });
      }else{
        this.attributeGroupApi.save(this.attributeGroupForm.getRawValue()).subscribe({
          next: (data) => {
            this.router.navigate(['main/master/allAttributeGroups']);
            this.overlayService.disableProgressSpinner();
          }
        });
      }
    } 
  }

}
