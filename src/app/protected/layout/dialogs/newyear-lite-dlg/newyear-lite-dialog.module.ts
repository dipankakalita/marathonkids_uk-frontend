import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SharedAppModule } from 'src/app/shared/shared.app.module';
import { NewYearLiteDlgComponent } from './newyear-lite-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedAppModule,
    MatButtonModule,
  ],
  declarations: [
    NewYearLiteDlgComponent
  ],
  providers: [
  ],
  entryComponents: [
    NewYearLiteDlgComponent
  ],
  exports: [
    NewYearLiteDlgComponent
  ]
})
export class NewYearLiteDlgModule { }
