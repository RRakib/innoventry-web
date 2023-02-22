import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { OverlayService } from 'src/app/services/overlay.service';
import { IAttribute, IChoiceList } from 'src/server';
import { AttributeServiceService } from 'src/server/api/attributeService.service';
import { ChoiceListServiceService } from 'src/server/api/choiceListService.service';

@Component({
  selector: 'app-new-edit-attribute',
  templateUrl: './new-edit-attribute.component.html',
  styleUrls: ['./new-edit-attribute.component.css']
})
export class NewEditAttributeComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  public attributeForm: FormGroup;
  isFormLoaded : boolean = false;
  attribute: IAttribute;

  attributeTypes =  IAttribute.TypeEnum;
  choiceList: IChoiceList[];

  selectedTypeLabel : string = 'Selected Type';

  constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder, 
    private attributeServiceApi: AttributeServiceService,
    private choiceListApi: ChoiceListServiceService,
    private overlayService : OverlayService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.attribute = {};
    this.choiceList = [];

    this.route.params.subscribe(params => { 
      if (params['attributeId']) {
        this.overlayService.enableProgressSpinner();

            this.attributeServiceApi.findById(params['attributeId']).subscribe({
              next: (data) => {
                this.attribute = data;
                this.initializeAttributeForm();
                this.isFormLoaded = true;

                if(this.attribute.type == IAttribute.TypeEnum.CHOICE) {
                  this.selectedTypeLabel = 'Choice';
                  this.choiceListApi.getObjects().subscribe({
                    next: (data) => {
                      this.choiceList = data;
                      this.attributeForm.controls["choiceListId"].enable();
                    }
                  });
                }else if(this.attribute.type == IAttribute.TypeEnum.REFERENCECHOICE) {
                  this.selectedTypeLabel = 'Attribute';
                  this.attributeServiceApi.getObjects().subscribe({
                    next: (data) => {
                      this.choiceList = data;
                      this.attributeForm.patchValue({
                        choiceListId:  this.attribute.refAttrId,
                        choiceListName:  this.attribute.refAttrName
                      });
                      this.attributeForm.controls["choiceListId"].enable();                    
                    }
                  });
                }

                this.overlayService.disableProgressSpinner();
              }
            });
      }else{
        this.initializeAttributeForm();
        this.isFormLoaded = true;
        this.overlayService.disableProgressSpinner();
      }
    });
  }


  private initializeAttributeForm() {
    this.attributeForm = this.formBuilder.group({
      jacksontype: 'AttributeImpl',
      id: new FormControl(this.attribute.id),
      name: new FormControl(this.attribute.name, [Validators.required]),
      displayName: new FormControl(this.attribute.displayName, [Validators.required]),
      type: new FormControl(this.attribute.type),
      description: new FormControl(this.attribute.description),
      choiceListId: new FormControl({value : this.attribute.choiceListId, disabled: true}),
      refAttrId: new FormControl(this.attribute.refAttrId),
      refAttrName: new FormControl(this.attribute.refAttrName),
      choiceListName: new FormControl({value : this.attribute.choiceListName, disabled: true}),
      mandatory: new FormControl(this.attribute.mandatory),
      printInTransaction: new FormControl(this.attribute.printInTransaction)
    });

    this.isFormLoaded = true;
  }

  updateDisplayName() : void{
    this.attributeForm.controls["displayName"].setValue(this.attributeForm.controls["name"].value);
  }

  changeAttributeType() : void{
    let selectedAttributetype = this.attributeForm.controls["type"].value;
    if(selectedAttributetype == IAttribute.TypeEnum.CHOICE) {
      this.selectedTypeLabel = 'Choice';

      this.overlayService.enableProgressSpinner();
      this.choiceListApi.getObjects().subscribe({
        next: (data) => {
          this.choiceList = data;
          this.attributeForm.controls["choiceListId"].enable();
          this.overlayService.disableProgressSpinner();
        }
      });
    } if(selectedAttributetype == IAttribute.TypeEnum.REFERENCECHOICE) {
      this.selectedTypeLabel = 'Attribute';

      this.overlayService.enableProgressSpinner();
      this.attributeServiceApi.getObjects().subscribe({
        next: (data) => {
          this.choiceList = data;
          this.attributeForm.controls["choiceListId"].enable();
          this.overlayService.disableProgressSpinner();
        }
      });
    }else{      
      this.attributeForm.controls["choiceListId"].setValue(undefined);
      this.attributeForm.controls["choiceListName"].setValue(undefined);
      this.attributeForm.controls["choiceListId"].disable();
    }
  }

  changeSelectedChoiceName(): void{
    if(!!this.attributeForm.controls["choiceListId"].value) {
      let selectedChoice =  this.choiceList.find((choice) => choice.id == this.attributeForm.controls["choiceListId"].value);
      this.attributeForm.patchValue({
        choiceListName: selectedChoice?.name
      });
    }else{
      this.attributeForm.patchValue({
        choiceListId: undefined,
        choiceListName: undefined
      });
    }
  }

  viewAllAttributes() : void{
    this.router.navigate(['main/master/allAttributes']);
  }

  updateSelectedTypeData() : void{    
    if(this.attributeForm.controls["type"].value == IAttribute.TypeEnum.REFERENCECHOICE) {
      this.attributeForm.patchValue({
        refAttrId: this.attributeForm.controls["choiceListId"].value,
        refAttrName:this.attributeForm.controls["choiceListName"].value,
        choiceListId: undefined,
        choiceListName: undefined
      });
    }
  }

  saveAttribute(): void {
    if(this.attributeForm.valid) {
      this.updateSelectedTypeData();
      if(!!this.attributeForm.controls["id"].value) {
        this.attributeServiceApi.update(this.attributeForm.getRawValue()).subscribe({
          next: (data) => {
            this.viewAllAttributes();
          }
        });
      }else{
        this.attributeServiceApi.save(this.attributeForm.getRawValue()).subscribe({
          next: (data) => {
            this.viewAllAttributes();
          }
        });
      }
    }    
  }
  
}
