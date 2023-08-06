import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { HttpCommonService, AuthService, AlertService  } from 'src/app/core/services';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UserFormDlgComponent } from '../form/user-form-dialog.component';
import { FormType } from 'src/app/core/enums';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { PermissionProfiles } from 'src/app/core/enums/permission_profiles';
import * as Utils from 'src/app/core/helpers/utils';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import * as _ from 'lodash';

@Component({
    selector: 'app-dashboard-user',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

    curAccount;
    users = [];
    displayedColumns: string[] = ['name', 'school', 'local.email', 'phone_number', 'verified', 'permission', 'action'];
    dataSource: MatTableDataSource<any>;
    @ViewChild('paginator', {}) paginator;

    totalCount = 0;
    pageSize = 10;
    currentPage = 1;

    searchForm: any = {
        filter: '',
        sort: {
            name: 'asc'
        },
    };
    filterAccount;
    filterAccountName;

    private modelChanged: Subject<string> = new Subject<string>();
    private subscription: Subscription;
    debounceTime = 600;

    loading = false;

    constructor(
        private htcService: HttpCommonService,
        public matDialog: MatDialog,
        private actRoute: ActivatedRoute,
        private alertService: AlertService,
        private router: Router,
        private authService: AuthService
    ) {
        this.curAccount = this.authService.getCurrentAccount();
    }

    ngOnInit() {
        this.actRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
            this.filterAccount = paramMap.get('account');
            this.filterAccountName = paramMap.get('name');
            this.loadUsers();
        });

        this.subscription = this.modelChanged
            .pipe(
                debounceTime(this.debounceTime),
            )
            .subscribe(() => {
                this.loadUsers('SEARCH');
            });
    }

    filterChanged() {
        this.modelChanged.next();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadUsers(type = null) {
        this.loading = true;

        if (type === 'SEARCH') {
            this.currentPage = 1;
            this.paginator.pageIndex = 1;
        }

        const options: any = {
            limit: this.pageSize,
            skip: (this.currentPage - 1) * this.pageSize,
            by: this.searchForm.sort,
            where: {
                deleted: false
            }
        };

        if (this.authService.isAccountAdmin()) {
            const validAccounts = [];
            _.set(validAccounts, ['0', `account._profile_id`], '58cbc4407d391b1b49591ad6');
            _.set(validAccounts, ['1', `account._profile_id`], '58cbc4407d391b1b49591ad7');
            _.set(validAccounts, ['2', `account._profile_id`], '58cbc4407d391b1b49591ad8');
            _.set(options, ['where', '$or'], validAccounts);
        } else if (this.authService.isAdmin()) {
            const validAccounts = [];
            _.set(validAccounts, ['0', `account._profile_id`], '58cbc4407d391b1b49591ad7');
            _.set(validAccounts, ['1', `account._profile_id`], '58cbc4407d391b1b49591ad8');
            _.set(options, ['where', '$or'], validAccounts);
        }

        if (this.filterAccount) {
            _.set(options, ['where', `account._id`], this.filterAccount);
        }

        if (this.searchForm.filter && this.searchForm.filter !== '') {
            options.filter = this.searchForm.filter;
        }

        this.users = [];

        this.htcService.post('user/search', options).subscribe((result) => {
            this.totalCount = result.total;
            for (const item of result.data) {
                this.users.push({
                    id: item._id,
                    name: item.name,
                    phone_number: item.phone_number,
                    school_name: item.account.school_name,
                    local_email: item.local.email,
                    local_username: item.local.username,
                    resent: item.resent,
                    user_email: item.local.email ? item.local.email : item.local.username,
                    local: {
                        email: item.local.email
                    },
                    verified: item.verified,
                    permission: this.getPermissionName(item.account._profile_id),
                    account: item.account
                });
            }

            this.dataSource = new MatTableDataSource(this.users);
            this.loading = false;
        }, (err) => {
            this.loading = false;
            console.log(err);
        });
    }

    getPermissionName(id): string {
        const permission = PermissionProfiles.find((item) => {
            return item.id === id;
        });

        if (permission) {
            return permission.name;
        } else {
            return 'School specific profile';
        }
    }

    onSortData(sort) {
        const sortObj = {};
        sortObj[sort.active] = sort.direction;
        this.searchForm.sort = sortObj;
        this.loadUsers('SEARCH');
    }

    handlePage(e: any): void {
        this.currentPage = e.pageIndex;

        this.loadUsers();
    }

    onAdd(): void {
        const dialogRef = this.matDialog.open(UserFormDlgComponent, {
            width: '500px',
            data: {
                action: FormType.NEW
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadUsers();
            }
        });
    }

    onEdit(item): void {
        const dialogRef = this.matDialog.open(UserFormDlgComponent, {
            width: '500px',
            data: {
                action: FormType.EDIT,
                data: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadUsers();
            }
        });
    }

    onDelete(id): void {
        let confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
            width: '400px',
            disableClose: false
        });

        confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?<br/><br/>By deleting a user they will be removed from the system and will no longer have access.'
         + 'You can re invite deleted users to the system if required';

        confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;
                this.htcService.delete('user', id).subscribe((res) => {
                    this.loading = false;
                    this.loadUsers();
                }, (err) => {
                    this.loading = false;
                    console.log(err);
                });
            }
            confirmDialogRef = null;
        });
    }

    onResend(item) {
        item.resent = true;
        this.htcService.post('user/verify_resend', { id: item.id }).subscribe();
        setTimeout(() => {
            item.resent = false;
        }, 5000);
    }

    onNameClear() {
        this.router.navigate(['/dashboard/user']);
    }
	
    onUserVerify(item): void {
        if (!item.verified) {
            this.loading = true;
            item.verified = true;
            this.htcService.update('user/verify', item._id, item).subscribe((result) => {
                this.alertService.openSnackBar('User verified successfully.', 'success', 3000);
                this.loading = false;
            }, () => {
                this.alertService.openSnackBar('Error occured while verify this user.', 'error', 3000);
                item.verified = false;
                this.loading = false;
            });
        }
    }
}
