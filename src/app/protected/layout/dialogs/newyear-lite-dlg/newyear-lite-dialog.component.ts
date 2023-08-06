import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-newyear-lite-dialog',
    templateUrl: './newyear-lite-dialog.component.html',
    styleUrls: ['./newyear-lite-dialog.component.scss']
})
export class NewYearLiteDlgComponent implements OnInit {

    dlgTitle = 'Welcome Back!';

    constructor(
        private matDialogRef: MatDialogRef<NewYearLiteDlgComponent>,
    ) {
    }

    ngOnInit() { }

    onOk() {
        this.matDialogRef.close();
    }

}
