import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { LogoutDialogComponent } from './logout-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations: [
        LogoutDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        FlexLayoutModule
    ],
    exports: [
        LogoutDialogComponent
    ],
    entryComponents: [
        LogoutDialogComponent
    ],
})
export class LogoutDialogModule { }
