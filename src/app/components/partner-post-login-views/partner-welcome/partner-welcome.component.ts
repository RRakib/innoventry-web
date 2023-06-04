import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';
import { PartnerMenuConstants } from 'src/app/configs/PartnerMenuConstants';
import { NavItem } from 'src/app/models/NavItem';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-partner-welcome',
  templateUrl: './partner-welcome.component.html',
  styleUrls: ['./partner-welcome.component.css']
})
export class PartnerWelcomeComponent implements OnInit, AfterViewInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  @ViewChild('drawer')
  drawer !: MatSidenav;

  userName: string;

  navItems: NavItem[]; // Side Menu Items

  constructor(private breakpointObserver: BreakpointObserver, 
    public navService: NavService, private router: Router) {
    this.userName = localStorage.getItem("userName") || '';
   }

  ngOnInit(): void {
    this.navItems = PartnerMenuConstants.MENUS;   
  }

  ngAfterViewInit() {
    this.navService.setDrawerRef(this.drawer);
  } 

  logoutPartner() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');

    this.router.navigate(['/login']);    
  }
}
