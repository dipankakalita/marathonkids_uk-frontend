import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SharedAppModule } from 'src/app/shared/shared.app.module';
import { NewYearDlgComponent } from './newyear-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedAppModule,
    MatButtonModule,
  ],
  declarations: [
    NewYearDlgComponent
  ],
  providers: [
  ],
  entryComponents: [
    NewYearDlgComponent
  ],
  exports: [
    NewYearDlgComponent
  ]
})
export class NewYearDlgModule { }
