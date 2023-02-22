import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { OverlayService } from 'src/app/services/overlay.service';


@NgModule({
    imports: [
      CommonModule,
      OverlayModule
    ],
    exports : [        
    ],
    providers: [OverlayService],
  })
  export class AppOverlayModule { }