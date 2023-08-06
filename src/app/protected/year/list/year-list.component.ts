import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { HttpCommonService } from 'src/app/core/services';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { YearFormDlgComponent } from '../form/year-form-dialog.component';
import { FormType } from 'src/app/core/enums';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-dashboard-year',
    templateUrl: './year-list.component.html',
    styleUrls: ['./year-list.component.scss']
})
export class YearListComponent implements OnInit, OnDestroy {

    years = [];
    displayedColumns: string[] = ['name', 'region_name', 'action'];
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

    private modelChanged: Subject<string> = new Subject<string>();
    private subscription: Subscription;
    debounceTime = 600;

    loading = false;

    constructor(
        private htcService: HttpCommonService,
        public matDialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.loadYears();

        this.subscription = this.modelChanged
            .pipe(
                debounceTime(this.debounceTime),
            )
            .subscribe(() => {
                this.loadYears('SEARCH');
            });
    }

    filterChanged() {
        this.modelChanged.next();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadYears(type = null) {
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

        if (this.searchForm.filter && this.searchForm.filter !== '') {
            options.filter = this.searchForm.filter;
        }

        this.htcService.post('year/search', options).subscribe((result) => {
            console.log(result);
            this.totalCount = result.total;
            this.years = result.data;

            this.dataSource = new MatTableDataSource(this.years);
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
        this.loadYears('SEARCH');
    }

    handlePage(e: any): void {
        this.currentPage = e.pageIndex;

        this.loadYears();
    }

    onAdd(): void {
        const dialogRef = this.matDialog.open(YearFormDlgComponent, {
            width: '500px',
            data: {
                action: FormType.NEW
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadYears();
            }
        });
    }

    onEdit(item): void {
        const dialogRef = this.matDialog.open(YearFormDlgComponent, {
            width: '500px',
            data: {
                action: FormType.EDIT,
                data: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadYears();
            }
        });
    }

    onDelete(id): void {
        let confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
            disableClose: false
            // , width: '300px'
        });

        confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;
                this.htcService.delete('year', id).subscribe((res) => {
                    this.loading = false;
                    this.loadYears();
                }, (err) => {
                    this.loading = false;
                    console.log(err);
                });
            }
            confirmDialogRef = null;
        });
    }
}
