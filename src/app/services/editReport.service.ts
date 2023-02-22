import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()
export class EditReportService {

    private _reportEdited = new Subject<boolean>();

    reportEdited(): Observable<any> {
       return this._reportEdited.asObservable();
    }

    changeStatus(status: boolean) {
       this._reportEdited.next(status);
    }

}