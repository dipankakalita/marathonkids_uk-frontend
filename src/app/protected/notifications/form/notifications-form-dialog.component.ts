import * as _ from 'lodash';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, AuthService, HttpCommonService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormType } from 'src/app/core/enums';
import * as moment from 'moment';


@Component({
    selector: 'app-notifications-form-dlg',
    templateUrl: './notifications-form-dialog.component.html',
    styleUrls: ['./notifications-form-dialog.component.scss']
})
export class NotificationsFormDlgComponent implements OnInit {

    dlgTitle = 'Notifications';

    curAccount;
    isKrfAccount = false;

	maxCharsHeading = 100;
	rolehead = '';
	rolechars = 0;
	
	maxChars = 280;
	role = '';
	chars = 0;
    form: FormGroup;
    submitted = false;
    formTypeLocal;
    sourceData;
    options = [{
        name : "BOTH",
        _id : '1'
    },
    {
        name : "DTS",
        _id : '2'
    },
    {
        name : "APP",
        _id : '3'
    }];

    loading = false;

    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private matDialogRef: MatDialogRef<NotificationsFormDlgComponent>,
        private authService: AuthService,
        private alertService: AlertService
    ) {
        this.curAccount = this.authService.getCurrentAccount();
        this.isKrfAccount = this.authService.isKrfAccount();
        this.sourceData = data; 
        this.formTypeLocal = data.action; 
        if (this.formTypeLocal === FormType.NEW) {
            this.dlgTitle = 'Create Notification';
        } else {
            this.dlgTitle = 'Edit Notification';
        }
    }

    ngOnInit() {
        var message = '';
        var heading = '';
        var display_on = '';
        var expiry_date = '';
        var start_date = '';
        if (this.formTypeLocal === FormType.EDIT) {
            message = this.sourceData.data.message;
            heading = this.sourceData.data.heading;
            display_on = this.sourceData.data.display_on;
            expiry_date = moment(this.sourceData.data.expiry_date).toISOString(); 
            start_date = moment(this.sourceData.data.start_date).toISOString(); 
        } 
		this.form = this.fb.group({
			message: [message, [Validators.required]],
			heading: [heading, [Validators.required]],
			display_on: [display_on, [Validators.required]],
			expiry_date: [expiry_date, [Validators.required]],
			start_date: [start_date, [Validators.required]]
		}); 
		console.log(this.form);
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.form.invalid) {
            alert('Please fill correct information');
            return;
        }

        this.loading = true;  
        if (this.formTypeLocal === FormType.NEW) {
			
            const data = this.form.value;
            data._account_id = this.curAccount._id;

            this.htcService.post('notification/create', data).subscribe((result) => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                alert('error occured while create form');
                this.loading = false;
                console.log(err);
            });
           
        }else{
			
            this.htcService.update('notification', this.sourceData.data._id, this.form.value).subscribe((result) => {
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
    isInvalidLength(field) {
        return ((this.submitted || this.form.get(field).touched) && this.form.get(field).errors);
    }

}
