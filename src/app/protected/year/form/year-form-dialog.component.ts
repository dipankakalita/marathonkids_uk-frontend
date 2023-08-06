import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, HttpCommonService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormType } from 'src/app/core/enums';


@Component({
    selector: 'app-year-form-dlg',
    templateUrl: './year-form-dialog.component.html',
    styleUrls: ['./year-form-dialog.component.scss']
})
export class YearFormDlgComponent implements OnInit {

    dlgTitle = 'Year';

    yearRegions = [];
    form: FormGroup;
    submitted = false;
    formType;
    sourceData;

    loading = false;

    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private matDialogRef: MatDialogRef<YearFormDlgComponent>,
        private alertService: AlertService
    ) {
        this.sourceData = this.data;
        this.formType = this.data.action;
        if (this.formType === FormType.NEW) {
            this.dlgTitle = 'Create Year';
        } else {
            this.dlgTitle = 'Edit Year';
        }
    }

    ngOnInit() {
        this.loading = true;
        this.htcService.get('region/getAll').subscribe((result) => {
            if (result.count > 0) {
                this.yearRegions = result.data;
            }
            this.loading = false;
        }, () => {
            this.loading = false;
            this.alertService.openSnackBar('Error occured while get year region list.', 'error');
            this.matDialogRef.close();
        });

        let name = '';
        let startDate = '';
        let endDate = '';
        let aYRegion = '';

        if (this.formType === FormType.EDIT) {
            name = this.sourceData.data.name;
            startDate = this.sourceData.data.start_date;
            endDate = this.sourceData.data.end_date;
            aYRegion = this.sourceData.data._academic_year_region;
        }

        this.form = this.fb.group({
            name: [name, [Validators.required]],
            start_date: [startDate, [Validators.required]],
            end_date: [endDate, [Validators.required]],
            _academic_year_region: [aYRegion, [Validators.required]],
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
        const selectedRegion = this.yearRegions.find((item) => item._id === this.form.get('_academic_year_region').value);
        data.region_name = selectedRegion.name;

        if (this.formType === FormType.NEW) {

            this.htcService.post('year/create', data).subscribe(() => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while create year.', 'error', 0);
                console.log(err);
            });
        } else {
            this.htcService.update('year', this.sourceData.data._id, data).subscribe(() => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while update year.', 'error');
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
