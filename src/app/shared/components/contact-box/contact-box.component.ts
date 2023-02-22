import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { IContact } from 'src/server';
import { ContactServiceService } from 'src/server/api/contactService.service';

@Component({
  selector: 'Contact-Box',
  templateUrl: './contact-box.component.html',
  styleUrls: ['./contact-box.component.css']
})
export class ContactBoxComponent implements OnInit, OnChanges {

  @Input("contactBoxTitle")
  contactBoxTitle? : string = "Contact";

  @Input("contactFormControl")
  autoCompleteInput : FormControl = new FormControl();
  
  @Output("onContactSelection") 
  onContactSelection = new EventEmitter<IContact>();
  
  allContacts : IContact[];
  filteredContacts:  Observable<IContact[]>;

  contactNameSelected : boolean = false;

  selectedContact : IContact | undefined;

  constructor(private contactServiceApi : ContactServiceService) { }

  ngOnInit(): void {
    this.fetchContactsFromServer();
  }

   /**
   * This function is executed when we pass any default value in autoCompleteInput
   * This works in edit mode on page load **only**
   * @param changes 
   */
    ngOnChanges(changes: SimpleChanges): void {
      this.filteredContacts = this.autoCompleteInput.valueChanges
            .pipe(startWith(this.autoCompleteInput.value), map(value => this._filterContacts(value)));
  
      console.log("**** Contact input has been changed *********");
    }

  public fetchContactsFromServer() : void {    
    this.allContacts = [];

    this.contactServiceApi.getObjects().subscribe({
      next: (data) => {
        if (!!data && data.length > 0) {
          this.allContacts = data;

           // Works in edit mode to display value in input field (by FormControl)
          // Only when the default value is being provided.
          // Not works when user select any Contact after page load.
          let ContactInEditMode: IContact[] = [];
          if (!!this.autoCompleteInput.value && this.autoCompleteInput.value.length > 0) {
            ContactInEditMode = this._filterContacts(this.autoCompleteInput.value);
            this.autoCompleteInput.setValue(ContactInEditMode[0].name);
          }

           // Return Contact object in case if ContactName is provided
          // This works with default Contact name and in edit mode.         
          if (ContactInEditMode.length == 1) {
            this.contactNameSelected = true;
            this.autoCompleteInput.setErrors(null);

            this.onContactSelection.emit(ContactInEditMode[0]);
          }

          this.filteredContacts = this.autoCompleteInput.valueChanges.pipe(startWith(this.autoCompleteInput.value), map(value => this._filterContacts(value)));
        }
      }
    });

  }

  private _filterContacts(value: string) : IContact[]{
    this.contactNameSelected = false;

    const filterValue = !!value ? value.toLowerCase() : '';

    let contacts : IContact[] = this.allContacts;

    return contacts?.filter(option => option.name?.toLowerCase().includes(filterValue));    
  }

  public onContactSelectionChanged(event : MatAutocompleteSelectedEvent) {
    const filterValue = event.option.value.toLowerCase();

    this.selectedContact =  this.allContacts.find(option => option.name!.toLowerCase().includes(filterValue));

    if(!!this.selectedContact){
      this.contactNameSelected = true;
      this.autoCompleteInput.setErrors(null);
    }
  }

  blurContactNameSelection(event : any) : void{
    if(!this.contactNameSelected){
      this.autoCompleteInput.setErrors({forbiddenNames: { value: 'Please select any option.'}});
    }else{
      this.onContactSelection.emit(this.selectedContact);
    }
  }
}
