import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedAppModule } from 'src/app/shared/shared.app.module';
import { CountUpModule } from 'countup.js-angular2';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { NotificationsComponent } from './notifications.component';
import { NotificationsFormDlgComponent } from './form/notifications-form-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';

import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';


const routes: Routes = [
  {
      path     : '**',
      component: NotificationsComponent,
      children : []
  }
];
@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationsFormDlgComponent
  ],
  imports     : [
      RouterModule.forChild(routes),
      SharedAppModule,
      MatFormFieldModule,
      MatSelectModule,
      CountUpModule,
      NgxMatSelectSearchModule,
      MatTabsModule,      
      FlexLayoutModule,

      // Material Modules      
      MatInputModule,      
      MatSortModule,
      MatTableModule,
      MatDialogModule,
      MatIconModule,
      MatPaginatorModule,
      MatButtonModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule
  ],
  providers   : []
})
export class NotificationsModule { }
