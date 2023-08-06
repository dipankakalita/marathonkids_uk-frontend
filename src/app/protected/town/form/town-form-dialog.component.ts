import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, HttpCommonService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormType } from 'src/app/core/enums';


@Component({
    selector: 'app-town-form-dlg',
    templateUrl: './town-form-dialog.component.html',
    styleUrls: ['./town-form-dialog.component.scss']
})
export class TownFormDlgComponent implements OnInit {

    dlgTitle = 'Town';


    counties = [];
    form: FormGroup;
    submitted = false;
    formType;
    sourceData;

    loading = false;

    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private matDialogRef: MatDialogRef<TownFormDlgComponent>,
        private alertService: AlertService
    ) {
        this.sourceData = data;
        this.formType = data.action;
        if (this.formType === FormType.NEW) {
            this.dlgTitle = 'Create Town';
        } else {
            this.dlgTitle = 'Edit Town';
        }
    }

    ngOnInit() {
        this.loading = true;
        this.htcService.get('county/getAll').subscribe((result) => {
            if (result.count > 0) {
                this.counties = result.data;
            }
            this.loading = false;
        }, () => {
            this.loading = false;
            this.alertService.openSnackBar('Error occured while get county list.', 'error');
            this.matDialogRef.close();
        });

        let name = '';
        let countyId = '';
        if (this.formType === FormType.EDIT) {
            console.log(this.sourceData);
            name = this.sourceData.data.name;
            countyId = this.sourceData.data._county_id;
        }

        this.form = this.fb.group({
            _county_id: [countyId, [Validators.required]],
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

            this.htcService.post('town/create', this.form.value).subscribe(() => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while create town.', 'error', 0);
                console.log(err);
            });
        } else {
            this.htcService.update('town', this.sourceData.data._id, this.form.value).subscribe(() => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while update town.', 'error');
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
