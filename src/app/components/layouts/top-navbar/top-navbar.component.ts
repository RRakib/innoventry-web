import { Component, OnInit } from '@angular/core';
import { smoothlyMenu } from 'src/app/components/post-login-views/welcome/welcome.helpers';

declare var jQuery:any;

@Component({
  selector: 'top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  
  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }
  

}
