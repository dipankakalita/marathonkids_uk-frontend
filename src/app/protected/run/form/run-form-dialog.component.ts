import * as _ from 'lodash';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, HttpCommonService, AuthService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormType } from 'src/app/core/enums';

@Component({
    selector: 'app-run-form-dlg',
    templateUrl: './run-form-dialog.component.html',
    styleUrls: ['./run-form-dialog.component.scss']
})

export class RunFormDlgComponent implements OnInit {

    curAccount;
    dlgTitle = 'Run';

    courses = [];
    forms = [];

    form: FormGroup;
    submitted = false;
    formType;
    sourceData;

    loading = false;
    loadingForms = false;

    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private matDialogRef: MatDialogRef<RunFormDlgComponent>,
        private alertService: AlertService,
        private authService: AuthService
    ) {
        this.curAccount = this.authService.getCurrentAccount();
        this.sourceData = this.data;
		
        this.formType = this.data.action;
        if (this.formType === FormType.NEW) {
            this.dlgTitle = 'Create Run';
        } else {
            this.dlgTitle = 'Edit Run';
        }
    }

    ngOnInit() {
        this.loading = true;
        this.htcService.get('course/getAll').subscribe((result) => {
            if (result.count > 0) {
                this.courses = result.data;
            }
            this.loading = false;
        }, () => {
            this.loading = false;
            this.alertService.openSnackBar('Error occured while get run region list.', 'error');
            this.matDialogRef.close();
        });

        const options: any = {
            by: 'name',
            where: {
                deleted: false
            }
        };

        this.loadingForms = true;
        options.where._academic_year_id = this.curAccount._valid_for;
        this.htcService.post('form/search', options).subscribe((result) => {
            if (result.count > 0) {
                this.forms = result.data;
            }
            this.loadingForms = false;
        }, () => {
            this.loadingForms = false;
            this.alertService.openSnackBar('Error occured while get run region list.', 'error');
            this.matDialogRef.close();
        });

        let name = '';
        let startDate = new Date();
        let courseId = '';
        const formIds = [];

        if (this.formType === FormType.EDIT) {
            name = this.sourceData.data.name;
            startDate = this.sourceData.data.start_date;
            courseId = _.get(this.sourceData.data, '_course_id._id');
            for (const form of this.sourceData.data.forms) {
                formIds.push(form);
            }
			
			console.log('formIds = ',formIds);
			console.log('sourceData forms =',this.sourceData.data.forms);
        }

        this.form = this.fb.group({
            name: [name, [Validators.required]],
            start_date: [startDate, [Validators.required]],
            _course_id: [courseId, [Validators.required]],
            forms: [formIds, null],
        });
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.form.invalid) {
            alert('Please fill correct information');
            return;
        }

        this.loading = true;

        const data = this.form.value;
        data.end_date = data.start_date;

        if (this.formType === FormType.NEW) {
			
			console.log('event input',data);
            this.htcService.post('event/create', data).subscribe((result) => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true,
                    data: result.data
                });
            }, (err) => {
                this.loading = false;
                if (_.get(err, ['error', 'error', 'name'], '') == 'Duplicate Record Exists') {
                    this.alertService.openSnackBar('Event name already exists.', 'error', 0);
                } else {
                    this.alertService.openSnackBar('Error occured while create event.', 'error', 0);
                }
                console.log(err);
            });
        } else {
			console.log('event edit',data);
			console.log('event sourceData',this.sourceData.data._id);
            this.htcService.update('event', this.sourceData.data._id, data).subscribe((result) => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true,
                    data: result.data
                });
            }, (err) => {
                this.loading = false;
                if (_.get(err, ['error', 'error', 'name'], '') == 'Duplicate Record Exists') {
                    this.alertService.openSnackBar('Event name already exists.', 'error', 0);
                } else {
                    this.alertService.openSnackBar('Error occured while create event.', 'error', 0);
                }
                this.alertService.openSnackBar('Error occured while update run.', 'error');
                console.log(err);
            });
        }
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
