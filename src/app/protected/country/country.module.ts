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

import { CountryListComponent } from './list/country-list.component';
import { CountryFormDlgComponent } from './form/country-form-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
    {
        path     : '',
        component: CountryListComponent,
        children : []
    },
    {
        path     : '**',
        redirectTo: '/dashboard/country'
    }
];

@NgModule({
    declarations: [
        CountryListComponent,
        CountryFormDlgComponent
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
        CountryFormDlgComponent
    ]
})

export class CountryModule { }
