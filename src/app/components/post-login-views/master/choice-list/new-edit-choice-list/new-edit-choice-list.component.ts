import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';
import { OverlayService } from 'src/app/services/overlay.service';
import { GetObjectsArgument, IChoice, IChoiceList } from 'src/server';
import { ChoiceListServiceService } from 'src/server/api/choiceListService.service';


@Component({
  selector: 'app-new-edit-choice-list',
  templateUrl: './new-edit-choice-list.component.html',
  styleUrls: ['./new-edit-choice-list.component.scss']
})
export class NewEditChoiceListComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  public choiceListForm: FormGroup;
  isFormLoaded : boolean = false;
  choiceList: IChoiceList;

  getObjectsArgument: GetObjectsArgument;
  allChoiceList : IChoiceList[] | undefined;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['value','subChoiceListName'];

  public dataSource = new MatTableDataSource<IChoice>([]);

  selectedRow : IChoice | undefined = undefined;
  editChoiceEnabled : boolean = false;

  constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder,
    private overlayService : OverlayService,
    private router: Router,
    private route: ActivatedRoute,
    private choiceListService : ChoiceListServiceService) { 
      this.getObjectsArgument = {};
      this.getObjectsArgument.startPageIndex = 0;
      this.getObjectsArgument.genericSearch = false;
  }

  ngOnInit(): void {

    this.choiceList = {};

    this.overlayService.enableProgressSpinner();
    this.choiceListService.getObjectsSearchArg(this.getObjectsArgument).subscribe({
      next: (data) => {
          this.allChoiceList = !!data.objects  ? data.objects : [];          

          this.route.params.subscribe(params => { 
            if (params['choiceListId']) {      
                  this.choiceListService.findById(params['choiceListId']).subscribe({
                    next: (data) => {
                      this.choiceList = data;
                      this.initializeChoiceListForm();
                      this.isFormLoaded = true;
      
                      this.overlayService.disableProgressSpinner();
                    }
                  });
            }else{
              this.initializeChoiceListForm();
              this.isFormLoaded = true;
              this.overlayService.disableProgressSpinner();
            }
          });
      }
    });
  }

  /** Initialize Choice list form with a nested form group for adding/updating choices */
  private initializeChoiceListForm() {
    
    this.choiceListForm = this.formBuilder.group({
      jacksontype: 'ChoiceListImpl',
      id: new FormControl(this.choiceList.id),
      name: new FormControl(this.choiceList.name, [Validators.required]),      
      description: new FormControl(this.choiceList.description),
      choiceSelectionForm: this.formBuilder.group({   
        jacksontype: "ChoiceImpl",
        value: new FormControl(null),
        subChoiceListId: new FormControl(null),
        subChoiceListName: new FormControl(null)
      }),
      choices: [this.choiceList.choices || []]  // Pre-selected choices in case of edit mode other wise []
    });

    this.dataSource.data = this.choiceListForm.controls["choices"].value  as IChoice[];
    this.isFormLoaded = true;
  }

  /**
   * This function is executed on click of + icon.
   * Works in Edit mode to update the selected choice.
   */
  addUpdateChoice() :void{ 
    let choiceSelectionForm =  this.choiceListForm.get("choiceSelectionForm") as FormGroup;

    // Add Validator at runtime.
    choiceSelectionForm.controls["value"].addValidators([Validators.required]);
    choiceSelectionForm.controls["value"].updateValueAndValidity();

    choiceSelectionForm.markAllAsTouched();

    if(choiceSelectionForm.valid) {
      const selectedRefChoiceName = this.allChoiceList?.find(e => e.id == choiceSelectionForm.controls["subChoiceListId"]?.value)?.name;

      // If reference choice list has been selected.
      if(!!selectedRefChoiceName) {
        choiceSelectionForm.patchValue({
          subChoiceListName: selectedRefChoiceName
        });
      }

      if(this.editChoiceEnabled && this.selectedRow) { // Edit mode.

        // Update the selected row by reference of IChoices.
        this.selectedRow.value  = choiceSelectionForm.controls["value"]?.value;
        this.selectedRow.subChoiceListId  = choiceSelectionForm.controls["subChoiceListId"]?.value;

        if(choiceSelectionForm.controls["subChoiceListName"]?.value) {
          this.selectedRow.subChoiceListName  = choiceSelectionForm.controls["subChoiceListName"]?.value;
        }

        this.selectedRow = undefined;
        this.editChoiceEnabled = false;
      }else{ // New mode.
        (this.choiceListForm.controls["choices"].value as IChoice[]).push(choiceSelectionForm.value);
      }
      
      this.dataSource.data = this.choiceListForm.controls["choices"].value; // Update table data.

      this.resetChoiceSelectionForm();      
    }
  }

  /** This function is executed on click of edit icon */
  editSelectedChoice() : void{
    this.editChoiceEnabled = true;

    if(!!this.selectedRow) {
      this.choiceListForm.get("choiceSelectionForm")?.patchValue({
        value: this.selectedRow?.value,
        subChoiceListId: this.selectedRow?.subChoiceListId,
        subChoiceListName: this.selectedRow?.subChoiceListName
      });       
    }
  }

  /** Reset choice selection form */
  private resetChoiceSelectionForm() : void{
    let choiceSelectionForm =  this.choiceListForm.get("choiceSelectionForm") as FormGroup;
    choiceSelectionForm.patchValue({
        value: null,
        subChoiceListId: null,
        subChoiceListName: null
    });   

    choiceSelectionForm.controls["value"].clearValidators();
    choiceSelectionForm.controls["value"].updateValueAndValidity();
  }

  /** This function is executed on cancelling the edit mode. */
  cancelEdit() : void{
    this.resetChoiceSelectionForm();
    this.editChoiceEnabled = false;
    this.selectedRow = undefined;
  }

  /** This function delete the selected option from the list of choices. */
  deleteSelectedChoice(): void{

    this.choiceListForm.controls["choices"].setValue(
      (this.choiceListForm.controls["choices"].value as IChoice[]).filter(e => e.value != this.selectedRow?.value));

    this.dataSource.data = this.choiceListForm.controls["choices"].value;
    this.editChoiceEnabled = false;
    this.selectedRow = undefined;
  }

  highlight(row : IChoice){
    if(!this.editChoiceEnabled) {
      this.selectedRow = row || undefined;
    }
  }

  viewAllChoiceLists() : void{
    this.router.navigate(['main/master/allChoiceList']);
  }

  saveChoiceList(): void {    
    if(this.choiceListForm.valid) {
      
      if(!!this.choiceList.id) {
        this.choiceListService.update(this.choiceListForm.value).subscribe({
          next: (data) => {
            if(!!data) {
              this.router.navigate(['main/master/allChoiceList']);
            }
          }
        });
      }else{
        this.choiceListService.save(this.choiceListForm.value).subscribe({
          next: (data) => {
            if(!!data) {
              this.router.navigate(['main/master/allChoiceList']);
            }
          }
        });
      }
      
    }
  }

}
