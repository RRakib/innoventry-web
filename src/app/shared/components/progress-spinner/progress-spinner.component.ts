import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Component, DoCheck, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { OverlayService } from 'src/app/services/overlay.service';
import { take } from "rxjs";

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.css']
})
export class ProgressSpinnerComponent implements OnInit  {

  color?: ThemePalette = 'primary' as ThemePalette;;
  diameter?: number = 100;
  mode: ProgressSpinnerMode = 'indeterminate' as ProgressSpinnerMode;
  strokeWidth?: number;
  value?: number = 50;
  backdropEnabled = true;
  positionGloballyCenter = true;
  displayProgressSpinner: boolean;

  @ViewChild('progressSpinnerRef', {static: true})// static true in case if want to access in ngOnInit of any other component.
  private progressSpinnerRef: TemplateRef<any>;

  private progressSpinnerOverlayConfig: OverlayConfig;

  private overlayRef: OverlayRef;

  constructor(private vcRef: ViewContainerRef, private overlayService: OverlayService) { }
  ngOnInit() {
    // Config for Overlay Service
    this.progressSpinnerOverlayConfig = {
      hasBackdrop: this.backdropEnabled
    };
    if (this.positionGloballyCenter) {
      this.progressSpinnerOverlayConfig['positionStrategy'] = this.overlayService.positionGloballyCenter();
    }
    // Create Overlay for progress spinner
    this.overlayRef = this.overlayService.createOverlay(this.progressSpinnerOverlayConfig);

    this.overlayService.displayProgressSpinner$.subscribe({
      next: (data) => {        
        if (data && !this.overlayRef.hasAttached()) {
          this.overlayService.attachTemplatePortal(this.overlayRef, this.progressSpinnerRef, this.vcRef);
        } else if (!data && this.overlayRef.hasAttached()) {
          this.overlayRef.detach();
        }
      }
    });

  }
  

}
