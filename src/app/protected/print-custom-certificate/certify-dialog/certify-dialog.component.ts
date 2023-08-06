import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-certify-confirm-dialog',
    templateUrl: './certify-dialog.component.html',
    styleUrls: ['./certify-dialog.component.scss']
})
export class CertifyDialogComponent {
    public title: string;
    public message: string;
    public printed;
    neverShow = false;

    constructor(
        public dialogRef: MatDialogRef<CertifyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.printed = data.printed;
        this.title = 'Printed Certificates';
        this.message = 'Now that you have viewed/printed these certificates,' +
            'they will be archived in your \'Printed\' tab, where you can reprint or print as required';
    }

    onClose() {
        this.dialogRef.close({ never_show: this.neverShow });
    }
}
