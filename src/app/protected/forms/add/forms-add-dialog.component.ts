import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, HttpCommonService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormType } from 'src/app/core/enums';


@Component({
    selector: 'app-forms-add-dlg',
    templateUrl: './forms-add-dialog.component.html',
    styleUrls: ['./forms-add-dialog.component.scss']
})
export class FormsAddDlgComponent implements OnInit {

    dlgTitle = 'Form';

    form: FormGroup;
    submitted = false;
    formType;
    sourceData;

    loading = false;

    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private matDialogRef: MatDialogRef<FormsAddDlgComponent>,
        private alertService: AlertService
    ) {
        console.log(data);
        this.sourceData = data;
        this.formType = data.action;

        if (this.formType === FormType.NEW) {
            this.dlgTitle = 'Create Reg Group';
        } else {
            this.dlgTitle = 'Edit Reg Group';
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
            this.htcService.post('form/create', this.form.value).subscribe((result) => {
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
            this.htcService.update('form', this.sourceData.data._id, this.form.value).subscribe((result) => {
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
