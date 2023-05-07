import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map, shareReplay } from 'rxjs';
import { DownloadService } from 'src/app/services/download.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { ItemWiseLedgerSummaryReportServiceGetReportAsFile, ItemWiseStockLocationRegister, ItemWiseStockLocationRegisterArgument, ItemWiseStockLocationRegisterServiceService, ItemWiseStockLocationReportLine, PItemMaster } from 'src/server';

@Component({
  selector: 'app-item-stock-location-register',
  templateUrl: './item-stock-location-register.component.html',
  styleUrls: ['./item-stock-location-register.component.css']
})
export class ItemStockLocationRegisterComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  searchForm: FormGroup;
  searchArg: ItemWiseStockLocationRegisterArgument;

  detailsLines : ItemWiseStockLocationReportLine[];
  dataSource = new MatTableDataSource<ItemWiseStockLocationReportLine>([]);  

  @ViewChild(MatPaginator) paginator :any = MatPaginator;

   /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
   displayedColumns = [
   'stckLocation', 
   'stock'
  ];

  
  constructor(private breakpointObserver: BreakpointObserver, private overlayService : OverlayService,
    private formBuilder : FormBuilder, private componentService : ItemWiseStockLocationRegisterServiceService,
    private downloadService : DownloadService) { }

  ngOnInit(): void {
    this.searchArg = {};

    this.searchForm = this.formBuilder.group({      
      item: new FormControl(),
      itemName: new FormControl()
    });
  }

  onItemSelectionChange(selectedItem: PItemMaster) { 
    this.searchForm.patchValue({
      item : selectedItem.id,
      itemName: selectedItem.name
    });  
  }

  getReport() : void{
    this.searchArg.itemId = this.searchForm.controls["item"].value;

    this.componentService.getReportArg(this.searchArg).subscribe({
      next: (data) => {        
        this.detailsLines = data.reportLines || [];

        this.dataSource.data = this.detailsLines;
      }
    });
  }

  download(type: string) : void {

    let model: ItemWiseLedgerSummaryReportServiceGetReportAsFile = {};
    model.type = type as ItemWiseLedgerSummaryReportServiceGetReportAsFile.TypeEnum;
    model.arg = this.searchArg;
  
    this.componentService.getReportAsFile(model).subscribe({
      next: (data) => { 
        if(!!data.url) {
  
          let fileType =  model.type == ItemWiseLedgerSummaryReportServiceGetReportAsFile.TypeEnum.PDF 
                          ? 'application/pdf' 
                          : 'application/vnd.ms-excel';
  
          this.downloadService.downloadFileFromURL(data.url, fileType , data.filename);
        }
      }
    });
  }

  getItemFormControl(name: string) {
    return this.searchForm.get(name) as FormControl;
  }
}
