import { Component, OnInit, Inject } from '@angular/core';
import { HttpCommonService, AuthService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PreNewYearConfirmDlgComponent } from '../pre-newyear-confirm-dlg/pre-newyear-confirm-dialog.component';
// import { MdRadioChange } from '@angular/material';
@Component({
    selector: 'app-pre-newyear-dialog',
    templateUrl: './pre-newyear-dialog.component.html',
    styleUrls: ['./pre-newyear-dialog.component.scss']
})
export class PreNewYearDlgComponent implements OnInit {
    curAccount;
    loading = false;
	school_package:number = 1;

    constructor(
        private htcService: HttpCommonService,
        private matDialogRef: MatDialogRef<PreNewYearDlgComponent>,
        private authService: AuthService,
        public matDialog: MatDialog
    ) {
        this.curAccount = this.authService.getCurrentAccount();
		this.school_package = this.curAccount.school_package;
    }

    ngOnInit() { }
	
	onItemChange(event) {
		if(event.value){ this.school_package = event.value; }
	}
	
    onOk() {
        const data = {
            noticed_new_year: true,
            school_package: this.school_package
        };
		
        this.loading = true;
		 
        this.htcService.update('account', this.curAccount._id, data).subscribe((res) => {
			if (res.count > 1) {
                this.authService.setCurrentAccount(res.data);
            }
			
			// 2nd Popup
            this.matDialog.open(
                PreNewYearConfirmDlgComponent,
                {
                    disableClose: true,
                    width: '500px'
                }
            );
			
            this.matDialogRef.close();
            this.loading = false;

        }, () => {
            this.matDialogRef.close();
            this.loading = false;
        }); 
    }

    onRemind() {
        this.matDialogRef.close();
    }
}
