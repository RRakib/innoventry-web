import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'transaction-base-view',
  templateUrl: './transaction-base-view.component.html',
  styleUrls: ['./transaction-base-view.component.css']
})
export class TransactionBaseViewComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void { 

    //In Case of Edit a transaction
    this.route.params.subscribe(params => {
      if (params['txType'] && params['txId'])  {
          switch(params['txType']) {
            case "Journal" :
              this.router.navigate(['/main/transaction/edit-journal', params['txId']]);
              break;
            case "Payment" :
              this.router.navigate(['/main/transaction/edit-payment', params['txId']]);
              break;
            case "Receipt" :
              this.router.navigate(['/main/transaction/edit-receipt', params['txId']]);
              break;
          }      
      }
    });    
  }

}
