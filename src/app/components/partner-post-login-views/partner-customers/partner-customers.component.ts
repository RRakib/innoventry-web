import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NavService } from 'src/app/services/nav.service';
import { ItemLicenseReportLine, PartnerItemLicenseReportArg, PartnerItemLicenseReportServiceService } from 'src/server';

@Component({
  selector: 'app-partner-customers',
  templateUrl: './partner-customers.component.html',
  styleUrls: ['./partner-customers.component.css']
})
export class PartnerCustomersComponent implements OnInit, AfterViewInit {

  reportArg : PartnerItemLicenseReportArg;

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

  @ViewChild('filterInput') 
  filterInput: ElementRef;

  customerCount : number = 0;

  constructor(private partnerItemLicenseReportService : PartnerItemLicenseReportServiceService,
    public navService: NavService) { }

  ngOnInit(): void {
    this.reportArg = {};
    this.customerCount = 0;
    this.partnerItemLicenseReportService.getReportArg(this.reportArg).subscribe({
      next: (data) => {
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

}
