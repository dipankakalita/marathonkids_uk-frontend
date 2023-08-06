import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedAppModule } from 'src/app/shared/shared.app.module';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AuditListComponent } from './list/audit-list.component';

const routes: Routes = [
    {
        path     : '',
        component: AuditListComponent,
        children : []
    },
    {
        path     : '**',
        redirectTo: '/dashboard/audit'
    }
];

@NgModule({
    declarations: [
        AuditListComponent
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
        MatIconModule,
        MatPaginatorModule,
        MatButtonModule
    ],
    providers   : [
    ],
    entryComponents: [
    ]
})

export class AuditModule { }
