import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { CustomDateAdapterService } from 'src/app/services/date-adaptor';
import { PLedgerMaster, ILedgerDetailLine, IJournalTx } from 'src/server';
import { JournalTxServiceService } from 'src/server/api/journalTxService.service';
import { VoucherNumberServiceService } from 'src/server/api/voucherNumberService.service';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent implements OnInit , AfterViewInit{

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  public journalForm!: FormGroup;
  public entryForm!: FormGroup;
  public entryRowId : number = 1;
  public isEntryEditModeEnabled : boolean = false;

  isFormLoaded : boolean = false;
  txTypeLabel: string = 'Debit';  
  selectedLedgerDetailLine : any;

  // EDIT MODE VARIABLES
  editJournalTxData: IJournalTx | undefined;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'ledgerName',
    'description',
    'debit', 
    'credit'
  ];
  applyForbiddenNameValidator : boolean = false;

  dataSource = new MatTableDataSource<ILedgerDetailLine>([]);
  @ViewChild(MatPaginator) paginator :any = MatPaginator;
  selectedRowIndex = -1;

  totalCredit: number;
  totalDebit: number;

  constructor(private breakpointObserver: BreakpointObserver, private customDateAdapterService  : CustomDateAdapterService, private formBuilder : FormBuilder, 
    private route: ActivatedRoute,private router: Router,
    public voucherNumberService: VoucherNumberServiceService,private journalTxService: JournalTxServiceService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { txId: number },
    public dialogRef: MatDialogRef<JournalComponent>) {
     
  }

  ngOnInit(): void {
    
    if (!!this.data.txId) {
        this.journalTxService.findById(this.data.txId).subscribe({
            next: (data) => {
              this.editJournalTxData = data;
              this.initalizeJournalForm(); 
              this.isFormLoaded = true;                 
            },
            error: () =>{}
          }
        );
    }else {
      this.initalizeJournalForm();  
      this.getNewVoucherNo();
    }
   
  } 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * This function initializes the journal form which is actually bind to the Form in template.
   * This function works in both new and edit mode.
   */
  initalizeJournalForm() : void {    

    let editLedgerDetailLines : Array<any> = []; // Will be saved in Journal form ledger detail lines in **only** edit mode.
    let chequeDate: Date | undefined; // Will be saved in Journal form ledger detail lines in **only** edit mode.

    if(!!this.editJournalTxData) {
      let ledgerDetailLinesEditMode = this.editJournalTxData.ledgerDetailLines; //Ledger detail lines coming in edit mode.

      if(!!ledgerDetailLinesEditMode && ledgerDetailLinesEditMode.length > 0){

        editLedgerDetailLines = new Array<any>();

        ledgerDetailLinesEditMode.forEach((_element) => {
          editLedgerDetailLines.push({
            jacksontype: 'LedgerDetailLineImpl',
            id: _element.id,
            ledgerName: _element.ledgerName,
            ledgerId: _element.ledgerId,
            chequeDate: _element.chequeDate,
            description:  _element.description,
            debit: _element.debit,
            credit: _element.credit
          });
        })

        chequeDate = ledgerDetailLinesEditMode[0].chequeDate;
      }
    }


    this.journalForm = this.formBuilder.group({
      jacksontype: 'JournalTxImpl',
      id: new FormControl(this.editJournalTxData?.id ? this.editJournalTxData?.id : null),
      vouchernumber : new FormControl( {value: this.editJournalTxData?.vouchernumber ? this.editJournalTxData?.vouchernumber : null, disabled: true}, [ Validators.required]),
      transactiondate : new FormControl(this.editJournalTxData?.transactiondate 
        ? this.editJournalTxData?.transactiondate 
        : this.customDateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())),
      referenceNo: new FormControl(this.editJournalTxData?.referenceNo ? this.editJournalTxData?.referenceNo : null),
      // Updated if the Journal is being Edited
      chequedate: new FormControl({value : !!chequeDate 
        ?  chequeDate
        : this.customDateAdapterService.createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), disabled: true}),
      // Updated if the Journal is being Edited
      chequeNo : new FormControl(),
      // Updated if the Journal is being Edited
      ledgerDetailLines:  !!editLedgerDetailLines ? [editLedgerDetailLines] : []
    });

    this.calculateTotalAmounts();

    this.initializeEntryForm();

    this.dataSource.data = this.journalForm.get("ledgerDetailLines")?.value;
  }

  /**
   * This method initializes the nested form for addition of journal entries.
   */
  private initializeEntryForm() {
    this.entryForm = this.formBuilder.group({
      ledgerName: new FormControl(null),
      ledgerId: new FormControl(null),
      lineAmount: new FormControl(null),
      txType: new FormControl(false),
      description: new FormControl()
    });

    this.entryForm.controls['txType']?.valueChanges.subscribe({
      next: (data) => {
        if(data){
          this.txTypeLabel = "Credit";
        }else {
          this.txTypeLabel = "Debit";
        }
      }
    });
  }


  /**
   * This function fetches new Journal voucher number.
   */
  private getNewVoucherNo() : void {
    this.voucherNumberService.getNextVoucherNumber(new Date().toISOString(), "in.solpro.nucleus.accounting.model.IJournalTx", 0).subscribe({
      next: (data) => {
        this.journalForm.patchValue({
          vouchernumber : data.voucherNumber
        });
        this.isFormLoaded = true;
      },
      error: () => {}
    });
  }

  /**
   * This function is called after addition of journal entry.
   * This will reset the nested form for journal entry.
   */
  private resetEntryForm() : void {
    this.entryForm.patchValue({
      ledgerName: null,
      ledgerId: null,
      lineAmount: null,
      txType: false,
      description: null
    });
  }

  /**
   * This function is called in edit mode when user decides to cancel the editing of an entry.
   */
  public cancelEditMode() : void {
    this.entryForm.patchValue({
      ledgerName: null,
      ledgerId: null,
      lineAmount: null,
      txType: false,
      description: null
    });

    this.selectedRowIndex = 0; //Reset to original state.   
    this.isEntryEditModeEnabled = false;
  }

  //This will also executed in edit of any new added entry only.
  onLedgerSelectionChange(selectedLedger : PLedgerMaster) : void {
    this.entryForm.patchValue({
      ledgerName: selectedLedger.name,
      ledgerId: selectedLedger.id
    });
  }

  /**
   * This function is called when user add/edit journal entry from Ledger detail line form.
   */
  addJounralEntry() : void {

    this.entryForm.controls["ledgerName"].addValidators([ Validators.required]);
    this.applyForbiddenNameValidator = true;
    this.entryForm.controls["lineAmount"].addValidators([ Validators.required]);
    this.entryForm.controls["ledgerName"].updateValueAndValidity();
    this.entryForm.controls["lineAmount"].updateValueAndValidity();

    if(this.entryForm.valid) {
      let ledgerDetailLines = this.journalForm.get("ledgerDetailLines")?.value;

      //Check the txType and add the amount in corresponding tx type.
      let debit : number = 0;
      let credit : number = 0;
      let enteredAmount : number = this.entryForm.controls["lineAmount"].value;
      if(this.entryForm.controls["txType"].value as boolean){
        credit = enteredAmount;
      }else{
        debit = enteredAmount;
      }

      if(this.isEntryEditModeEnabled) {

        this.selectedLedgerDetailLine["ledgerName"] = this.entryForm.controls["ledgerName"].value;
        this.selectedLedgerDetailLine["ledgerId"] = this.entryForm.controls["ledgerId"].value;
        this.selectedLedgerDetailLine["debit"] = debit;
        this.selectedLedgerDetailLine["credit"] = credit;
        this.selectedLedgerDetailLine["description"] = this.entryForm.controls["description"].value;

        this.selectedRowIndex = 0;
        this.isEntryEditModeEnabled = false; //Reset to add mode after Editing an entry.

      }else {
        //Push the entry into Journal Form Ledger detail line.
        ledgerDetailLines.push({
          id : this.entryRowId,
          jacksontype: 'LedgerDetailLineImpl',
          ledgerName: this.entryForm.controls["ledgerName"].value,
          ledgerId: this.entryForm.controls["ledgerId"].value,
          chequeDate: this.journalForm.controls["chequedate"].value,
          description: this.entryForm.controls["description"].value,
          debit: debit as number,
          credit: credit as number
        });

        //Incremented entryRowId for the next entry
        //This is used in ledgerDetailLines while adding entry.
        this.entryRowId++;
      }      

      //Calculate total credit and debit from ledger detail lines.
      this.calculateTotalAmounts();
    
      this.dataSource.data = this.journalForm.get("ledgerDetailLines")?.value as Array<ILedgerDetailLine>;       
      this.resetEntryForm();

      this.entryForm.controls["ledgerName"].clearValidators();
      this.applyForbiddenNameValidator = false;
      this.entryForm.controls["lineAmount"].clearValidators();
      this.entryForm.controls["ledgerName"].updateValueAndValidity();
      this.entryForm.controls["lineAmount"].updateValueAndValidity();
    }    
  }

  /**
   * This function is used to calculate the final journal amounts i.e. total credit and total debit.   * 
   */
  calculateTotalAmounts() : void {
    let addedLedgerDetailLines = this.journalForm.get("ledgerDetailLines")?.value;

    let totalCredit : number = 0;
    let totalDebit : number = 0;
    if(addedLedgerDetailLines.length > 0) {

      addedLedgerDetailLines.forEach((_element: { [x: string]: string | number; }) => {
        totalCredit = +totalCredit +  +_element["credit"]
        totalDebit = +totalDebit +  +_element["debit"]
      });      
    }

    this.totalCredit = totalCredit;
    this.totalDebit = totalDebit;
  }

  /**
   * This function is executed when user wants to edit the added ledger detail line.
   * Also, this function populates the selected ledger detail line into entry form.
   */
  prepareForEditEntryLine(): void {
    let addedLedgerDetailLines = this.journalForm.get("ledgerDetailLines")?.value;

    if(addedLedgerDetailLines.length > 0) {
      this.selectedLedgerDetailLine =  addedLedgerDetailLines.find((ledgerDetailLine: { id: number; }) => ledgerDetailLine.id == this.selectedRowIndex);

      let selectedLineAmount : number | undefined = 0;
      let selectedTxType : boolean = false;
      if(this.selectedLedgerDetailLine?.credit != 0){
        selectedLineAmount = this.selectedLedgerDetailLine?.credit;
        selectedTxType = true;
      }else {
        selectedLineAmount = this.selectedLedgerDetailLine?.debit;
        selectedTxType = false;
      }

      this.entryForm.patchValue({
        ledgerName: this.selectedLedgerDetailLine?.ledgerName,
        ledgerId: this.selectedLedgerDetailLine?.ledgerId,
        lineAmount: selectedLineAmount,
        txType: selectedTxType,
        description: this.selectedLedgerDetailLine?.description
      });

      this.isEntryEditModeEnabled = true;
    }
  }

  public deleteJournalEnty() : void {    
    let addedLedgerDetailLines = this.journalForm.get("ledgerDetailLines")?.value;
    let journalEntryToDelete = addedLedgerDetailLines.findIndex((entry : any) => entry.id == this.selectedRowIndex);
    addedLedgerDetailLines.splice(journalEntryToDelete, 1);
    this.selectedRowIndex = -1;
    this.dataSource.data = addedLedgerDetailLines as Array<ILedgerDetailLine>;  
    
     //Calculate total credit and debit from ledger detail lines.
     this.calculateTotalAmounts();
  }
  
  highlight(row : ILedgerDetailLine){
    this.selectedRowIndex = row.id || -1;
  }

  getEntryFormControl(name: string) {
    return this.entryForm.get(name) as FormControl;
  }

  saveJournalTx() : void {
    
    if(this.totalCredit != this.totalDebit) {      
      this._snackBar.open("Credit & Debit amount must be equal",'Close', {     
        duration: 2000
      });      
    }else {
      let addedLedgerDetailLines = this.journalForm.get("ledgerDetailLines")?.value;

      let ledgerDetailLinesForSave : Array<ILedgerDetailLine> = [];
      
      addedLedgerDetailLines.forEach((_element: any) => {
        let ledgerDetailLine = {
          jacksontype: "LedgerDetailLineImpl",
          id: _element["id"],
          chequeDate: this.journalForm.get("chequedate")?.value,
          chequeNo: this.journalForm.get("chequeNo")?.value,
          ledgerId: _element["ledgerId"],
          ledgerName: _element["ledgerName"],
          credit: _element["credit"],
          debit:  _element["debit"],
          description: _element["description"]
        }

        ledgerDetailLinesForSave.push(ledgerDetailLine);
      });

      let journalFormForSave = this.formBuilder.group({
        jacksontype: 'JournalTxImpl',
        id: this.journalForm.get("id")?.value,
        transactiondate : this.journalForm.get("transactiondate")?.value,
        vouchernumber : this.journalForm.get("vouchernumber")?.value,        
        referenceNo: this.journalForm.get("referenceNo")?.value,        
        totalCredit: this.totalCredit,
        totalDebit: this.totalDebit,        
        ledgerDetailLines:  [ledgerDetailLinesForSave]
      });

      if(!!this.editJournalTxData) {

        this.journalTxService.update(journalFormForSave.value).subscribe({
          next: (data) => {            
            this.dialogRef.close();
          },  
          error: () => { }
        });
      }else{
        this.journalTxService.save(journalFormForSave.value).subscribe({
          next: (data) => {
            this.initalizeJournalForm();
            this.getNewVoucherNo();
          },  
          error: () => { }
        });
      }

      
    }    
  }
}
