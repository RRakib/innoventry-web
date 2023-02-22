import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AngularTreeGridComponent } from 'angular-tree-grid';

/**
columns: [
  {
    name: 'name',
    header: 'Name',
    css_class: 'text-left'
  },
  {
    name: 'age',
    header: 'Age',
    renderer: function(value: string) {
      return value + ' years';
    }
  }
]
**/

/**
 * Parent data will have  parent = 0
 rowData = [
    { id: 1, name: 'Ashok', age: 60, parent: 0},
    { id: 2, name: 'Sam', age: 40, parent: 1},
    { id: 3, name: 'Sriya', age: 36, parent: 1},
    { id: 4, name: 'Prakash', age: 20, parent: 2},
    { id: 5, name: 'Sneha', age: 21, parent: 3},
    { id: 6, name: 'Pritam', age: 60, parent: 34},
    { id: 7, name: 'Roshan', age: 40, parent: 6},
    { id: 8, name: 'Suraj', age: 36, parent: 6},
    { id: 9, name: 'Swarup', age: 20, parent: 8},
    { id: 10, name: 'Aditya', age: 21, parent: 8},
    { id: 34, name: 'Bhavuk', age: 21, parent: 0},
  ]
 */

@Component({
  selector: 'i-tree-table',
  templateUrl: './i-tree-table.component.html',
  styleUrls: ['./i-tree-table.component.css']
})
export class ITreeTableComponent implements OnInit {

  @ViewChild('angularGrid', {static: true}) angularGrid: AngularTreeGridComponent;

  @Input("tableLabel")
  public tableLabel : string;

  @Input("columnDefs")
  public columnsDefs : Array<any>;

  @Input("data")
  public data! : Array<any>;

  @Input("enableRowEdit")
  public enableRowEdit : boolean = true;

  @Output("onRowSelection") 
  onRowSelection = new EventEmitter<any>();

  @Output("onRowEdit") 
  onRowEdit = new EventEmitter<any>();

  public isRowSelected : boolean = false;

  configs: any;

  constructor() { }

  ngOnInit(): void {

    this.configs = {
      id_field: 'id',
      parent_id_field: 'parent',
      parent_display_field: 'id', 
      data_loading_text: 'No records found.',
      pagination: true,   
      css:{
        table_class: 'full-width-table',
        header_class: 'angular-tree-grid-header'
      },
      columns: this.columnsDefs
    };

  }

  rowSelected(event: any) : void{
    if(this.enableRowEdit) {
      this.isRowSelected = true;   
      this.onRowSelection.emit(event);
    }    
  }

  editRow(): void{
    this.onRowEdit.emit();
  }

  expandAll() {
    this.angularGrid.expandAll();
  }
  collapseAll() {
    this.angularGrid.collapseAll();
  }
}
