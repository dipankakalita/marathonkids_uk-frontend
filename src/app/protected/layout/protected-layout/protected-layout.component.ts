import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    AuthService
} from 'src/app/core/services';
import {
    MatDialog
} from '@angular/material/dialog';
import * as moment from 'moment';
import * as _ from 'lodash';
import {
    ReregistrationDlgComponent
} from '../reregistration/reregistration-dialog.component';
import {
    NewYearDlgComponent
} from '../dialogs/newyear-dlg/newyear-dialog.component';
import {
    NewYearLiteDlgComponent
} from '../dialogs/newyear-lite-dlg/newyear-lite-dialog.component';
import {
    PreNewYearDlgComponent
} from '../dialogs/pre-newyear-dlg/pre-newyear-dialog.component';
import {
    PreNewYearDownloadRunnerDlgComponent
} from '../dialogs/pre-newyear-download-runners-dlg/pre-newyear-download-runners-dialog.component';

import {
    YearService
} from 'src/app/core/services/year.service';
import {
    AlertDialogComponent
} from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
    selector: 'app-protected-layout',
    templateUrl: './protected-layout.component.html',
    styleUrls: ['./protected-layout.component.scss']
})

export class ProtectedLayoutComponent implements OnInit {

    curUser;
    curAccount;
    newYearRegistering = false;
    isMainAdmin = false;

    @ViewChild('drawer', {}) drawer;

    constructor(
        public authService: AuthService,
        public matDialog: MatDialog,
        private yearService: YearService
    ) {
        this.curUser = this.authService.getCurrentUser();
        this.curAccount = this.authService.getCurrentAccount();
        this.isMainAdmin = this.authService.isMainAdmin();
    }

    ngOnInit(): void {
        this.yearService.getYears().subscribe((resYears) => {
            if (resYears) {
                const years = resYears;
                const validYears = years.filter((item) => item._academic_year_region === this.curAccount._academic_year_region);

                // Reregistration Prompt Logic
                const curProfileId = _.get(this.curUser, 'account._profile_id');
                // Limited
                if (curProfileId != '58cbc4407d391b1b49591ad8' || this.curAccount.subdomain !== 'kidsrunfree') {
                    if (this.curAccount._valid_for) {
                        const curValidYear = years.find((item) => item._id === this.curAccount._valid_for);
                        if (moment() > moment(curValidYear.end_date)) {
                            // if (moment().add(2, 'days') > moment(curValidYear.end_date)) {
                            const renewalMute = this.curAccount.renewal_mute || '';
                            if (renewalMute === '' || moment() > moment(renewalMute)) {
                                this.newYearRegistering = true;
								// On 1st aug, or after 1st aug this popup will be raised
                                this.modalReregistration(curValidYear, validYears); 
                            }
                        }
                    }
                }

                setTimeout(() => {
                    // Pre New Year prompt Logic
                    if (this.curAccount._valid_for) {
                        const curValidYear = years.find((item) => item._id === this.curAccount._valid_for);
                        if (moment().add(15, 'days') > moment(curValidYear.end_date)) {
							if(this.curAccount.noticed_new_year != true){
								this.modalPreNewYear(); // 1st popup
							}
                        }
                    }
					
					/*
                    // New Year Prompt Logic
                    if (!this.authService.isKrfAccount()) {
                        if (sessionStorage.getItem('newYearRan') !== 'true') {
                            // sessionStorage.setItem('newYearRan', 'true');    joker's change
                            if (this.curAccount._valid_for) {
                                const curValidYear = years.find((item) => item._id === this.curAccount._valid_for);
                                if (moment() > moment(curValidYear.end_date) || moment(this.curAccount.last_import) < moment(curValidYear.start_date)) {
                                    if (this.authService.hasPermission('Account_Edit_Own')) {
                                        this.modalNewYear(curValidYear, validYears);
                                    } else {
                                        this.modalNewYearLite(curValidYear, validYears);
                                    }
                                }
                            }
                        }
                    }
					*/
					
                }, 1500);

            }

        });
    }
	
	// 1st Popup
    modalPreNewYear() {
        if (sessionStorage.getItem('newYearPopup') !== 'true') {
			this.matDialog.open(
				PreNewYearDlgComponent, {
					disableClose: true,
					width: '500px'
				}
			);
            sessionStorage.setItem('newYearPopup', 'true');
		}
    }
	
    // 3rd popup - 15 to 31 July continue 
	/*
    modalPreNewYearPopup() {
        if (sessionStorage.getItem('newYearPopup') !== 'true') {
			this.matDialog.open(
				PreNewYearDownloadRunnerDlgComponent, {
					disableClose: true,
					width: '500px'
				}
			);
		
            // let alertDialogRef = this.matDialog.open(AlertDialogComponent, {
                // disableClose: false,
                // maxWidth: '400px'
            // });
            // alertDialogRef.componentInstance.confirmMessage = 'Runners page data can now be downloaded by the School.';

            sessionStorage.setItem('newYearPopup', 'true');
        }
    }
	*/
	

	// 4th Popup (On 1st or after 1st aug login)
    modalReregistration(currentYear, validYears) {
		if(this.curAccount.subdomain !== "kidsrunfree"){
			this.matDialog.open(
				ReregistrationDlgComponent, {
					disableClose: true,
					width: '500px',
					data: {
						currentYear,
						validYears
					}
				}
			);
		}
    }
	
    // 5th Popup
    modalNewYear(currentYear, validYears) {
		if(this.curAccount.subdomain !== "kidsrunfree"){
			this.matDialog.open(
				NewYearDlgComponent, {
					disableClose: true,
					width: '500px',
					data: {
						currentYear,
						validYears
					}
				}
			);
		}
    }

	/*
    // 5th Popup
    modalNewYearLite(currentYear, validYears) {
        this.matDialog.open(
            NewYearLiteDlgComponent, {
                disableClose: true,
                width: '500px',
                data: {
                    currentYear,
                    validYears
                }
            }
        );
    }
	*/

    onToggleMenu() {
        this.drawer.toggle();
    }

}