import { NavItem } from "../models/NavItem";

export class PartnerMenuConstants {
    public static MENUS: NavItem[] = [
        // {
        //   displayName: 'New License',
        //   iconName: 'access_time',
        //   route: 'partnerMainView/newLicense',
        //   cssClass: 'mt-2 font120',
        //   children: [ ]
        // },
        // {
        //     displayName: 'Renew License',
        //     iconName: 'autorenew',
        //     route: 'partnerMainView/renewLicense',
        //     cssClass: 'mt-2 font120',
        //     children: [ ]
        // },
        {
            displayName: 'Customers',
            iconName: 'group',
            route: 'partnerMainView/customers',
            cssClass: 'mt-2 font120',
            children: [ ]
        }
    ]
}