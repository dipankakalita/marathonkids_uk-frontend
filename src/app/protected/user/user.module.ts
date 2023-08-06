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

import { SharedAppModule } from 'src/app/shared/shared.app.module';

import { UserListComponent } from './list/user-list.component';
import { UserFormDlgComponent } from './form/user-form-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
    {
        path     : '',
        component: UserListComponent,
        children : []
    },
    {
        path     : '**',
        redirectTo: '/dashboard/user'
    }
];

@NgModule({
    declarations: [
        UserListComponent,
        UserFormDlgComponent
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
        MatTooltipModule,
        MatPaginatorModule,
        MatButtonModule,
        MatSelectModule,
        NgxMatSelectSearchModule
    ],
    providers   : [
    ],
    entryComponents: [
        UserFormDlgComponent
    ]
})

export class UserModule { }
