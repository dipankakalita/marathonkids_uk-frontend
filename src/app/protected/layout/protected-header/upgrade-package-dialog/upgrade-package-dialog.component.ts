import * as _ from 'lodash';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { AlertService, HttpCommonService, AuthService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'upgrade-package-dialog',
    templateUrl: './upgrade-package-dialog.component.html',
    styleUrls: ['./upgrade-package-dialog.component.scss']
})
export class UpgradePkgDlgComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private matDialogRef: MatDialogRef<UpgradePkgDlgComponent>,
    ) {
    }
	
    ngOnInit() {
    }

    onCancel() {
        this.matDialogRef.close();
    }	 
}
