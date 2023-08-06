import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-pre-newyear-download-runners-dialog',
    templateUrl: './pre-newyear-download-runners-dialog.component.html',
    styleUrls: ['./pre-newyear-download-runners-dialog.component.scss']
})
export class PreNewYearDownloadRunnerDlgComponent implements OnInit {
    constructor(
        private matDialogRef: MatDialogRef<PreNewYearDownloadRunnerDlgComponent>
    ) {
    }

    ngOnInit() { }

    onOk() {
        this.matDialogRef.close();
    }

}
