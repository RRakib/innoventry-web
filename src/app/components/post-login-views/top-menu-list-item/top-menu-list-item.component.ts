import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavItem } from 'src/app/models/NavItem';

@Component({
  selector: 'app-top-menu-list-item',
  templateUrl: './top-menu-list-item.component.html',
  styleUrls: ['./top-menu-list-item.component.scss']
})
export class TopMenuListItemComponent implements OnInit {
  @Input() items: NavItem[];

  @ViewChild('childMenu', {static: true}) 
  public childMenu: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
