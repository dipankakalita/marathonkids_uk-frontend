import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SharedAppModule } from 'src/app/shared/shared.app.module';
import { PreNewYearDownloadRunnerDlgComponent } from './pre-newyear-download-runners-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedAppModule,
    MatButtonModule,
  ],
  declarations: [
    PreNewYearDownloadRunnerDlgComponent
  ],
  providers: [
  ],
  entryComponents: [
    PreNewYearDownloadRunnerDlgComponent
  ],
  exports: [
    PreNewYearDownloadRunnerDlgComponent
  ]
})
export class PreNewYearDownloadRunnerDlgModule { }
