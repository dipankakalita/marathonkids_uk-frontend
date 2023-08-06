import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AlertDialogComponent } from './alert-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations: [
        AlertDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        FlexLayoutModule
    ],
    exports: [
        AlertDialogComponent
    ],
    entryComponents: [
        AlertDialogComponent
    ],
})
export class AlertDialogModule { }
