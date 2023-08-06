import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedAppModule } from 'src/app/shared/shared.app.module';

import { FlexLayoutModule } from '@angular/flex-layout';
import { PrintPTSCertificateComponent } from './certificate/print-pts-certificate.component';

const routes: Routes = [
    {
        path     : '',
        component: PrintPTSCertificateComponent
    }
];

@NgModule({
    declarations: [
        PrintPTSCertificateComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),
        SharedAppModule,
        FlexLayoutModule,
    ],
    providers   : [
    ],
    entryComponents: [
    ]
})

export class PrintPTSCertificateModule { }
