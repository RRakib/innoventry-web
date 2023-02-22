import {EventEmitter,ElementRef, Injectable, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {Event, NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class NavService {
  
  drawer: MatSidenav;

  public currentUrl = new BehaviorSubject<string>('');

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  public setDrawerRef(drawerRef : MatSidenav) : void{
    this.drawer = drawerRef;
  }

  public closeNav() {    
    this.drawer.toggle();
  }

  public openNav() {
    this.drawer.toggle();
  }
}
