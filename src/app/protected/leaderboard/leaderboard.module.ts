import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SharedAppModule } from 'src/app/shared/shared.app.module';

import { LeaderboardListComponent } from './list/leaderboard-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
    {
        path     : '',
        component: LeaderboardListComponent,
        children : []
    },
    {
        path     : '**',
        redirectTo: '/dashboard/leaderboard'
    }
];

@NgModule({
    declarations: [
        LeaderboardListComponent
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
    entryComponents: [ ]
})

export class LeaderboardModule { }
