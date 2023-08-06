import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, HttpCommonService, AuthService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormType } from 'src/app/core/enums';


@Component({
    selector: 'app-county-form-dlg',
    templateUrl: './county-form-dialog.component.html',
    styleUrls: ['./county-form-dialog.component.scss']
})
export class CountyFormDlgComponent implements OnInit {

    dlgTitle = 'County';

    form: FormGroup;
    submitted = false;
    formType;
    sourceData;

    loading = false;

    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private matDialogRef: MatDialogRef<CountyFormDlgComponent>,
        private alertService: AlertService
    ) {
        this.sourceData = data;
        this.formType = data.action;
        if (this.formType === FormType.NEW) {
            this.dlgTitle = 'Create County';
        } else {
            this.dlgTitle = 'Edit County';
        }
    }

    ngOnInit() {
        // this.alertService.openSnackBar('Successfully added', 'success', 1000000);
        let name = '';
        let country = '';
        if (this.formType === FormType.EDIT) {
            name = this.sourceData.data.name;
            country = this.sourceData.data.country;
        }

        this.form = this.fb.group({
            country: [country, [Validators.required]],
            name: [name, [Validators.required]]
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

            this.htcService.post('county/create', this.form.value).subscribe(() => {
                console.log(this.form.value);
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while create county.', 'error', 0);
                console.log(err);
            });
        } else {
            this.htcService.update('county', this.sourceData.data._id, this.form.value).subscribe(() => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while update county.', 'error');
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
