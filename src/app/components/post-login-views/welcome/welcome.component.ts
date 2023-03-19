import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MenuConstants } from 'src/app/configs/MenuConstants';
import { Router } from '@angular/router';
import { NavItem } from 'src/app/models/NavItem';
import { PermissionsProvider } from 'src/app/services/permissions.provider';
import * as _ from "lodash";
import { NavService } from 'src/app/services/nav.service';
import { MatSidenav } from '@angular/material/sidenav';
import { TopMenuConstants } from 'src/app/configs/TopMenuConstants';
import { CommonUtils } from 'src/app/shared/utils/commonUtils';
import { environment } from 'src/environments/environment';
import { CompanyPlanServiceService, PCompanyPlanInfo } from 'src/server';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterViewInit{
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  @ViewChild('drawer')
  drawer !: MatSidenav;

  userName: string;
  companyId : string;

  navItems: NavItem[]; // Side Menu Items
  private menu: NavItem[]; // Private variable for Side Menus

  topNavItems : NavItem[];
  private topMenu : NavItem[];

  public companyPlanInfo : PCompanyPlanInfo = {};

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, 
    private permissionProvider : PermissionsProvider,
    public navService: NavService,
    private commonUtils : CommonUtils,
    private companyPlanService :  CompanyPlanServiceService) {
    this.userName = localStorage.getItem("userName") || '';
    this.companyId = localStorage.getItem("companyId") || '';
   }
  ngOnInit(): void {
    this.getMenu();   
    
    this.companyPlanService.getCompanyPlanInfo().subscribe({
      next: (data) => {
        this.companyPlanInfo = data;       
      }
    });
  }

  ngAfterViewInit() {
    this.navService.setDrawerRef(this.drawer);
  } 
  

  getMenu = (): Promise<any>=> {
    return new Promise((resolve, reject) => {
      Promise.all([this.permissionProvider.getPermissions()]).then((value) => {
        //return this.menu;
       this.menu = MenuConstants.MENUS;      

       let sideHierarchicalMenu: NavItem[] = [];
       for (let i = 0; i < this.menu.length; i++) {
         let menuObj = Object.assign({}, this.menu[i]);
         if (this.permissionProvider.canAccess(menuObj.permission || [])) {
           if (menuObj.children) {
             menuObj.children = _.filter(menuObj.children, (submenu: any)=>{
               return this.permissionProvider.canAccess(submenu.permission || []);
             });
           }
           sideHierarchicalMenu.push(menuObj);
         }
       }
       this.navItems = sideHierarchicalMenu;


       this.topMenu = TopMenuConstants.MENUS;  
       let topHierarchicalMenu: NavItem[] = [];

       for (let i = 0; i < this.topMenu.length; i++) {
        let menuObj = Object.assign({}, this.topMenu[i]);
        if (this.permissionProvider.canAccess(menuObj.permission || [])) {
          if (menuObj.children) {
            menuObj.children = _.filter(menuObj.children, (submenu: any)=>{
              return this.permissionProvider.canAccess(submenu.permission || []);
            });
          }
          topHierarchicalMenu.push(menuObj);
        }
      }
      this.topNavItems = topHierarchicalMenu;
      resolve(true);
      });     
    });
  }

  returnToHome() : void{    
    this.router.navigate(['/main']);
  }

  public openOldVersion() : void {
    this.commonUtils.openURL(environment.webappUrl);
  }

  logout() : void{
    localStorage.removeItem('authToken');
    localStorage.removeItem('companyId');
    localStorage.removeItem('userName');

    this.router.navigate(['/login']);    
  }

}
