import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingFormDlgComponent } from './setting-form-dialog.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SharedAppModule } from 'src/app/shared/shared.app.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  imports: [
    CommonModule,
    SharedAppModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgxMatSelectSearchModule,
    MatCheckboxModule
  ],
  declarations: [
    SettingFormDlgComponent
  ],
  providers: [
  ],
  entryComponents: [
    SettingFormDlgComponent
  ],
  exports: [
    SettingFormDlgComponent
  ]
})
export class SettingFormModule { }
