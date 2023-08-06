import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, HttpCommonService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormType } from 'src/app/core/enums';


@Component({
    selector: 'app-country-form-dlg',
    templateUrl: './country-form-dialog.component.html',
    styleUrls: ['./country-form-dialog.component.scss']
})
export class CountryFormDlgComponent implements OnInit {

    dlgTitle = 'Country';

    form: FormGroup;
    submitted = false;
    formType;
    sourceData;

    loading = false;

    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private matDialogRef: MatDialogRef<CountryFormDlgComponent>,
        private alertService: AlertService
    ) {
        this.sourceData = data;
        this.formType = data.action;
        if (this.formType === FormType.NEW) {
            this.dlgTitle = 'Create Country';
        } else {
            this.dlgTitle = 'Edit Country';
        }
    }

    ngOnInit() {
        // this.alertService.openSnackBar('Successfully added', 'success', 1000000);
        let name = '';
        if (this.formType === FormType.EDIT) {
            name = this.sourceData.data.name;
        }

        this.form = this.fb.group({
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

            this.htcService.post('countries', this.form.value).subscribe(() => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while create country.', 'error', 0);
                console.log(err);
            });
        } else {
            this.htcService.update('countries', this.sourceData.data._id, this.form.value).subscribe(() => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while update country.', 'error');
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
