import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import {
    PreNewYearDownloadRunnerDlgComponent
} from '../pre-newyear-download-runners-dlg/pre-newyear-download-runners-dialog.component';

@Component({
    selector: 'app-pre-newyear-confirm-dialog',
    templateUrl: './pre-newyear-confirm-dialog.component.html',
    styleUrls: ['./pre-newyear-confirm-dialog.component.scss']
})

export class PreNewYearConfirmDlgComponent implements OnInit {

    constructor(
        private matDialogRef: MatDialogRef<PreNewYearConfirmDlgComponent>,
        public matDialog: MatDialog
    ) {
    }

    ngOnInit() { }

    onOk() {
		this.matDialog.open(
			// 3rd Popup
			PreNewYearDownloadRunnerDlgComponent,
			{
				disableClose: true,
				width: '500px'
			}
		);
        this.matDialogRef.close();
    }

}
