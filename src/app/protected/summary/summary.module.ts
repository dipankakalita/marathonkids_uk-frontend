import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedAppModule } from 'src/app/shared/shared.app.module';
import { CountUpModule } from 'countup.js-angular2';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { SummaryComponent } from './summary.component';
import { MatTabsModule } from '@angular/material/tabs';

const routes: Routes = [
    {
        path     : '**',
        component: SummaryComponent,
        children : []
    }
];

@NgModule({
    declarations : [
        SummaryComponent
    ],
    imports      : [
        RouterModule.forChild(routes),
        SharedAppModule,
        MatFormFieldModule,
        MatSelectModule,
        CountUpModule,
        NgxMatSelectSearchModule,
        MatTabsModule,
		MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    providers    : []
})

export class SummaryModule { }
