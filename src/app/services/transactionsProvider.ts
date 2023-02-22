import { Injectable } from "@angular/core";
import { IBillingClassification, IBillingGroup, IStockLocation } from "src/server";


@Injectable()
export class TransactionsProvider {
  private _billingGroup: IBillingGroup;
  private _billingClassification: IBillingClassification;
  private _stockLocation: IStockLocation;
  constructor() {

  }

  billingGroup(billingGroup?: IBillingGroup): IBillingGroup {
    if (billingGroup) {
      this._billingGroup = billingGroup;
    }
    return this._billingGroup;
  }

  billingClassification(billingGroup?: IBillingClassification): IBillingClassification {
    if (billingGroup) {
      this._billingClassification = billingGroup;
    }
    return this._billingClassification;
  }

  stockLocation(stockLocation?: IStockLocation): IStockLocation {
    if (stockLocation) {
      this._stockLocation = stockLocation;
    }
    return this._stockLocation;
  }

}