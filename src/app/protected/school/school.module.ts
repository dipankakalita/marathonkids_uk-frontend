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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import { SharedAppModule } from 'src/app/shared/shared.app.module';

import { SchoolListComponent } from './list/school-list.component';
import { SchoolFormDlgComponent } from './form/school-form-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes: Routes = [
    {
        path     : '',
        component: SchoolListComponent,
        children : []
    },
    {
        path     : '**',
        redirectTo: '/dashboard/school'
    }
];

@NgModule({
    declarations: [
        SchoolListComponent,
        SchoolFormDlgComponent
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
        MatCheckboxModule,
        MatSelectModule,
        NgxMatSelectSearchModule
    ],
    providers   : [
    ],
    entryComponents: [
        SchoolFormDlgComponent
    ]
})

export class SchoolModule { }
