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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

import { SharedAppModule } from 'src/app/shared/shared.app.module';

import { RunnerListComponent } from './list/runner-list.component';
import { RunnerFormDlgComponent } from './form/runner-form-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QRCodeModule } from 'angularx-qrcode';

const routes: Routes = [
    {
        path     : '',
        component: RunnerListComponent,
        children : []
    },
    {
        path     : '**',
        redirectTo: '/dashboard/runner'
    }
];

@NgModule({
    declarations: [
        RunnerListComponent,
        RunnerFormDlgComponent
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
        MatTooltipModule,
        MatTabsModule,
        QRCodeModule
    ],
    providers   : [
    ],
    entryComponents: [
        RunnerFormDlgComponent
    ]
})

export class RunnerModule { }
