import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { smoothlyMenu } from 'src/app/components/post-login-views/welcome/welcome.helpers';
import { TopMenuConstants } from 'src/app/configs/TopMenuConstants';
import { NavItem } from 'src/app/models/NavItem';
import * as _ from "lodash";
import { PermissionsProvider } from 'src/app/services/permissions.provider';
import { AuthenticationService } from 'src/app/services/authentication.service';

declare var jQuery:any;

@Component({
  selector: 'top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {

  navItems: NavItem[]; // Side Menu Items
  private menu: NavItem[]; // Private variable for Side Menus

  isMenuLoaded: boolean = false;

  constructor(private permissionProvider : PermissionsProvider, public router: Router, 
    private authService : AuthenticationService) { }

  ngOnInit(): void {
    this.getMenu();
    this.isMenuLoaded = true;
  }

  
  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }

  getMenu = (): Promise<any>=> {
    return new Promise((resolve, reject) => {
      Promise.all([this.permissionProvider.getPermissions()]).then((value) => {
        //return this.menu;
       this.menu = TopMenuConstants.MENUS;      

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
       
       console.log(this.navItems);

       resolve(true);          
      });     
    });
  }
  
  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {

      let parentMenu = TopMenuConstants.MENUS.filter((parent) => {
        // find() will give -1, if no car was found that matched 
        //    car.make === 'BWM'
        return parent.children?.find((child) => child.displayName === item.displayName ? child : 
          child.children?.find((child1) => child1.displayName == item.displayName));
      });

      this.router.navigate(['main' + "/" + parentMenu[0].route + "/" + item.route]);
     
    }   
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

}
