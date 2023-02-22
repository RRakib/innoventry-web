import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { AttributeGroupLine } from 'src/app/models/AttributeGroupLine';
import { AttributeLine } from 'src/app/models/AttributeLine';
import { DynamicPropertyObject } from 'src/app/models/DynamicPropertyObject';
import { AttributeGroupServiceService, ChoiceListServiceService, IAttribute, IAttributeGroup, IAttributeLine, IChoice, IItemAttributeGroupLine, ItemServiceService } from 'src/server';
import * as _ from "lodash";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-configure-item-stock-attribute',
  templateUrl: './configure-item-stock-attribute.component.html',
  styleUrls: ['./configure-item-stock-attribute.component.css']
})
export class ConfigureItemStockAttributeComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  public itemStockAttributeForm!: FormGroup;
  isFormLoaded : boolean = false;

  configuredAttributes : IAttribute[];

  attributeGroupLines : IItemAttributeGroupLine[] = [];
  selectedAttrValues : Array<any> = [];
  dataSource = new MatTableDataSource<any>([]);
   /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns : Array<string> = [];

  selectedAttributeGroupLineId : number = -1;
  isNewGroupLineAdded : boolean = false;
  isEditAttrGrpLineEnabled : boolean = false;


  constructor(private breakpointObserver: BreakpointObserver, private itemService : ItemServiceService, 
    private attributeGroupService: AttributeGroupServiceService,private formBuilder : FormBuilder,
    private choiceListService : ChoiceListServiceService,
    @Inject(MAT_DIALOG_DATA) public data: { 
      itemId: number, 
      quantity: number , 
      isEditMode : boolean, 
      attributeGroupLines : Array<IItemAttributeGroupLine>
    },
    public stockAttributeCompRef: MatDialogRef<ConfigureItemStockAttributeComponent>,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {    
    this.itemService.findById(this.data.itemId).subscribe({
      next: (data) => {
        if(!!data && !!data.itemAttributeGroupId) { // Get attribute group id from Item.
          this.attributeGroupService.findById(data.itemAttributeGroupId).subscribe({
            next: (data) => {
              if(!!data.attributeList) { // Get all the attributes of an attribute group.

                // Initialize attribute form which consist of array.
                // Array of Form groups containing info of Attributes.
                this.configuredAttributes = data.attributeList;
                this.initializeAttributeGroupLineForm();                
              }
              this.isFormLoaded = true;
            }
          });
        }
      }
    });
  }

  /**
   * Inititalize Item Stock Attribute Form.
   * It contains an Array of FormGroup (Each act as an configured Attribute).
   */
  private initializeAttributeGroupLineForm() {
    this.itemStockAttributeForm = this.formBuilder.group({
      attributes: this.formBuilder.array([])
    });

    // Generate multiple attributes form.
    this.displayedColumns = [];
    this.generateAttributesForm();
  }

  // Function to create the form array of form group having attribute information.
  /**
   * By Default Quanitity FormGroup is pushed.
   * Loop through each configured attribute and update Parent Formgroup ('attributes' control)
   */
  generateAttributesForm() : void{

    // Add Quantity attribute as Default
    this.attributes.push(this.formBuilder.group({
      name: ['quantity'],
      refAttrId: [],
      title: ['quantity'],      
      value: [],
      type: ['NUMBER'],
      definedValue: []
    }));
    this.displayedColumns.push('quantity');       

    this.configuredAttributes.forEach((attribute) => {

      const attr = this.formBuilder.group({
          id: new FormControl(attribute.id),          
          name: new FormControl(attribute.name),
          refAttrId: new FormControl(attribute.refAttrId),
          choiceListId: new FormControl(attribute.choiceListId),
          title: new FormControl(attribute.displayName),
          value: new FormControl(),
          type: new FormControl(attribute.type),
          definedValue: new FormControl()
      });

      if(attribute.mandatory) {
        attr.controls["value"].addValidators(Validators.required);
      }

      this.attributes.push(attr);     

      // Add display columns for the table.
      this.displayedColumns.push(!!attribute.displayName ? attribute.displayName : 'No Display Name');       
    });

    // Add choices to the attributes of type 'IAttribute.TypeEnum.CHOICE'
    this.addChoicesForAttributes();
  }

  // Function to add choices to those attributes of type 'IAttribute.TypeEnum.CHOICE'
  private addChoicesForAttributes() : void{

    for(let i = 0; i< this.attributes.length; i++) {              
        let formGroup = this.attributes.at(i) as FormGroup;  
        if(formGroup.controls["type"].value ==  IAttribute.TypeEnum.CHOICE) {
             this.choiceListService.findById(formGroup.controls["choiceListId"].value).subscribe({
              next: (data) => {
                if(!!data) {
                  formGroup.patchValue({
                    definedValue : data.choices
                  });   
                }
              }
        });
        }
    }

    // This will work only in edit mode for first time.
    if(this.data.isEditMode 
      && !!this.data.attributeGroupLines && this.data.attributeGroupLines.length > 0 
      && !this.isNewGroupLineAdded 
      && !this.isEditAttrGrpLineEnabled) {
      this.attributeGroupLines.push(...this.data.attributeGroupLines);   
      this.displayStockAttrGroupLines();
    }
  }

  displayStockAttrGroupLines() : void{
    let attrGroupLines = Object.assign([], this.data.attributeGroupLines);
    this.generateTableRows(attrGroupLines);  // Updating datasource to view table Rows.
  }

  private generateTableRows(attrGroupLines: IItemAttributeGroupLine[]) {
    this.selectedAttrValues = [];

    for (let i = 0; i < attrGroupLines.length; i++) {
      let attrGroupLine: IItemAttributeGroupLine = attrGroupLines[i];

      let propKeyValue = new DynamicPropertyObject();
      propKeyValue.set("id", attrGroupLine.id);
      propKeyValue.set("quantity", attrGroupLine.quantity);

      if (!!attrGroupLine.attributeLines && attrGroupLine.attributeLines.length > 0) {
        for (let i = 0; i < attrGroupLine.attributeLines.length; i++) {
          let attrLine: IAttributeLine = attrGroupLine.attributeLines[i];

          if (!!attrLine.attributeName) {
            propKeyValue.set(attrLine.attributeName, attrLine.value);
          }
        }
      }

      this.selectedAttrValues.push(propKeyValue.items); // To view in Table.
    }

    this.dataSource.data = this.selectedAttrValues;
  }

  // Function to get attributes from Parent FormGroup.
  get attributes() {
    return this.itemStockAttributeForm.controls["attributes"] as FormArray;
  }

  // Update choices of attribute of type : REFERENCECHOICE.
  // On selection of Relevant Choice type attribute.
  getSelectedRefChoices(formGroup: AbstractControl) : void{
    const selectedAttrId = (formGroup as FormGroup).controls["id"].value;
    const selectedChoiceValue = (formGroup as FormGroup).controls["value"].value;
    const availableChoices : Array<any> = (formGroup as FormGroup).controls["definedValue"].value;

    let availableChoice : IChoice = availableChoices.find((choices) => choices["value"] == selectedChoiceValue);    

    // If selected choice has sub choice list then find the choices by using subChoiceListId
    if(!!availableChoice && !!availableChoice.subChoiceListId) {
      this.choiceListService.findById(availableChoice.subChoiceListId).subscribe({
        next: (data) => {
          if(!!data) {
            for(let i = 0; i< this.attributes.length; i++) {              
              let formGroup = this.attributes.at(i) as FormGroup;              
              if(formGroup.controls["refAttrId"].value == selectedAttrId) {
                formGroup.patchValue({
                  definedValue : data.choices
                });                
                break;
              }
            }
          }
        }
      });
    } else{
      // Update Reference Choices as Empty if no subChoiceListId present.
      for(let i = 0; i< this.attributes.length; i++) {              
        let formGroup = this.attributes.at(i) as FormGroup;              
        if(formGroup.controls["refAttrId"].value == selectedAttrId) {
          formGroup.patchValue({
            definedValue : []
          });                
          break;
        }
      }
    }
  }

  /**
   * Create an AttributeGroupLine.
   * Add AttributeLine from attributes present in Parent FormGroup.
   */
  addEditAttributeGroupLine() : void{

    this.attributes.markAllAsTouched();

    if(this.attributes.valid){
      
      if(!this.isEditAttrGrpLineEnabled) {
        let attrGroupLine : AttributeGroupLine = new AttributeGroupLine(); 
        attrGroupLine.jacksontype = "ItemAttributeGroupLineImpl";      
        attrGroupLine.attributeLines = [];
    
        let attributes : Array<any> = Object.assign([], this.attributes.value);
    
        // Multi Dynamic Property Object.
        let propKeyValue = new DynamicPropertyObject();
        propKeyValue.set("id",  Math.floor(Math.random() * (9000 - 1000 + 1)) + 1000);  // Random Id for Selection and highlight the selected row. 
    
        // Adding quantity in AttributeGroupLine
        let qtyFormGroup = attributes[0];
        attrGroupLine.quantity = qtyFormGroup["value"];
    
        propKeyValue.set(qtyFormGroup["name"], qtyFormGroup["value"]);
    
        for(let i = 1; i< attributes.length; i++) {
          let formGroup = attributes[i];
    
          let attrLine : AttributeLine = new AttributeLine();
          attrLine.jacksontype = "AttributeLineImpl";  
    
          attrLine.attributeId = formGroup["id"];
          attrLine.attributeName = formGroup["name"];
          attrLine.value = formGroup["value"];
    
          attrGroupLine.attributeLines?.push(attrLine);
    
          propKeyValue.set(formGroup["name"], formGroup["value"]);
        }
    
        
        this.selectedAttrValues.push(propKeyValue.items); // To view in Table.
        this.attributeGroupLines.push(attrGroupLine); // Behind the scenes attribute group line is being created.
    
        this.dataSource.data = [...this.selectedAttrValues];  // Updating datasource to view table Rows.
        this.isNewGroupLineAdded = true;
        this.initializeAttributeGroupLineForm(); // Re-Initialize to intital state of Form.
      }else{
        this.updateAttributeGroupLine();
      }
    }
  }

  // Close the component with attributeGroupLines.
  saveStockAttributes() : void{
    console.log(this.attributeGroupLines);

    const quantityAdded = this.attributeGroupLines.reduce(function (acc, obj) { return acc + (!!obj.quantity ?  obj.quantity : 0); }, 0);
    if(!(quantityAdded == this.data.quantity)) {
      this._snackBar.open(`Total Quantity should not exceed : ${this.data.quantity}`,'Close', {
        duration: 2000
      });  
    }else{    
      this.stockAttributeCompRef.close(this.attributeGroupLines);
    }
  }

  /**
   * Edit the selected attribute group line
   * Populate the attribute forms with the selected attribute lines from the attribute group line.
   */
  editSelectedAttributeGroupLine() : void{

    let index = this.selectedAttrValues.findIndex((addedAttrValues) => addedAttrValues.id == this.selectedAttributeGroupLineId);

    if(index != -1) {
      let attrGroupLine = this.attributeGroupLines[index];

      if(!!attrGroupLine) {

        this.isEditAttrGrpLineEnabled = true;
  
        for(let i = 0; i< this.attributes.length; i++) {              
          let formGroup = this.attributes.at(i) as FormGroup; // Get form group one by one to set value in 'value' control.
  
          if(formGroup.controls["name"].value == 'quantity'){ // As quantity is a custom attribute form group.
            formGroup.patchValue({
              value: attrGroupLine.quantity
            });
          }else{
            
            let selectedAttrLines = attrGroupLine.attributeLines;
  
            // Find the matching attribute line with the form group by name and attribute name.
            let matchedAttrLine = selectedAttrLines?.find((attrLine) => attrLine.attributeName == formGroup.controls["name"].value);
  
            if(!!matchedAttrLine) { // If found matched attribute update the form group with the values from matching attribute.
              formGroup.patchValue({
                value: matchedAttrLine.value
              });
  
              // Update the reference choices if CHOICE type form group control is updated.
              if(formGroup.controls["type"].value == IAttribute.TypeEnum.CHOICE) {
                this.getSelectedRefChoices(formGroup);
              }
            }
          }
        }
      }
    }
  }

  /**
   * Update exisiting attribute group line.
   */
  updateAttributeGroupLine() : void{
    let index = this.selectedAttrValues.findIndex((addedAttrValues) => addedAttrValues.id == this.selectedAttributeGroupLineId);

    if(index != -1) {
      let groupLineForUpdate = this.attributeGroupLines[index];

      if(!!groupLineForUpdate) {
        for(let i = 0; i< this.attributes.length; i++) {
          let formGroup = this.attributes.at(i) as FormGroup; // Get form group one by one to update value in 'value' control.
  
          if(formGroup.controls["name"].value == 'quantity'){ // As quantity is a custom attribute form group.
            groupLineForUpdate.quantity = formGroup.controls["value"].value;
          } else{
            let selectedAttrLines = groupLineForUpdate.attributeLines;
            
            // Find the matching attribute line with the form group by name and attribute name.
            let matchedAttrLine = selectedAttrLines?.find((attrLine) => attrLine.attributeName == formGroup.controls["name"].value);
            if(!!matchedAttrLine) { // If found matched attribute update the form group with the values from matching attribute.           
              matchedAttrLine.value = formGroup.controls["value"].value;
            }
          }
        }
        
        this.generateTableRows(this.attributeGroupLines);  // Updating datasource to view table Rows.
        this.initializeAttributeGroupLineForm(); // Re-Initialize to intital state of Form.
  
        this.selectedAttributeGroupLineId = -1; // Reset to -1
        this.isEditAttrGrpLineEnabled = false; // Disable edit attr group line
      }
    }
  }

  deleteSelectedAttributeGroupLine() : void{
    let index = this.selectedAttrValues.findIndex((addedAttrValues) => addedAttrValues.id == this.selectedAttributeGroupLineId);

    if(index != -1) {
      this.attributeGroupLines.splice(index,1);

      this.generateTableRows(this.attributeGroupLines);  // Updating datasource to view table Rows.
      
      this.selectedAttributeGroupLineId = -1; // Reset to -1
      this.isEditAttrGrpLineEnabled = false; // Disable edit attr group line
    }
  }

  resetForm() : void{
    this.initializeAttributeGroupLineForm(); // Re-Initialize to intital state of Form.  
    this.selectedAttributeGroupLineId = -1; // Reset to -1
    this.isEditAttrGrpLineEnabled = false; // Disable edit attr group line
  }

  cancelAddOrUpdate() : void{
    this.stockAttributeCompRef.close(this.data.attributeGroupLines);
  }

  highlight(row : any){
    this.selectedAttributeGroupLineId = row.id || -1;
  }

  toFormGroup = (form: AbstractControl) => form as FormGroup;

  getFormGroupControlTitleValue(formGroup: AbstractControl) : string{
    return (formGroup as FormGroup).controls["title"].value;
  }

  getFormGroupControlTypeValue(formGroup: AbstractControl) : string{    
    return (formGroup as FormGroup).controls["type"].value;
  }

  getFormGroupControlChoices(formGroup: AbstractControl) : Array<any>{  
    return (formGroup as FormGroup).controls["definedValue"].value;
  }
}


