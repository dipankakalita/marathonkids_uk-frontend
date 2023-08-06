import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReregistrationDlgComponent } from './reregistration-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { SharedAppModule } from 'src/app/shared/shared.app.module';


@NgModule({
  imports: [
    CommonModule,
    MatRadioModule,
    SharedAppModule,
    MatButtonModule,
  ],
  declarations: [
    ReregistrationDlgComponent
  ],
  providers: [
  ],
  entryComponents: [
    ReregistrationDlgComponent
  ],
  exports: [
    ReregistrationDlgComponent
  ]
})
export class ReregistrationDlgModule { }
