import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations: [
        ConfirmDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        FlexLayoutModule
    ],
    exports: [
        ConfirmDialogComponent
    ],
    entryComponents: [
        ConfirmDialogComponent
    ],
})
export class ConfirmDialogModule { }
