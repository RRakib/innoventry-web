import { LedgerPurchaseSummaryReportLine } from "src/server";

export interface LedgerPurchaseSummaryReportLineByIndex extends LedgerPurchaseSummaryReportLine {
    rowId? : number;
}
