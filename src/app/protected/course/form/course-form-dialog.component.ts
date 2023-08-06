import * as _ from 'lodash';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, AuthService, HttpCommonService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormType } from 'src/app/core/enums';


@Component({
    selector: 'app-course-form-dlg',
    templateUrl: './course-form-dialog.component.html',
    styleUrls: ['./course-form-dialog.component.scss']
})
export class CourseFormDlgComponent implements OnInit {

    dlgTitle = 'Course';

    curAccount;
    isKrfAccount = false;

    form: FormGroup;
    submitted = false;
    formType;
    sourceData;

    loading = false;

    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private matDialogRef: MatDialogRef<CourseFormDlgComponent>,
        private authService: AuthService,
        private alertService: AlertService
    ) {
        this.curAccount = this.authService.getCurrentAccount();
        this.isKrfAccount = this.authService.isKrfAccount();
        this.sourceData = data;
        this.formType = data.action;
        if (this.formType === FormType.NEW) {
            this.dlgTitle = 'Create Course';
        } else {
            this.dlgTitle = 'Edit Course';
        }
    }

    ngOnInit() {
        // this.alertService.openSnackBar('Successfully added', 'success', 1000000);
        let name = '';
        let distance = '';
        let postCode = '';
        if (this.formType === FormType.EDIT) {
            name = this.sourceData.data.name;
            distance = this.sourceData.data.distance;
            postCode = _.get(this.sourceData.data, 'post_code');
        }

        this.form = this.fb.group({
            name: [name, [Validators.required]],
            distance: [distance, [Validators.required]],
            post_code: [postCode, null],
        });
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.form.invalid) {
            alert('Please fill correct information');
            return;
        }

        this.loading = true;

        if (this.formType === FormType.NEW) {
            const data = this.form.value;
            data._account_id = this.curAccount._id;

            this.htcService.post('course/create', data).subscribe((result) => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                alert('error occured while create form');
                this.loading = false;
                console.log(err);
            });
        } else {
            console.log(this.form.value);
            this.htcService.update('course', this.sourceData.data._id, this.form.value).subscribe((result) => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                alert('error occured while create form');
                this.loading = false;
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
