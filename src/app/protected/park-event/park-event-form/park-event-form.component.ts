import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, HttpCommonService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormType } from 'src/app/core/enums';


@Component({
  selector: 'app-park-event-form',
  templateUrl: './park-event-form.component.html',
  styleUrls: ['./park-event-form.component.scss']
})
export class ParkEventFormComponent implements OnInit {

    dlgTitle = 'Park Event';

    courses = [];
	town =[];
	county = [];
    form: FormGroup;
    submitted = false;
    formType;
    sourceData;

    loading = false;

    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private matDialogRef: MatDialogRef<ParkEventFormComponent>,
        private alertService: AlertService
    ) {
        this.sourceData = this.data;
        this.formType = this.data.action;
        if (this.formType === FormType.NEW) {
            this.dlgTitle = 'Create Park Event';
        } else {
            this.dlgTitle = 'Edit Park Event';
        }
    }

    ngOnInit() {
        this.loading = false;
        this.htcService.get('county/getAll').subscribe((result) => {
            if (result.count > 0) {
                this.county = result.data;
            }
            this.loading = false;
        }, () => {
            this.loading = false;
            this.alertService.openSnackBar('Error occured while get county.', 'error');
            this.matDialogRef.close();
        });
		this.htcService.get('town/getAll').subscribe((result) => {
            if (result.count > 0) {
                this.town = result.data;
            }
            this.loading = false;
        }, () => {
            this.loading = false;
            this.alertService.openSnackBar('Error occured while get town.', 'error');
            this.matDialogRef.close();
        });
        let name = '';
        let startDate = '';
        let county = '';
		let postCode = '';
		let town = ''; 
        if (this.formType === FormType.EDIT) {
            name = this.sourceData.data.name;
            startDate = this.sourceData.data.start_date;
            county = this.sourceData.data._county_id;
            town = this.sourceData.data._town_id;
			postCode = this.sourceData.data.post_code;
        }

        this.form = this.fb.group({
            name: [name, [Validators.required]],
            start_date: [startDate, [Validators.required]],
            _county_id: [county, [Validators.required]],
			_town_id: [town, [Validators.required]],
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
			console.log('val = ' , this.form.value);
			console.log(this.form.value);
			
            this.htcService.post('parkEvent/create', this.form.value).subscribe(() => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while create park Event.', 'error', 0);
                console.log(err);
            });
        } else {
            this.htcService.update('parkEvent', this.sourceData.data._id, this.form.value).subscribe(() => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while update park Event.', 'error');
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
