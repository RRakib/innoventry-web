import { NavItem } from "../models/NavItem";

export class TopMenuConstants {

    public static MENUS: NavItem[] = [
        {
          displayName: 'Customer',
          iconName: 'fa fa-user',
          route: '',
          children: [
            {    
              displayName: 'New Customer',
              iconName: 'person_add',
              route: 'master/newLedger/customer',
              children: [],
              permission: []
            },
            {    
              displayName: 'Sale',
              iconName: 'person_add',
              route: 'transaction/newOrder/sale',
              children: [],
              permission: []
            },
            {    
              displayName: 'Receipt',
              iconName: 'person_add',
              route: 'transaction/newVoucher/Receipt',
              children: [],
              permission: []
            },
            {    
              displayName: 'Quotation',
              iconName: 'person_add',
              route: 'transaction/newOrder/quotation',
              children: [],
              permission: []
            },
            {    
              displayName: 'Sale Order',
              iconName: 'person_add',
              route: 'transaction/newOrder/saleOrder',
              children: [],
              permission: []
            },
            {    
              displayName: 'Ledger Book',
              iconName: 'person_add',
              route: 'report/ledgerBook',
              children: [],
              permission: []
            },
            {    
              displayName: 'Outstanding Report',
              iconName: 'person_add',
              route: 'report/outstandingsReport',
              children: [],
              permission: []
            }
          ]
        },
        {
          displayName: 'Supplier',
          iconName: 'fa fa-users',
          route: '',
          children: [
            {    
              displayName: 'New Supplier',
              iconName: 'person_add',
              route: 'master/newLedger/supplier',
              children: [],
              permission: []
            },
            {    
              displayName: 'Purchase',
              iconName: 'person_add',
              route: 'transaction/newOrder/purchase',
              children: [],
              permission: []
            },
            {    
              displayName: 'Payment',
              iconName: 'person_add',
              route: 'transaction/newVoucher/Payment',
              children: [],
              permission: []
            },
            {    
              displayName: 'Ledger Book',
              iconName: 'person_add',
              route: 'report/ledgerBook',
              children: [],
              permission: []
            },
            {    
              displayName: 'Outstanding Report',
              iconName: 'person_add',
              route: 'report/outstandingsReport',
              children: [],
              permission: []
            }
          ]
        },
        {
          displayName: 'Accounting',
          iconName: 'fa fa-credit-card',
          route: '',
          children: [
            {    
              displayName: 'Journal',
              iconName: 'person_add',
              route: 'transaction/journal',
              children: [],
              permission: []
            },
            {    
              displayName: 'Trial Balance',
              iconName: 'person_add',
              route: 'report/trialBalance',
              children: [],
              permission: []
            }
          ]
        },
        {
          displayName: 'Inventory',
          iconName: 'fa fa-bar-chart',
          route: '',
          children: [
            {    
              displayName: 'New Item',
              iconName: 'person_add',
              route: 'master/newItem',
              children: [],
              permission: []
            },
            {    
              displayName: 'Stock Summary',
              iconName: 'person_add',
              route: 'report/stockSummary',
              children: [],
              permission: []
            },
            {    
              displayName: 'Understock Report',
              iconName: 'person_add',
              route: 'report/underStockReport',
              children: [],
              permission: []
            },
            {    
              displayName: 'Overstock Report',
              iconName: 'person_add',
              route: 'report/overStockReport',
              children: [],
              permission: []
            }
          ]
        },
        {
          displayName: 'Reports',
          iconName: 'fa fa-line-chart',
          route: '',
          children: [
            {    
              displayName: 'Day Book',
              iconName: 'person_add',
              route: 'report/dayBook',
              children: [],
              permission: ['DAY_BOOK_REPORT']
            },
            {
              displayName: 'Cash in hand',
              iconName: '',
              route: 'report/cashInHand',
              children: [],
              permission: []
            }
          ],
          permission: []
        }
    ];
}