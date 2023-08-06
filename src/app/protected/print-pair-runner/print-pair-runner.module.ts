import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedAppModule } from 'src/app/shared/shared.app.module';

import { FlexLayoutModule } from '@angular/flex-layout';
import { PrintPairRunnerComponent } from './qrcode/print-pair-runner.component';
import { QRCodeModule } from 'angularx-qrcode';

const routes: Routes = [
    {
        path     : '',
        component: PrintPairRunnerComponent
    }
];

@NgModule({
    declarations: [
        PrintPairRunnerComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),
        SharedAppModule,
        FlexLayoutModule,
        QRCodeModule
    ],
    providers   : [
    ],
    entryComponents: [
    ]
})

export class PrintPairRunnerModule { }
