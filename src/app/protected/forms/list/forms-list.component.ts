import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { HttpCommonService, AuthService } from 'src/app/core/services';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormsAddDlgComponent } from '../add/forms-add-dialog.component';
import { FormType } from 'src/app/core/enums';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-dashboard-forms',
    templateUrl: './forms-list.component.html',
    styleUrls: ['./forms-list.component.scss']
})
export class FormsListComponent implements OnInit, OnDestroy {

    curAccount;
    forms = [];
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
        public matDialog: MatDialog,
        private authService: AuthService
    ) {
        this.curAccount = authService.getCurrentAccount();
    }

    ngOnInit() {
        this.loadForms();

        this.subscription = this.modelChanged
            .pipe(
                debounceTime(this.debounceTime),
            )
            .subscribe(() => {
                this.loadForms('SEARCH');
            });
    }

    filterChanged() {
        this.modelChanged.next();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadForms(type = null) {
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
                deleted: false,
                _academic_year_id: this.curAccount._valid_for
            }
        };

        if (this.searchForm.filter && this.searchForm.filter !== '') {
            options.filter = this.searchForm.filter;
        }

        this.htcService.post('form/search', options).subscribe((result) => {
            this.totalCount = result.total;
            this.forms = result.data;

            this.dataSource = new MatTableDataSource(this.forms);
            this.loading = false;
        }, (err) => {
            this.loading = false;
            console.log(err);
        });
    }

    onSortData(sort) {
        this.searchForm.sort = sort.direction;
        this.loadForms('SEARCH');
    }

    handlePage(e: any): void {
        this.currentPage = e.pageIndex;

        this.loadForms();
    }

    onAdd(): void {
        const dialogRef = this.matDialog.open(FormsAddDlgComponent, {
            width: '500px',
            data: {
                action: FormType.NEW
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadForms();
            }
        });
    }

    onEdit(item): void {
        const dialogRef = this.matDialog.open(FormsAddDlgComponent, {
            width: '500px',
            data: {
                action: FormType.EDIT,
                data: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadForms();
            }
        });
    }

    onDelete(id): void {

        let confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
            disableClose: false
            // , width: '300px'
        });

        confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete? <br /><br />' +
            'This will also affect the<br />' +
            'uploaded runs of runners<br />' + 'belonging to this reg group.';

        confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;
                this.htcService.delete('form', id).subscribe((res) => {
                    this.loading = false;
                    this.loadForms();
                }, (err) => {
                    this.loading = false;
                    console.log(err);
                });
            }
            confirmDialogRef = null;
        });
    }
}
