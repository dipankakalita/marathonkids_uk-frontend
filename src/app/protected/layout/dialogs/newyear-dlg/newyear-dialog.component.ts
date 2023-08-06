import { Component, OnInit, Inject } from '@angular/core';
import { HttpCommonService, AuthService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
    selector: 'app-newyear-dialog',
    templateUrl: './newyear-dialog.component.html',
    styleUrls: ['./newyear-dialog.component.scss']
})
export class NewYearDlgComponent implements OnInit {

    dlgTitle = 'Welcome Back!';

    curAccount;

    currentYear;
    validYears;

    loading = false;

    constructor(
        private htcService: HttpCommonService,
        private matDialogRef: MatDialogRef<NewYearDlgComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private authService: AuthService
    ) {
        this.curAccount = this.authService.getCurrentAccount();
        this.validYears = this.data.validYears;
        this.currentYear = this.data.currentYear;
    }

    ngOnInit() {
        if (moment() > moment(this.currentYear.end_date)) {
            this.loading = true;
            let nextYear = null;
            // get next year
            for (const [i, el] of this.validYears.entries()) {
                if (moment(el.start_date) > moment(this.currentYear.end_date)
                    && moment(el.start_date) < moment()
                    && moment(el.end_date) > moment()) {
                    nextYear = el;
                    break;
                }
            }

            if (nextYear) {
                const data = {
                    _valid_for: nextYear._id,
                    _valid_for_date: nextYear.name,
                    reregistered: true
                };

                this.htcService.update('account', this.curAccount._id, data).subscribe((res) => {
                    if (res.count > 1) {
                        this.authService.setCurrentAccount(res.data);
                    }
                    // this.matDialogRef.close();
                    this.loading = false;
                }, () => {
                    // this.matDialogRef.close();
                    this.loading = false;
                });
            }
        }
    }

    onOk() {
        this.matDialogRef.close();
    }
}
