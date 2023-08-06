import * as _ from 'lodash';
import { Component, OnInit, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, HttpCommonService, AuthService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormType, YearGroups } from 'src/app/core/enums';
import { SharedDataService } from 'src/app/core/services/shared_data.service';
import { config } from 'src/app/config';
	
@Component({
    selector: 'app-runner-form-dlg',
    templateUrl: './runner-form-dialog.component.html',
    styleUrls: ['./runner-form-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RunnerFormDlgComponent implements OnInit {
	
    @ViewChild('formRunner', {}) formRunner;
    curAccount;
    dlgTitle = 'Runner';

    selectedTab = 1;
    forms = [];
    sessions = [];
    formTypes = FormType;
    yearGroups = YearGroups;
    mergeId;
    parentId;
    form: FormGroup;
    submitted = false;
    formType;
    sourceData;

    formCert = {
        milestone: 'custom',
        distance: 0
    };

    loading = false;

    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private matDialogRef: MatDialogRef<RunnerFormDlgComponent>,
        private alertService: AlertService,
        private sharedDataService: SharedDataService,
        private authService: AuthService
    ) {
        this.curAccount = this.authService.getCurrentAccount();		
        this.sourceData = this.data;
        this.formType = this.data.action;
        this.selectedTab = this.data.tab_index;
        if ( this.formType === FormType.NEW ) {
            this.dlgTitle = 'Create';
            this.selectedTab = 1;
        } else {
            this.mergeId = this.sourceData.data.merge_id;
            this.parentId = this.sourceData.data._parent_id;
            this.dlgTitle = 'Edit';
        }
    }
	
    ngOnInit() {
        let options: any = {
            by: 'name',
            where: {
                deleted: false,
                _academic_year_id: this.curAccount._valid_for
            }
        };

        this.loading = true;
        this.htcService.post('form/search', options).subscribe((result) => {
            if (result.count > 0) {
                this.forms = result.data;
            }
			
            if (this.formType === FormType.EDIT) {
                options = {
                    where: {
                        deleted: false,
                        _academic_year_id: this.curAccount._valid_for,
                        _runner_id: this.sourceData.data._id,
                    },
                    select: ['distance']
                };
				this.sourceData.currentyear=this.curAccount._valid_for;
                this.htcService.post('session/search', options).subscribe((result) => {
                    if(result.count > 0) {
                        this.sessions = result.data;
                    }
                    this.loading = false;
					console.log(this.sourceData); 
                }, () => {
                    this.loading = false;
                });
            } else {
                this.loading = false;
            }
        }, () => {
            this.loading = false;
            this.alertService.openSnackBar('Error occured while get forms list.', 'error');
            this.matDialogRef.close();
        });

        let firstName = '';
        let lastName = '';
        let upn = '';
        let parentEmail = '';
        let gender = '';
        let yearGroup = '';
        let formId = '';

        if (this.formType === FormType.EDIT) {
            firstName = this.sourceData.data.first_name;
            lastName = this.sourceData.data.last_name;
            upn = this.sourceData.data.upn;
            parentEmail = this.sourceData.data.parent_email;
            gender = this.sourceData.data.gender;
            yearGroup = this.sourceData.data.year_group;
            formId = this.sourceData.data._form_id;
        }

        this.form = this.fb.group({
            first_name: [firstName, [Validators.required]],
            last_name: [lastName, [Validators.required]],
            upn: [upn, null],
            parent_email: [parentEmail, null],
            gender: [gender, [Validators.required]],
            year_group: [yearGroup, [Validators.required]],
            _form_id: [formId, [Validators.required]],
        });
    }

    onSubmitRunner() {
        if (this.form.invalid) {
            alert('Please fill correct information');
            return;
        }

        this.loading = true;

        const data = this.form.value;
        const selectedForm = this.forms.find((item) => item._id === this.form.get('_form_id').value);
        data.form_name = selectedForm && selectedForm.name;

        if (this.formType === FormType.NEW) {
            data._school_runner = true;
            this.htcService.post('runner/create', data).subscribe(() => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while create runner.', 'error', 0);
                console.log(err);
            });
        } else {
            console.log(data);
            this.htcService.update('runner', this.sourceData.data._id, data).subscribe(() => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while update runner.', 'error');
                console.log(err);
            });
        }
    }

    onChangeMS() {
        if (this.formCert.milestone === 'custom') {
            this.formCert.distance = 0;
        } else if (this.formCert.milestone === 'current') {
            //this.formCert.distance = Math.round(this.sourceData.data._total_distance / 1000);			
             const total_distance_:number = this.sourceData.data.data[this.curAccount._valid_for]._total_verified_distance / 1000;			
			this.formCert.distance = parseFloat((total_distance_).toFixed(1)); 
            
        } else {
            this.formCert.distance = parseInt(this.formCert.milestone, 10);
        }
    }

    onCertificate() {
        const data = {
            type: 'SINGLE',
            certificate: {
                runner_name: this.sourceData.data.name,
                distance: this.formCert.distance,
                date: new Date()
            }
        };

        this.sharedDataService.setCertToken(data);
        window.open(`${config.CLIENT_URL}/dashboard/print-custom-certificate`, '_blank');
    }

    onSendEmailCode() {
        this.loading = true;
        this.htcService.update('runner/set-parent', this.sourceData.data._id, {}).subscribe(() => {
            this.loading = false;
            this.matDialogRef.close({
                success: true
            });
        }, (err) => {
            this.loading = false;
            const errMsg = _.get(err, 'error.error.message', 'Error occured while send email code.');
            this.alertService.openSnackBar(errMsg, 'error');
        });
    }

    onQrPrint() {
        const data = {
            type: 'SINGLE',
            data: {
                name: this.sourceData.data.name,
                form_name: this.sourceData.data.form_name,
                merge_id: this.sourceData.data.merge_id
            }
        };

        this.sharedDataService.setCertToken(data);
        window.open(`${config.CLIENT_URL}/dashboard/print-pair-runner`, '_blank');
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
}