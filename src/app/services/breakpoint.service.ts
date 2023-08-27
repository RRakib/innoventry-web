import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class BreakPointService {

    private breakPointBehaviorSubject$ = new BehaviorSubject<string>(Breakpoints.Web);
  
    // In case if you are increasing any BreakPoint, Please add condition in the function breakpointChanged()
    readonly breakpoint$ = this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.Web]);
    
    constructor(private breakpointObserver: BreakpointObserver){
        this.breakpoint$.subscribe({
            next: (data) => {this.breakpointChanged();}
        });
    }

    private breakpointChanged() {
        if(this.breakpointObserver.isMatched(Breakpoints.Web)) {
          this.breakPointBehaviorSubject$.next(Breakpoints.Web);    
        } else if(this.breakpointObserver.isMatched(Breakpoints.TabletPortrait)) {
            this.breakPointBehaviorSubject$.next(Breakpoints.TabletPortrait);          
        } else if(this.breakpointObserver.isMatched(Breakpoints.HandsetPortrait)) {                
          this.breakPointBehaviorSubject$.next(Breakpoints.HandsetPortrait);
        } else{
            this.breakPointBehaviorSubject$.next(Breakpoints.Web);  
        }
    }

    get breakpointObservable$()  {
        return this.breakPointBehaviorSubject$.asObservable();
    }

    public isWeb() : boolean{
        return this.breakPointBehaviorSubject$.value == Breakpoints.Web ? true : false;
    }
}