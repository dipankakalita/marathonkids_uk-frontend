import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SharedAppModule } from 'src/app/shared/shared.app.module';
import { PreNewYearConfirmDlgComponent } from './pre-newyear-confirm-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedAppModule,
    MatButtonModule,
  ],
  declarations: [
    PreNewYearConfirmDlgComponent
  ],
  providers: [
  ],
  entryComponents: [
    PreNewYearConfirmDlgComponent
  ],
  exports: [
    PreNewYearConfirmDlgComponent
  ]
})
export class PreNewYearConfirmDlgModule { }
