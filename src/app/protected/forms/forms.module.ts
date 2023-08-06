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

import { SharedAppModule } from 'src/app/shared/shared.app.module';

import { FormsListComponent } from './list/forms-list.component';
import { FormsAddDlgComponent } from './add/forms-add-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
    {
        path     : '',
        component: FormsListComponent,
        children : []
    },
    {
        path     : '**',
        redirectTo: '/dashboard/forms'
    }
];

@NgModule({
    declarations: [
        FormsListComponent,
        FormsAddDlgComponent
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
        MatButtonModule
    ],
    providers   : [
    ],
    entryComponents: [
        FormsAddDlgComponent
    ]
})

export class FormsModule { }
