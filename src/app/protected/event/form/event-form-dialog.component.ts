import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, HttpCommonService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormType } from 'src/app/core/enums';


@Component({
    selector: 'app-event-form-dlg',
    templateUrl: './event-form-dialog.component.html',
    styleUrls: ['./event-form-dialog.component.scss']
})
export class EventFormDlgComponent implements OnInit {

    dlgTitle = 'Event';

    courses = [];
    form: FormGroup;
    submitted = false;
    formType;
    sourceData;

    loading = false;

    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private matDialogRef: MatDialogRef<EventFormDlgComponent>,
        private alertService: AlertService
    ) {
        this.sourceData = this.data;
        this.formType = this.data.action;
        if (this.formType === FormType.NEW) {
            this.dlgTitle = 'Create Event';
        } else {
            this.dlgTitle = 'Edit Event';
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
            this.alertService.openSnackBar('Error occured while get courses.', 'error');
            this.matDialogRef.close();
        });

        let name = '';
        let startDate = '';
        let endDate = '';
        let course = '';

        if (this.formType === FormType.EDIT) {
            name = this.sourceData.data.name;
            startDate = this.sourceData.data.start_date;
            endDate = this.sourceData.data.end_date;
            course = this.sourceData.data._course_id;
        }

        this.form = this.fb.group({
            name: [name, [Validators.required]],
            start_date: [startDate, [Validators.required]],
            end_date: [endDate, [Validators.required]],
            _course_id: [course, [Validators.required]],
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
			console.log('val = ' , this.form.value);
			console.log(this.form.value);
			
            this.htcService.post('event/create', this.form.value).subscribe(() => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while create event.', 'error', 0);
                console.log(err);
            });
        } else {
            this.htcService.update('event', this.sourceData.data._id, this.form.value).subscribe(() => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while update event.', 'error');
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
