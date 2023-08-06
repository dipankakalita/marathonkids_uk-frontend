import * as _ from 'lodash';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, HttpCommonService, AuthService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpgradePkgDlgComponent } from '../upgrade-package-dialog/upgrade-package-dialog.component';
import { FormType, YearGroups } from 'src/app/core/enums';
import { config } from 'src/app/config';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-automated-run-scan-dialog',
    templateUrl: './automated-run-scan-dialog.component.html',
    styleUrls: ['./automated-run-scan-dialog.component.scss']
})

export class AutoRunScanDlgComponent implements OnInit {

    curAccount;
    dlgTitle = 'Print QR codes';

    curUser;

    forms = [];

    form: FormGroup;
    yearGroups = YearGroups;
    submitted = false;

    formType;
    sourceData;

    loading = false;
    loadingForms = false;
	@ViewChild('allSelected') private allSelected;
	
    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
		public matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private matDialogRefPkg: MatDialogRef<UpgradePkgDlgComponent>,
        private matDialogRef: MatDialogRef<AutoRunScanDlgComponent>,
        private alertService: AlertService,
        private authService: AuthService
    ) {
        this.curUser = this.authService.getCurrentUser();
        this.curAccount = this.authService.getCurrentAccount();
    }
		
	onUpgrade(event): void {
		event.preventDefault();

		this.matDialog.open(UpgradePkgDlgComponent, {
		  width: '500px'
		});
	}
	  
    ngOnInit() {
        this.loading = true;
        
        const options: any = {
            by: 'name',
            where: {
                deleted: false
            }
        };
		
		var formIds = [];
		var yearIds = [];
        this.loadingForms = true;
        options.where._academic_year_id = this.curAccount._valid_for;
        this.htcService.post('form/search', options).subscribe((result) => {
            if (result.count > 0) {
                this.forms = result.data;
            }
            this.loadingForms = false;
            this.loading = false;
        }, () => {
            this.loadingForms = false;
            this.loading = false;
            this.alertService.openSnackBar('Error occured while get run region list.', 'error');
            this.matDialogRef.close();
        });
		
        this.form = this.fb.group({
            forms: [formIds, null],
            year_group: [yearIds, [Validators.required]],
        });
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.form.invalid) {
            alert('Please fill correct information');
            return;
        }

        this.loading = true;
        const options: any = {
			user_id: this.curUser._id,
			account: this.curUser.account,
			form_data: this.form.value,
			_academic_year_id : this.curAccount._valid_for,
        };
		const header: any = {
			
        };
        this.htcService.post1('runner/downloadQR', options).subscribe((data) => {
            var downloadLink = document.createElement('a')
            downloadLink.target = '_blank'
            downloadLink.download = 'RunsScanning.pdf'
            var blob = new Blob([data], { type: 'application/pdf' })
            var URL = window.URL || window.webkitURL
            var downloadUrl = URL.createObjectURL(blob)
            downloadLink.href = downloadUrl
            document.body.append(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(downloadUrl);
			
            this.loading = false;
			this.alertService.openSnackBar('PDF has been downloaded successfully.', 'success');
            this.matDialogRef.close({
                success: true
            });
        }, (err) => {
            this.loading = false;
            this.alertService.openSnackBar('No Runners Found for Selected Inputs!', 'error');
        });
		
    }

    onCancel() {
        this.matDialogRef.close();
    }

    get controls() {
        return this.form.controls;
    }

    isInvalid(field) {
        return ((this.submitted || this.form.get(field).touched) && this.form.get(field).errors);
    }
	
    toggleAllSelection() {
        if (this.allSelected.selected) {
			this.form.controls.year_group
				.patchValue([...this.yearGroups.map(item => item.value), 'ALLOW ALL']);
        } else {
			this.form.controls.year_group.patchValue([]);
        }
    }
    
}
