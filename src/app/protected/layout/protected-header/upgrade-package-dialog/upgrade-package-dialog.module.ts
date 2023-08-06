import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpgradePkgDlgComponent } from './upgrade-package-dialog.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SharedAppModule } from 'src/app/shared/shared.app.module';

@NgModule({
  imports: [
    CommonModule,
    SharedAppModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  declarations: [
    UpgradePkgDlgComponent
  ],
  providers: [
  ],
  entryComponents: [
    UpgradePkgDlgComponent
  ],
  exports: [
    UpgradePkgDlgComponent
  ]
})
export class UpgradePkgDlgModule { }
