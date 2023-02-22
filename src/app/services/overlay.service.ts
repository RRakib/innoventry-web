import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';

//cdk
import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { BehaviorSubject } from 'rxjs';

//rxjs

@Injectable({
    providedIn: 'root',
})
export class OverlayService {

    public displayProgressSpinnerSubject = new BehaviorSubject<any>(false);
    public displayProgressSpinner$ = this.displayProgressSpinnerSubject.asObservable();

    constructor(private overlay: Overlay) {

    }

    createOverlay(config: OverlayConfig): OverlayRef {
        return this.overlay.create(config);
    }
    attachTemplatePortal(overlayRef: OverlayRef, templateRef: TemplateRef<any>, vcRef: ViewContainerRef) {
        let templatePortal = new TemplatePortal(templateRef, vcRef);
        overlayRef.attach(templatePortal);
    }
    positionGloballyCenter(): PositionStrategy {
        return this.overlay.position()
            .global()
            .centerHorizontally()
            .centerVertically();
    }

    enableProgressSpinner() : void{
        this.displayProgressSpinnerSubject.next(true);
    }

    disableProgressSpinner() : void{
        this.displayProgressSpinnerSubject.next(false);
    }
}