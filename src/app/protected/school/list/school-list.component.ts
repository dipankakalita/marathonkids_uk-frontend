import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IntroductionOptions } from 'src/app/core/enums';

import { HttpCommonService, AlertService } from 'src/app/core/services';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SchoolFormDlgComponent } from '../form/school-form-dialog.component';
import { FormType } from 'src/app/core/enums';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import * as Utils from 'src/app/core/helpers/utils';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SharedDataService } from 'src/app/core/services/shared_data.service';

declare let $;

@Component({
    selector: 'app-dashboard-school',
    templateUrl: './school-list.component.html',
    styleUrls: ['./school-list.component.scss']
})

export class SchoolListComponent implements OnInit, OnDestroy {

    introOptions = IntroductionOptions;
    schools = [];
    lastYearIds = ['59a5e5dc786614e65ababf06', '5c5c36532f3edb2cec75e5fc', '5c5c36532f3edb2cec75e5fd'];
    curYearIds = ["5f4454701ed6fe129525d0d6", "5f4454a21ed6fe129525d0dd", "5f4454ab1ed6fe129525d0de"];
    @ViewChild('paginator', {}) paginator;

    totalCount = 0;
    pageSize = 10;
    currentPage = 1;

    searchForm: any = {
        filter: '',
        school: 0,
        sort: {
            school_name: {
                direction: '',
                order: 0
            },
            "statistics.number_of_runners": {
                direction: '',
                order: 0
            },
            last_login: {
                direction: '',
                order: 0
            },
            last_session_run: {
                direction: '',
                order: 0
            },
            _valid_for_date: {
                direction: '',
                order: 0
            },
            email_confirmed: {
                direction: '',
                order: 0
            },
            active: {
                direction: '',
                order: 0
            },
            reregistered: {
                direction: '',
                order: 0
            }
        }
    };

    sortPriority = 0;

    private modelChanged: Subject<string> = new Subject<string>();
    private subscription: Subscription;
    debounceTime = 600;

    schoolsActive = 0;
    schoolsWithRunner = 0;
    schoolsReRegistered = 0;

    loading = false;
    loadingInfo = false;

    constructor(
        private htcService: HttpCommonService,
        public matDialog: MatDialog,
        private alertService: AlertService,
        private router: Router,
        private sharedDataService: SharedDataService
    ) {
    }

    ngOnInit() {
        const filterStored = this.sharedDataService.getSchoolFilter();
        if (filterStored) {
            this.searchForm = filterStored.searchForm;
            this.currentPage = filterStored.cur_page;
        }

        this.loadSchool();

        this.subscription = this.modelChanged
            .pipe(
                debounceTime(this.debounceTime),
            )
            .subscribe(() => {
                this.loadSchool('SEARCH');
            });
    }

    filterChanged() {
        this.modelChanged.next();
    }

    onChangeSchool() {
        this.loadSchool('SEARCH');
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadSchool(type = null) {

        this.loading = true;
        this.loadingInfo = true;

        if (type === 'SEARCH') {
            this.currentPage = 1;
            this.paginator.pageIndex = 1;
        }

        let options: any = {
            limit: this.pageSize,
            skip: (this.currentPage - 1) * this.pageSize,
            where: {
                deleted: false
            },
            populate: ['location._town_id'],
        };

        if (this.searchForm.filter && this.searchForm.filter !== '') {
            options.filter = this.searchForm.filter;
        }

        if (this.searchForm.school === 1) {
            options.where.last_session_run = { $gt: moment().subtract(12, 'months').toISOString() };
        } else if (this.searchForm.school === 2) {
            options.where.last_session_run = {
                $not: {
                    $gt: moment().subtract(12, 'months').toISOString()
                }
            };
        }

        const sortOption = Utils.getMultiSortOption(this.searchForm.sort);
        if (sortOption) {
            options.by = sortOption;
        }

        this.sharedDataService.setSchoolFilter({
            searchForm: this.searchForm,
            cur_page: this.currentPage
        });

        this.htcService.post('account/search', options).subscribe((result) => {
            console.log(result.data);
            this.totalCount = result.total;
            this.schools = result.data;

            this.loading = false;
        }, (err) => {
            this.loading = false;
            console.log(err);
        });

        // load schools active

        this.htcService.get('account/get/statistic').subscribe((res) => {
            const data = res.data;
            this.schoolsActive = data.school_active;
            this.schoolsWithRunner = data.school_with_runners;
            this.schoolsReRegistered = data.school_re_registered;
            this.loadingInfo = false;
        }, () => {
            this.loadingInfo = false;
        });
    }

    onSort(direction, field) {
        this.sortPriority++;
        this.searchForm.sort[field].direction = direction;
        this.searchForm.sort[field].order = this.sortPriority;
        this.loadSchool('SEARCH');
    }

    handlePage(e: any): void {
        this.currentPage = e.pageIndex;

        this.loadSchool();
    }

    onAdd(): void {
        const dialogRef = this.matDialog.open(SchoolFormDlgComponent, {
            width: '500px',
            data: {
                action: FormType.NEW
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadSchool();
            }
        });
    }

    onEdit(item): void {
        const dialogRef = this.matDialog.open(SchoolFormDlgComponent, {
            width: '500px',
            data: {
                action: FormType.EDIT,
                data: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadSchool();
            }
        });
    }

    onDelete(id): void {
        let confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
            disableClose: false
        });

        confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;
                const data = { deleted: true };
                this.htcService.update('account', id, data).subscribe((res) => {
                    this.loading = false;
                    this.loadSchool();
                }, (err) => {
                    this.loading = false;
                    console.log(err);
                });
            }
            confirmDialogRef = null;
        });
    }

    onUser(item): void {
        this.router.navigate(['/dashboard/user'],
            { queryParams: { account: item._id, name: item.school_name } });
    }

    onSchoolActive(item): void {
        if (!item.active) {
            this.loading = true;
            item.active = true;
            item.email_confirmed = true;
            this.htcService.update('account/active', item._id, item).subscribe((result) => {
                this.alertService.openSnackBar('School activated successfully.', 'success', 3000);
                this.loading = false;
            }, () => {
                this.alertService.openSnackBar('Error occured while activate school.', 'error', 3000);
                item.active = false;
                this.loading = false;
            });
        }
    }

    onSchoolScannerActive(school): void {
		if(school.school_scanner == true){ school.school_scanner = false; }
		else if(school.school_scanner == false){ school.school_scanner = true; }
		else { school.school_scanner = true; }
		const data = { school_scanner: school.school_scanner };
	
		this.loading = true; 
		this.htcService.update('account', school._id, data).subscribe((res) => {
			this.alertService.openSnackBar('School scanner activated successfully.', 'success', 3000);
			this.loading = false;
			location.reload();
		}, () => {
			this.alertService.openSnackBar('Error occured while activate scanner school.', 'error', 3000);
			this.loading = false;
		});
    }

    getPackageName(school_package): String {
        let introStr = '';
        if (school_package) {
            if (school_package == 1) {
                introStr = "Premium Package";
            } else if (school_package == 2) { 
                introStr = "Basic Package";
            }
        }
        return introStr;
    }
	
    getIntroStr(schoolInfo): String {
        let introStr = '';
        if (schoolInfo) {
            if (schoolInfo.school_introduced_detail) {
                introStr = schoolInfo.school_introduced_detail;
            } else if (schoolInfo.school_introduced) {
                const introItem = this.introOptions.find(item => item.value === schoolInfo.school_introduced);
                if (introItem) {
                    introStr = introItem.label;
                }
            }
        }

        return introStr;
    }
}
