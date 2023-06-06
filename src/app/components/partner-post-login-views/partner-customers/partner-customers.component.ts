import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { NavService } from 'src/app/services/nav.service';
import { ItemLicenseReportLine, PartnerItemLicenseReportArg, PartnerItemLicenseReportServiceService } from 'src/server';

@Component({
  selector: 'app-partner-customers',
  templateUrl: './partner-customers.component.html',
  styleUrls: ['./partner-customers.component.css']
})
export class PartnerCustomersComponent implements OnInit, AfterViewInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  reportArg: PartnerItemLicenseReportArg;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['customer',
    'item',
    'mobile',
    'email',
    'amcDate',
    'expiryDate',
    'productKey'
  ];

  public dataSource = new MatTableDataSource<ItemLicenseReportLine>([]);
  @ViewChild(MatPaginator) paginator: any = MatPaginator;

  allCustomers: ItemLicenseReportLine[] = [];

  @ViewChild('filterInput')
  filterInput: ElementRef;

  customerCount: number = 0;

  constructor(private partnerItemLicenseReportService: PartnerItemLicenseReportServiceService,
    public navService: NavService,
    private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.getAllCustomer();

  }

  private getAllCustomer() {
    this.reportArg = {};
    this.customerCount = 0;
    this.partnerItemLicenseReportService.getReportArg(this.reportArg).subscribe({
      next: (data) => {
        this.allCustomers = data.lines || [];
        this.dataSource.data = data.lines || [];
        this.customerCount = data.lines != undefined && data.lines.length > 0
          ? data.lines.length : 0;

        this.navService.closeNav();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(enteredValue: Event) {
    let filterValue = (enteredValue.target as HTMLInputElement).value;
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  changeCustomerList(value: any) {

    let date = new Date();

    let next2MonthsDate = new Date(new Date().setMonth(date.getMonth() + 2));
    let last2MonthsDate = new Date(new Date().setMonth(date.getMonth() - 2));

    let updatedCustomerList: ItemLicenseReportLine[] = [];

    switch (value) {
      case 0:
        this.getAllCustomer();
        break;
      case 1:
        updatedCustomerList = this.allCustomers.filter((customer) => 
          customer.expiryDate != undefined
          && date <= customer.expiryDate && customer.expiryDate <= next2MonthsDate
        );        
        break;
      case 2:
        updatedCustomerList = this.allCustomers.filter((customer) => 
          customer.expiryDate != undefined
          && last2MonthsDate <= customer.expiryDate && customer.expiryDate <= date
        );
        break;
      default:
        this.getAllCustomer();
        break;
    }    
    this.dataSource.data = updatedCustomerList;
    this.customerCount = updatedCustomerList.length > 0 ? updatedCustomerList.length : 0;
  }
}
