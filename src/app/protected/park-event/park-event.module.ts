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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedAppModule } from 'src/app/shared/shared.app.module';
import { MatNativeDateModule } from '@angular/material/core';
import { ParkEventComponent } from './list/park-event.component';
//import { EventFormDlgComponent } from './form/event-form-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ParkEventFormComponent } from './park-event-form/park-event-form.component';

const routes: Routes = [
    {
        path     : '',
        component: ParkEventComponent,
        children : []
    },
    {
        path     : '**',
        redirectTo: '/dashboard/parkEvent'
    }
];

@NgModule({
    declarations: [
        ParkEventComponent,
		ParkEventFormComponent
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
        NgxMatSelectSearchModule,
		MatDatepickerModule,
		MatNativeDateModule
    ],
    providers   : [
    ],
    entryComponents: [
		ParkEventFormComponent
    ]
})

export class ParkEventModule { }
