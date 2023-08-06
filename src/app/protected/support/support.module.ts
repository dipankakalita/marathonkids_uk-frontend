import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SharedAppModule } from 'src/app/shared/shared.app.module';

import { SupportListComponent } from './list/support-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
    {
        path     : '',
        component: SupportListComponent,
        children : []
    },
    {
        path     : '**',
        redirectTo: '/dashboard/support'
    }
];

@NgModule({
    declarations: [
        SupportListComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),
        SharedAppModule,
        FlexLayoutModule,

        // Material Modules
        MatIconModule,
        MatButtonModule
    ],
    providers   : [
    ],
    entryComponents: [
    ]
})

export class SupportModule { }
