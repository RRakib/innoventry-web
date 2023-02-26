import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { map, Observable } from 'rxjs';
import { GetObjectsArgument, ITaxGroup } from 'src/server';
import { TaxGroupServiceService } from 'src/server/api/taxGroupService.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'tax-group-box',
  templateUrl: './tax-group-box.component.html',
  styleUrls: ['./tax-group-box.component.css']
})
export class TaxGroupBoxComponent implements OnInit, OnChanges {

  @Input("taxGroupFormControl")
  autoCompleteInput : FormControl = new FormControl();

  @Output("onTaxGroupSelection") 
  onTaxGroupSelection = new EventEmitter<ITaxGroup>();

  taxGroups : ITaxGroup[];
  filteredTaxGroups:  Observable<ITaxGroup[]>;

  getTaxGroupsByCriteria : GetObjectsArgument = {}; 

  
  constructor(private taxGroupService : TaxGroupServiceService) { }

  ngOnInit(): void {
    this.fetchTaxGroupsFromServer();
  }

  /**
   * This function is executed when we pass any default value in autoCompleteInput
   * This works in edit mode on page load **only**
   * @param changes 
   */
   ngOnChanges(changes: SimpleChanges): void {
    this.filteredTaxGroups = this.autoCompleteInput.valueChanges
          .pipe(startWith(this.autoCompleteInput.value), map(value => this._filterTaxGroups(value)));

    console.log("**** Tax Group input has been changed *********");
  }


  private fetchTaxGroupsFromServer() {
    this.getTaxGroupsByCriteria.startPageIndex = 0;
    this.getTaxGroupsByCriteria.genericSearch = false;

    this.taxGroups = [];

    this.taxGroupService.getObjects().subscribe({
      next: (data) => {
        if (!!data && data.length > 0) {
          this.taxGroups = data;

          // Works in edit mode to display value in input field (by FormControl)
          // Only when the default value is being provided.
          // Not works when user select any ledger after page load.
          let taxGroupInEditMode: ITaxGroup[] = [];
          if (!!this.autoCompleteInput.value && this.autoCompleteInput.value.length > 0) {
            taxGroupInEditMode = this._filterTaxGroups(this.autoCompleteInput.value);
            this.autoCompleteInput.setValue(taxGroupInEditMode[0].name);
          }

          this.filteredTaxGroups = this.autoCompleteInput.valueChanges.pipe(startWith(this.autoCompleteInput.value), map(value => this._filterTaxGroups(value)));

          // Return ledger object in case if ledgerName is provided
          // This works with default ledger name and in edit mode.         
          if (taxGroupInEditMode.length == 1) {
            this.onTaxGroupSelection.emit(taxGroupInEditMode[0]);
          }

            
        }
      }
    });
  }


  private _filterTaxGroups(value: string) : ITaxGroup[]{
    const filterValue = !!value ? value.toLowerCase() : '';

    let taxGroups : ITaxGroup[] = this.taxGroups;

    return taxGroups?.filter(option => option.name?.toLowerCase().includes(filterValue));     
  }

  public onTaxGroupSelectionChanged(event : MatAutocompleteSelectedEvent) {
    const filterValue = event.option.value.toLowerCase();

    let taxGroup  = this.taxGroups.find((taxGroup) => taxGroup.name?.toLowerCase().includes(filterValue));

    if(!!taxGroup){
      this.onTaxGroupSelection.emit(taxGroup);
    }
  }

}
