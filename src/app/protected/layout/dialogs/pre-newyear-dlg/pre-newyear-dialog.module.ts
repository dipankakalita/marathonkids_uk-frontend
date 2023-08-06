import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { SharedAppModule } from 'src/app/shared/shared.app.module';
import { PreNewYearDlgComponent } from './pre-newyear-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedAppModule,
    MatRadioModule,
    MatButtonModule,
  ],
  declarations: [
    PreNewYearDlgComponent
  ],
  providers: [
  ],
  entryComponents: [
    PreNewYearDlgComponent
  ],
  exports: [
    PreNewYearDlgComponent
  ]
})
export class PreNewYearDlgModule { }
