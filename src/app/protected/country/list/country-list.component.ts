import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { HttpCommonService } from 'src/app/core/services';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CountryFormDlgComponent } from '../form/country-form-dialog.component';
import { FormType } from 'src/app/core/enums';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-dashboard-country',
    templateUrl: './country-list.component.html',
    styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent implements OnInit, OnDestroy {

    countries = [];
    displayedColumns: string[] = ['name', 'action'];
    dataSource: MatTableDataSource<any>;
    @ViewChild('paginator', {}) paginator;

    totalCount = 0;
    pageSize = 10;
    currentPage = 1;

    searchForm = {
        filter: '',
        sort: 'asc',
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
        this.loadCounties();

        this.subscription = this.modelChanged
            .pipe(
                debounceTime(this.debounceTime),
            )
            .subscribe(() => {
                this.loadCounties('SEARCH');
            });
    }

    filterChanged() {
        this.modelChanged.next();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadCounties(type = null) {
        this.loading = true;

        if (type === 'SEARCH') {
            this.currentPage = 1;
            this.paginator.pageIndex = 1;
        }

        const options: any = {
            limit: this.pageSize,
            skip: (this.currentPage - 1) * this.pageSize,
            by: {
                name: this.searchForm.sort
            },
            where: {
                deleted: false
            }
        };

        if (this.searchForm.filter && this.searchForm.filter !== '') {
            options.where.name = {
                cnt: this.searchForm.filter
            };
        }

        this.htcService.post('countries', options).subscribe((result) => {
            this.totalCount = result.total;
            this.countries = result.data;

            this.dataSource = new MatTableDataSource(this.countries);
            this.loading = false;
        }, (err) => {
            this.loading = false;
            console.log(err);
        });
    }

    onSortData(sort) {
        this.searchForm.sort = sort.direction;
        this.loadCounties('SEARCH');
    }

    handlePage(e: any): void {
        this.currentPage = e.pageIndex;

        this.loadCounties();
    }

    onAdd(): void {
        const dialogRef = this.matDialog.open(CountryFormDlgComponent, {
            width: '500px',
            data: {
                action: FormType.NEW
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadCounties();
            }
        });
    }

    onEdit(item): void {
        const dialogRef = this.matDialog.open(CountryFormDlgComponent, {
            width: '500px',
            data: {
                action: FormType.EDIT,
                data: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadCounties();
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
                this.htcService.delete('countries', id).subscribe((res) => {
                    this.loading = false;
                    this.loadCounties();
                }, (err) => {
                    this.loading = false;
                    console.log(err);
                });
            }
            confirmDialogRef = null;
        });
    }
}
