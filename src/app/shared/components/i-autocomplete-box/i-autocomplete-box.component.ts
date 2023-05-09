import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'i-autocomplete-box',
  templateUrl: './i-autocomplete-box.component.html',
  styleUrls: ['./i-autocomplete-box.component.css']
})
export class IAutocompleteBoxComponent implements OnInit, OnChanges {

  @Input("optionBoxTitle")
  optionBoxTitle? : string;

  @Input("allOptions")
  allOptions : any[];
  
  @Input("optionFormControl")
  autoCompleteInput : FormControl = new FormControl();

  filteredOptions:  Observable<any[]>;

  selectedOption : any | undefined;

  @Output("onOptionSelection") 
  onOptionSelection = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    this.autoCompleteInput.valueChanges.subscribe({
      next: (data) => {
        this.selectedOption = undefined;
      }
    });

    this.filteredOptions = this.autoCompleteInput.valueChanges.pipe(startWith(this.autoCompleteInput.value), map(value => this._filterOptions(value)));
  }

  /**
   * This function is executed when we pass any default value in autoCompleteInput
   * This works in edit mode on page load **only**
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.selectedOption = undefined;
    this.filteredOptions = this.autoCompleteInput.valueChanges.pipe(startWith(this.autoCompleteInput.value), map(value => this._filterOptions(value)));
  }

  
  private _filterOptions(value: string) : any[]{    

    const filterValue = !!value ? value.toLowerCase() : '';    

    let options : any[] = this.allOptions;

    return options?.filter(option => option.name?.toLowerCase().includes(filterValue));    
  }

  public blurOptionTyped(event : any) : void{
    if(this.selectedOption == undefined) {
      this.onOptionSelection.emit(this.autoCompleteInput.value);
    }
  }


  public onOptionSelectionChanged(event : MatAutocompleteSelectedEvent) {
    const filterValue = event.option.value.toLowerCase();
    this.selectedOption =  this.allOptions.find(option => option.name!.toLowerCase().includes(filterValue));    

    this.onOptionSelection.emit(this.selectedOption);
  }

}
