import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { PLedger, ILedgerGroup, InActiveLedgersReportLine, InActiveLedgerReportArgument, LedgerGroupServiceGetReport, InActiveLedgersReportServiceGetReportAsFile } from 'src/server';
import { InActiveLedgersReportServiceService } from 'src/server/api/inActiveLedgersReportService.service';
import { LedgerGroupServiceService } from 'src/server/api/ledgerGroupService.service';

@Component({
  selector: 'app-inactive-ledgers',
  templateUrl: './inactive-ledgers.component.html',
  styleUrls: ['./inactive-ledgers.component.css']
})
export class InactiveLedgersComponent implements OnInit, AfterViewInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  inactiveLedgersReportForm: FormGroup;
  isFormLoaded: boolean = false;
  ledger: PLedger;
  ledgerGroups: ILedgerGroup[];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['ledgerName',
    'ledgerGroupName',
    'currentBalance',
    'dateOfLastTransaction'
  ];
  dataSource = new MatTableDataSource<InActiveLedgersReportLine>([]);
  @ViewChild(MatPaginator) paginator: any = MatPaginator;


  constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder,
    private overlayService: OverlayService, private customDateAdapterService: CustomDateAdapterService,
    private ledgerGroupService: LedgerGroupServiceService, private inactiveLedgerServiceApi: InActiveLedgersReportServiceService,
    private downloadService : DownloadService) { }

  ngOnInit(): void {
    let txDate = new Date();

    this.overlayService.enableProgressSpinner();
    this.ledgerGroupService.getObjects().subscribe({
      next: (data) => {
        this.ledgerGroups = data;

        this.inactiveLedgersReportForm = this.formBuilder.group({
          date: new FormControl(this.customDateAdapterService.createDate(txDate.getFullYear(), txDate.getMonth(), txDate.getDate())),
          ledgerGroupId: new FormControl()
        });

        let sundryDebtorLedgerGroup = this.ledgerGroups.find((ledgerGroup) => ledgerGroup.name == 'Sundry Debtors');
        if (!!sundryDebtorLedgerGroup) {
          this.inactiveLedgersReportForm.patchValue({
            ledgerGroupId: sundryDebtorLedgerGroup.id,
          });
        }

        this.showReport();

        this.isFormLoaded = true;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  showReport(): void {

    let reportArgument: InActiveLedgerReportArgument = {};
    this.dataSource.data = [];

    reportArgument.date = this.inactiveLedgersReportForm.controls["date"].value;
    reportArgument.iLedgerGroup = this.ledgerGroups.find((ledgerGroup) => ledgerGroup.id == this.inactiveLedgersReportForm.controls["ledgerGroupId"].value);

    this.overlayService.enableProgressSpinner();
    this.inactiveLedgerServiceApi.getReportArg(reportArgument).subscribe({
      next: (data) => {
        this.dataSource.data = data.inActiveLedgersReportLine || [];
        this.overlayService.disableProgressSpinner();
      }
    });
  }

  download(type: string) : void {

    let model: InActiveLedgersReportServiceGetReportAsFile  = {};
    model.type = type as InActiveLedgersReportServiceGetReportAsFile .TypeEnum;

    let reportArgument: InActiveLedgerReportArgument = {};
    reportArgument.date = this.inactiveLedgersReportForm.controls["date"].value;
    reportArgument.iLedgerGroup = this.ledgerGroups.find((ledgerGroup) => ledgerGroup.id == this.inactiveLedgersReportForm.controls["ledgerGroupId"].value);

    model.arg = reportArgument;

    this.inactiveLedgerServiceApi.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {

          let fileType =  model.type == InActiveLedgersReportServiceGetReportAsFile .TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';

          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
}

}
