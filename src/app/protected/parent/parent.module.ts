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

import { ParentListComponent } from './list/parent-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes: Routes = [
    {
        path     : '',
        component: ParentListComponent,
        children : []
    },
    {
        path     : '**',
        redirectTo: '/dashboard/parent'
    }
];

@NgModule({
    declarations: [
        ParentListComponent
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
    ]
})

export class ParentModule { }
