import * as _ from 'lodash';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertService, HttpCommonService, AuthService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormType } from 'src/app/core/enums';
import { PermissionProfiles } from 'src/app/core/enums/permission_profiles';
import * as Utils from 'src/app/core/helpers/utils';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-user-form-dlg',
    templateUrl: './user-form-dialog.component.html',
    styleUrls: ['./user-form-dialog.component.scss']
})
export class UserFormDlgComponent implements OnInit, OnDestroy {

    public accountFilterCtrl: FormControl = new FormControl();
    public filteredAccounts: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    protected onDestroyAccount = new Subject<void>();

    dlgTitle = 'User';

    curAccount;
    accountList = [];
    permProfiles = PermissionProfiles;
    permissions = PermissionProfiles.slice(PermissionProfiles.length - 4);

    emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    form: FormGroup;
    submitted = false;
    formType;
    sourceData;

    loading = false;

    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private matDialogRef: MatDialogRef<UserFormDlgComponent>,
        private alertService: AlertService,
        public authService: AuthService
    ) {
        this.curAccount = this.authService.getCurrentAccount();

        this.sourceData = data;
        this.formType = data.action;
        if (this.formType === FormType.NEW) {
            this.dlgTitle = 'Create User';
        } else {
            this.dlgTitle = 'Edit User';
        }

        let permissionCnt = 2;    // when account admin

        if (this.authService.isMainAdmin()) {
            permissionCnt = 4;
        } else if (this.authService.isAccountAdmin()) {
            permissionCnt = 3;
        }

        this.permissions = PermissionProfiles.slice(PermissionProfiles.length - permissionCnt);
    }

    ngOnInit() {
        let name = '';
        let username = '';
        let phoneNumber = '';
        let email = '';
        let profileId = '';
        let accountId = null;

        if (this.formType === FormType.EDIT) {

            name = this.sourceData.data.name;
            email = this.sourceData.data.local_email;
            username = this.sourceData.data.local_username;
            phoneNumber = this.sourceData.data.phone_number;
            profileId = this.sourceData.data.account._profile_id;
            accountId = this.sourceData.data.account._id;

            if (profileId === this.permProfiles[5].id) {
                this.permissions = PermissionProfiles.slice(-1);
            } else {
                this.permissions = PermissionProfiles.slice(3, 5);
            }
        }

        if (this.authService.isMainAdmin()) {
            this.form = this.fb.group({
                name: [name, [Validators.required]],
                email_address: [email, null],
                username: [username, null],
                phone_number: [phoneNumber, null],
                _account_id: [accountId, [Validators.required]],
                password: ['', null],
                password_confirmation: ['', null],
                _profile_id: [profileId, [Validators.required]]
            }, {
                validator: [
                    this.MatchConfirm('password', 'password_confirmation')
                ]
            });
        } else {
            this.form = this.fb.group({
                name: [name, [Validators.required]],
                email_address: [email, null],
                username: [username, null],
                phone_number: [phoneNumber, null],
                password: ['', null],
                password_confirmation: ['', null],
                _profile_id: [profileId, [Validators.required]]
            }, {
                validator: [
                    this.MatchConfirm('password', 'password_confirmation')
                ]
            });
        }

        this.setFormValidators();

        if (this.authService.isMainAdmin()) {
            this.loading = true;

            const options: any = {
                where: {
                    deleted: false,
                    active: true
                }
            };

            this.htcService.post('account/getAll', options).subscribe((resAccounts) => {
                this.accountList = resAccounts.data;
                setTimeout(() => {
                    // load the initial county list
                    this.filteredAccounts.next(this.accountList.slice());

                    // listen for search field value changes
                    this.accountFilterCtrl.valueChanges
                        .pipe(takeUntil(this.onDestroyAccount))
                        .subscribe(() => {
                            this.filterItems(this.accountList, this.accountFilterCtrl, this.filteredAccounts);
                        });

                    this.loading = false;
                }, 500);
            }, () => {
                this.loading = false;
            });
        }
    }

    filterItems(itemArray, itemCtrl, filtered) {
        if (!itemArray) {
            return;
        }
        // get the search keyword
        let search = itemCtrl.value;
        if (!search) {
            filtered.next(itemArray.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        filtered.next(
            itemArray.filter(item => item.school_name.toLowerCase().indexOf(search) > -1)
        );
    }

    ngOnDestroy() {
        this.onDestroyAccount.next();
        this.onDestroyAccount.complete();
    }

    setFormValidators() {
        // if role is limited user
        if (this.controls._profile_id.value === this.permProfiles[5].id) {
            this.controls.username.setValidators([Validators.required]);
            if (this.formType === FormType.NEW) {
                this.controls.password.setValidators([Validators.required]);
            }
            this.controls.email_address.setValidators(null);
        } else {
            if (this.controls._profile_id.value === this.permProfiles[2].id) {
                this.form.get('_account_id').setValue(this.curAccount._id);
            }

            this.controls.username.setValidators(null);
            if (this.formType === FormType.NEW) {
                this.controls.password.setValidators(null);
            }
            this.controls.email_address.setValidators([Validators.required, Validators.pattern(this.emailRegEx)]);
        }

        this.controls.username.updateValueAndValidity();
        this.controls.password.updateValueAndValidity();
        this.controls.email_address.updateValueAndValidity();
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.form.invalid) {
            alert('Please fill correct information');
            return;
        }

        this.loading = true;

        const data: any = {
            name: this.form.get('name').value,
            _profile_id: this.form.get('_profile_id').value
        };

        if (this.authService.isMainAdmin()) {
            data._account_id = this.form.get('_account_id').value;

            const accountObj = this.accountList.find((item) => item._id === data._account_id);
            if (accountObj) {
                data.account_name = accountObj.school_name;
            }
        } else {
            data._account_id = this.curAccount._id;
            data.account_name = this.curAccount.school_name;
        }

        if (this.formType === FormType.NEW) {
            data.phone_number = this.form.get('phone_number').value;

            if (this.controls._profile_id.value === this.permProfiles[5].id) {
                data.username = this.form.get('username').value;
                data.password = this.form.get('password').value;
            } else {
                data.email = this.form.get('email_address').value;
            }

            this.htcService.post('user/create', data).subscribe(() => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                if (err.status === 400 && err.error.error.code === 40001) {
                    this.alertService.openSnackBar(err.error.error.message, 'error', 5000);
                } else {
                    this.alertService.openSnackBar('Error occured while create user.', 'error', 5000);
                }
                console.log(err);
            });
        } else {
            data.phone_number = this.form.get('phone_number').value;
            data.update_field = true;

            if (this.controls._profile_id.value === this.permProfiles[5].id) {
                data.local = {
                    username: this.form.get('username').value
                };
                data.password = this.form.get('password').value;
            } else {
                data.email = this.form.get('email_address').value;
            }

            this.htcService.update('user', this.sourceData.data.id, data).subscribe(() => {
                this.loading = false;
                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while update user.', 'error');
                console.log(err);
            });
        }
    }

    onChangeRole() {
        this.setFormValidators();
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

    private MatchConfirm(type1: any, type2: any) {

        return (checkForm: FormGroup) => {
            const value1 = checkForm.controls[type1];
            const value2 = checkForm.controls[type2];

            if (value1.value === value2.value) {
                return value2.setErrors(null);
            } else {
                return value2.setErrors({ notEquivalent: true });
            }
        };
    }
}
