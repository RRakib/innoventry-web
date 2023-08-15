import { AfterContentChecked, AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { correctHeight, detectBody } from 'src/app/components/post-login-views/welcome/welcome.helpers';
import { MenuConstants } from 'src/app/configs/MenuConstants';
import { NavItem } from 'src/app/models/NavItem';
import { PermissionsProvider } from 'src/app/services/permissions.provider';
import * as _ from "lodash";
import { AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';

declare var jQuery:any;

@Component({
  selector: 'side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.css']
})
export class SideNavigationComponent implements OnInit, AfterViewInit {

  navItems: NavItem[]; // Side Menu Items
  private menu: NavItem[]; // Private variable for Side Menus

  isMenuLoaded: boolean = false;


  userName: string;
  companyId : string;

  constructor(private permissionProvider : PermissionsProvider, public router: Router) { 
    this.userName = localStorage.getItem("userName") || '';
    this.companyId = localStorage.getItem("companyId") || '';
  }

  ngOnInit(): void {
    this.getMenu();
    this.isMenuLoaded = true;
  }

  ngAfterViewInit() {
    // Run correctHeight function on load and resize window event
    jQuery(window).bind("load resize", function() {
      correctHeight();
      detectBody();
    });

    // Correct height of wrapper after metisMenu animation.
    jQuery('.metismenu a').click(() => {
      setTimeout(() => {
        correctHeight();
      }, 300)
    });

    setTimeout(() => jQuery('#side-menu').metisMenu(), 4000);
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
       
      resolve(true);          
      });     
    });
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {

      let parentMenu = MenuConstants.MENUS.filter((parent) => {
        // find() will give -1, if no car was found that matched 
        //    car.make === 'BWM'
        return parent.children?.find((child) => child.displayName === item.displayName ? child : 
          child.children?.find((child1) => child1.displayName == item.displayName));
      });

      this.router.navigate([parentMenu[0].route + "/" + item.route]);
     
    }   
  }

  navigateToHome() : void{
    this.router.navigate(["main"]);
  }

}
