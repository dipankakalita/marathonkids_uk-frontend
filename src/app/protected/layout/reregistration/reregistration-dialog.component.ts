import { Component, OnInit, Inject } from '@angular/core';
import { HttpCommonService, AuthService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment'; 

@Component({
    selector: 'app-reregistration-dialog',
    templateUrl: './reregistration-dialog.component.html',
    styleUrls: ['./reregistration-dialog.component.scss']
})
export class ReregistrationDlgComponent implements OnInit {

    dlgTitle = 'Registration Open';

    curAccount;
    currentYear;
    validYears;

    loading = false;
	school_package:number = 1;

    constructor(
        private htcService: HttpCommonService,
        private matDialogRef: MatDialogRef<ReregistrationDlgComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private authService: AuthService
    ) {
        this.currentYear = this.data.currentYear;
        this.validYears = this.data.validYears;
        this.curAccount = this.authService.getCurrentAccount();
		this.school_package = this.curAccount.school_package;
    }

    ngOnInit() { }

	onItemChange(event) {
		if(event.value){ this.school_package = event.value; }
	}
	
    onReregister() {
        this.loading = true;
        let nextYear = null;

        // get next year
        for (const [i, el] of this.validYears.entries()) {
            if (moment(el.start_date) > moment(this.currentYear.end_date)) {
                nextYear = el;
                break;
            }
        }

        if (nextYear) {
            const data = {
                _valid_for: nextYear._id,
                _valid_for_date: nextYear.name,
				school_package: this.school_package,
                reregistered: true
            };

            this.htcService.update('account', this.curAccount._id, data).subscribe((res) => {
                if (res.count > 0) {
                    this.authService.setCurrentAccount(res.data);
                }
                this.loading = false;
                this.matDialogRef.close();
                location.reload();
            }, () => {
                this.loading = false;
                this.matDialogRef.close();
                location.reload();
            });
			
        } else {
            this.matDialogRef.close();
            this.loading = false;
            location.reload();
        }
    }

    onRemind() {
        const data: any = {};
        data.renewal_mute = moment().add(2, 'days').toISOString();

        this.loading = true;
        this.htcService.update('account', this.curAccount._id, data).subscribe((res) => {
            if (res.count > 0) {
                this.authService.setCurrentAccount(res.data);
            }
            this.matDialogRef.close();
            this.loading = false;
        }, () => {
            this.matDialogRef.close();
            this.loading = false;
        });
    }

}
