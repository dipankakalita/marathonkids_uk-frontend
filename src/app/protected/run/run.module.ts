import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { SharedAppModule } from 'src/app/shared/shared.app.module';

import { RunListComponent } from './list/run-list.component';
import { RunFormDlgComponent } from './form/run-form-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { EventSingleComponent } from './event-single/event-single.component';

export const MY_FORMATS = {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };

const routes: Routes = [
    {
        path     : ':id',
        component: EventSingleComponent,
        children : []
    },
    {
        path     : '',
        component: RunListComponent,
        children : []
    },
    {
        path     : '**',
        redirectTo: '/dashboard/run'
    }
];

@NgModule({
    declarations: [
        RunListComponent,
        RunFormDlgComponent,
        EventSingleComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        SharedAppModule,
        FlexLayoutModule,

        // Material Modules
        MatFormFieldModule,
        MatInputModule,
        MatPaginatorModule,
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
    providers   : [
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ],
    entryComponents: [
        RunFormDlgComponent
    ]
})

export class RunModule { }
