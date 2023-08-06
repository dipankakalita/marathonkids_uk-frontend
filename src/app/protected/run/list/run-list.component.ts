import * as _ from 'lodash';

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { HttpCommonService, AuthService, AlertService, YearService } from 'src/app/core/services';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RunFormDlgComponent } from '../form/run-form-dialog.component';
import { FormType } from 'src/app/core/enums';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard-run',
    templateUrl: './run-list.component.html',
    styleUrls: ['./run-list.component.scss']
})
export class RunListComponent implements OnInit, OnDestroy {

    runs = [];
    displayedColumns: string[] = ['start_date', 'name', 'total_distance', 'action'];
    dataSource: MatTableDataSource<any>;
    @ViewChild('paginator', {}) paginator;

    curAccount;
    curUser;
    validYear;
    totalCount = 0;
    pageSize = 10;
    currentPage = 1;

    searchForm: any = {
        filter: '',
        sort: {
            start_date: 'desc'
        },
    };

    private modelChanged: Subject<string> = new Subject<string>();
    private subscription: Subscription;
    debounceTime = 600;

    loading = false;

    constructor(
        private htcService: HttpCommonService,
        private yearService: YearService,
        public matDialog: MatDialog,
        public authService: AuthService,
        private alertService: AlertService,
        private _router: Router
    ) {
        this.curAccount = this.authService.getCurrentAccount();
        this.curUser = this.authService.getCurrentUser();
    }
 
    ngOnInit() {
        this.loading = true;
        this.yearService.getYears().subscribe((years) => {
            if (years) {
                this.validYear = years.find((item) => item._id === this.curAccount._valid_for);
                if (this.validYear) {
                    this.loadRuns();
                }
            }
        }, (err) => {
            this.loading = false;
            console.log(err);
        });

        this.subscription = this.modelChanged
            .pipe(
                debounceTime(this.debounceTime),
            )
            .subscribe(() => {
                this.loadRuns('SEARCH');
            }); 
		this.syncSessionDTS(false);
    }

    filterChanged() {
        this.modelChanged.next();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadRuns(type = null) {
        this.loading = true;

        if (type === 'SEARCH') {
            this.currentPage = 1;
            this.paginator.pageIndex = 1;
        }

        let options: any = {
            limit: this.pageSize,
            skip: (this.currentPage - 1) * this.pageSize,
            by: this.searchForm.sort,
            populate: ['_course_id'],
            where: {
                deleted: false,
                start_date: {
                    $gt: this.validYear.start_date
                }
            }
        };

        if (this.searchForm.filter && this.searchForm.filter !== '') {
            options.filter = this.searchForm.filter;
        }

        this.htcService.post('event/search', options).subscribe(async (result) => {
            this.totalCount = _.get(result, 'total', 0);
            // let tmpArr = [];

            if (result.count > 0) {
                const events = result.data;
                const formIds = [];

                for (const el of events) {
                    for (const formId of el.forms) {
                        formIds.push(formId);
                    }
                }

                if (formIds.length > 0) {
                    options = {
                        where: {
                            _id: {
                                $in: formIds
                            }
                        },
                    };

                    let formList = await this.htcService.post('form/search', options).toPromise()
                        .catch(() => {
                            this.alertService.openSnackBar('Error occured while get form information', 'error');
                        });

                    if (formList && formList.count > 0) {
                        let tmpArr: any = {};
                        for (const formItem of formList.data) {
                            tmpArr[formItem._id] = formItem;
                        }

                        formList = tmpArr;

                        for (const el of events) {
                            el.name_field = el.name + ' - ' + _.get(el, '_course_id.name', '')
                                + ', Reg Group(';

                            for (const formId of el.forms) {
                                el.name_field += (formList[formId]?.name) + ',';
                            }

                            el.name_field = el.name_field.replace(/,\s*$/, '');
                            el.name_field +=  ')';
                        }

                        this.runs = events;

                        this.dataSource = new MatTableDataSource(this.runs);
                    }
                } else {
                    let tmpArr: any = {};
                    tmpArr = result.data;

                    for (const el of tmpArr) {
                        el.name_field = el.name + ' - ' + _.get(el, '_course_id.name', '');
                    }

                    this.runs = tmpArr;

                    this.dataSource = new MatTableDataSource(this.runs);
                }
            }

            this.loading = false;
        }, (err) => {
            this.loading = false;
            console.log(err);
        });
    }

    onSortData(sort) {
        const sortObj = {};
        sortObj[sort.active] = sort.direction;
        this.searchForm.sort = sortObj;
        this.loadRuns('SEARCH');
    }

    handlePage(e: any): void {
        this.currentPage = e.pageIndex;

        this.loadRuns();
    }

    onAdd(): void {
        const dialogRef = this.matDialog.open(RunFormDlgComponent, {
            width: '500px',
            data: {
                action: FormType.NEW
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                console.log(result);
                this._router.navigate(['/dashboard/run/', result.data._id]);
            }
        });
    }

    onEdit(item): void {
        const dialogRef = this.matDialog.open(RunFormDlgComponent, {
            width: '500px',
            data: {
                action: FormType.EDIT,
                data: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadRuns();
            }
        });
    }

    onDelete(id): void {
        let confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
            maxWidth: '400px',
            disableClose: false
            // , width: '300px'
        });

        confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?<br/><br/>This will cause you to lose all data connected to any children within this run.';

        confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;
                this.htcService.delete('event', id).subscribe(() => {
                    this.loading = false;
                    this.loadRuns();
                }, (err) => {
                    this.loading = false;
                    this.alertService.openSnackBar('Error occured while delete event.', 'error');
                    console.log(err);
                });
            }
            confirmDialogRef = null;
        });
    }
	
    syncSessionDTS(status: Boolean) {
		this.loading = true;
		this.htcService.post('runner/syncSessionDTS', {
			where : {
				deleted: false,
				_academic_year_id: this.validYear._id,
				_account_id : this.curAccount._id,
                start_date: {
                    $gt: this.validYear.start_date
                }
			}
		}).subscribe(async(result) => { 
			console.log('Session sync done');
			this.syncRunnersDTS(status);
		});
	}
	
	syncRunnersDTS(status: Boolean) { 
		this.loading = false;
		this.htcService.post('runner/syncRunnersDTS', {
			where : {
				deleted: false,
				_academic_year_id: this.validYear._id,
				_account_id : this.curAccount._id,
                start_date: {
                    $gt: this.validYear.start_date
                }
			}
		}).subscribe(async(result) => {
			if(status==true)
				this.loadRuns();
				// window.location.reload();
			else{
				this.loadRuns();
				this.loading = false;
			}
		});
	}
}
