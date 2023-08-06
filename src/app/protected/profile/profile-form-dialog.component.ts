import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, HttpCommonService, AuthService } from 'src/app/core/services';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-profile-form-dlg',
    templateUrl: './profile-form-dialog.component.html',
    styleUrls: ['./profile-form-dialog.component.scss']
})
export class ProfileFormDlgComponent implements OnInit {

    dlgTitle = 'Profile';

    curUser;

    emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    form: FormGroup;
    submitted = false;

    loading = false;

    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
        private matDialogRef: MatDialogRef<ProfileFormDlgComponent>,
        private authService: AuthService,
        private alertService: AlertService
    ) {
        this.curUser = this.authService.getCurrentUser();
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: [this.curUser.name, [Validators.required]],
            email: [this.curUser.local.email, [Validators.required, Validators.pattern(this.emailRegEx)]],
            phone_number: [this.curUser.phone_number, null],
        });
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.form.invalid) {
            alert('Please fill correct information');
            return;
        }

        this.loading = true;

        this.htcService.update('user', this.curUser._id, this.form.value).subscribe(() => {
            this.loading = false;

            const updates = this.form.value;
            for (const key in updates) {
                if (key in updates) {
                    this.curUser[key] = updates[key];
                }
            }
            this.authService.setCurrentUser(this.curUser);

            this.matDialogRef.close({
                success: true
            });
        }, (err) => {
            this.loading = false;
            this.alertService.openSnackBar('Error occured while update profile.', 'error');
            console.log(err);
        });
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
