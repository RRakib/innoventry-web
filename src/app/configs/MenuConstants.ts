import { NavItem } from "../models/NavItem";

export class MenuConstants {

  public static MENUS: NavItem[] = [
    {
      displayName: 'Master',
      iconName: 'group',
      route: 'main/master',
      children: [
        {
          displayName: 'All Item',
          iconName: '',
          route: 'allItems',
          children: []

        },
        {
          displayName: 'All Ledgers',
          iconName: '',
          route: 'allLedgers',
          children: []

        },
        {
          displayName: 'Item Groups',
          iconName: '',
          route: 'allItemGroups',
          children: []
        },
        {
          displayName: 'Attribute',
          iconName: '',
          route: 'allAttributes',
          children: []
        },
        {
          displayName: 'Attribute Group',
          iconName: '',
          route: 'allAttributeGroups',
          children: []
        },        
        {
          displayName: 'Choice List',
          iconName: '',
          route: 'allChoiceList',
          children: []
        },
        {
          displayName: 'Manufacturer',
          iconName: '',
          route: 'allManufacturers',
          children: []
        },
        {
          displayName: 'Service Groups',
          iconName: '',
          route: 'allServiceGroups',
          children: []
        },
        {
          displayName: 'Service',
          iconName: '',
          route: 'allServices',
          children: []
        },
        {
          displayName: 'Other Charges',
          iconName: '',
          route: 'allOtherCharges',
          children: []
        }
      ]
    },
    {
      displayName: 'Transaction',
      iconName: 'currency_rupee',
      route: 'main/transaction',
      children: [
        {
          displayName: 'Payment',
          iconName: '',
          route: 'newVoucher/Payment',
          children: []
        },
        {
          displayName: 'Receipt',
          iconName: '',
          route: 'newVoucher/Receipt',
          children: []
        },
        {
          displayName: 'Journal',
          iconName: '',
          route: 'journal',
          children: []
        },
        {
          displayName: 'Sale',
          iconName: '',
          route: 'newOrder/sale',
          children: []
        },
        {
          displayName: 'Purchase',
          iconName: '',
          route: 'newOrder/purchase',
          children: []
        },
        {
          displayName: 'Sale Order',
          iconName: '',
          route: 'newOrder/saleOrder',
          children: []
        },
        {
          displayName: 'Quotation',
          iconName: '',
          route: 'newOrder/quotation',
          children: []
        }
      ]
    },
    {
      displayName: 'Reports',
      iconName: 'currency_rupee',
      route: 'main/report',
      children: [
        {
          displayName: 'Balance Sheet',
          iconName: '',
          route: 'balanceSheet',
          children: []
        },
        {
          displayName: 'Cash in hand',
          iconName: '',
          route: 'cashInHand',
          children: []
        },
        {
          displayName: 'Day Book',
          iconName: '',
          route: 'dayBook',
          children: [],
          permission: ['DAY_BOOK_REPORT']
        },
        {
          displayName: 'Day-Wise Ledger Balance',
          iconName: '',
          route: 'daywiseLedgerBalanceSummary',
          children: []
        },
        {
          displayName: 'Day-Wise LedgerGroup Balance',
          iconName: '',
          route: 'daywiseLedgerGroupBalanceSummary',
          children: []
        },
        {
          displayName: 'Inactive Ledgers',
          iconName: '',
          route: 'inactiveLedgers',
          children: []
        },
        {
          displayName: 'Item Register',
          iconName: '',
          route: 'itemRegister',
          children: []
        }, 
        {
          displayName: 'Item Purchase Rate Analysis',
          iconName: '',
          route: 'itemPrRateAnalysis',
          children: []
        },             
        {
          displayName: 'Item Purchase Rate Variation Analysis',
          iconName: '',
          route: 'itemPrRateVarAnalysis',
          children: []
        },        
        {
          displayName: 'Item Sale Summary',
          iconName: '',
          route: 'itemSaleSummary',
          children: []
        },
        {
          displayName: 'Item Transaction Register',
          iconName: '',
          route: 'itemTxRegister',
         children: []
        }, 
        {
          displayName: 'Ledger Book',
          iconName: '',
          route: 'ledgerBook',
          children: []
        },
        {
          displayName: 'Ledger Sale Summary',
          iconName: '',
          route: 'ledgerSaleSummary',
          children: []
        },
        {
          displayName: 'Ledger Purchase Summary',
          iconName: '',
          route: 'ledgerPurchaseSummary',
          children: []
        },
        {
          displayName: 'Outstanding Report',
          iconName: '',
          route: 'outstandingsReport',
          children: []
        },
        {
          displayName: 'Overstock Report',
          iconName: '',
          route: 'overStockReport',
          children: []
        },
        {
          displayName: 'Profit & Loss',
          iconName: '',
          route: 'profitLoss',
          children: []
        },
        {
          displayName: 'Purchase Register',
          iconName: '',
          route: 'purchaseRegister',
          children: []
        },
        {
          displayName: 'Sale Register',
          iconName: '',
          route: 'saleRegister',
          children: []
        },       
        {
          displayName: 'Stock Summary',
          iconName: '',
          route: 'stockSummary',
          children: []
        },
        {
          displayName: 'Sale Order Register',
          iconName: '',
          route: 'saleOrderRegister',
          children: []
        },
        {
          displayName: 'Trial Balance',
          iconName: '',
          route: 'trialBalance',
          children: []
        },
        {
          displayName: 'Understock Report',
          iconName: '',
          route: 'underStockReport',
          children: []
        }
      ]
    }
  ];

}
