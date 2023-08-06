import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedAppModule } from 'src/app/shared/shared.app.module';

import { FlexLayoutModule } from '@angular/flex-layout';
import { PrintCertificateComponent } from './certificate/print-certificate.component';
import { CertifyDialogComponent } from './certify-dialog/certify-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

const routes: Routes = [
    {
        path     : '',
        component: PrintCertificateComponent
    }
];

@NgModule({
    declarations: [
        PrintCertificateComponent,
        CertifyDialogComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        SharedAppModule,
        FlexLayoutModule,
        MatDialogModule,
        MatButtonModule,
        MatCheckboxModule
    ],
    providers   : [
    ],
    entryComponents: [
        CertifyDialogComponent
    ]
})

export class PrintCertificateModule { }
