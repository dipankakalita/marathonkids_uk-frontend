import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { HttpCommonService } from 'src/app/core/services';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CourseFormDlgComponent } from '../form/course-form-dialog.component';
import { FormType } from 'src/app/core/enums';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-dashboard-course',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit, OnDestroy {

    courses = [];
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
        this.loadCourse();

        this.subscription = this.modelChanged
            .pipe(
                debounceTime(this.debounceTime),
            )
            .subscribe(() => {
                this.loadCourse('SEARCH');
            });
    }

    filterChanged() {
        this.modelChanged.next();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadCourse(type = null) {
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
            options.filter = this.searchForm.filter;
        }

        this.htcService.post('course/search', options).subscribe((result) => {
            this.totalCount = result.total;
            this.courses = result.data;

            this.dataSource = new MatTableDataSource(this.courses);
            this.loading = false;
        }, (err) => {
            this.loading = false;
            console.log(err);
        });
    }

    onSortData(sort) {
        this.searchForm.sort = sort.direction;
        this.loadCourse('SEARCH');
    }

    handlePage(e: any): void {
        this.currentPage = e.pageIndex;

        this.loadCourse();
    }

    onAdd(): void {
        const dialogRef = this.matDialog.open(CourseFormDlgComponent, {
            width: '500px',
            data: {
                action: FormType.NEW
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadCourse();
            }
        });
    }

    onEdit(item): void {
        let confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
            disableClose: false,
            maxWidth: '400px'
        });

        confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to edit?<br/><br/>This will cause a change in all distances run on this course which will effect your overall '
            + 'statistics and the total distance run.';
        confirmDialogRef.componentInstance.title = 'Important';
        
        confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                const dialogRef = this.matDialog.open(CourseFormDlgComponent, {
                    width: '500px',
                    data: {
                        action: FormType.EDIT,
                        data: item
                    }
                });
        
                dialogRef.afterClosed().subscribe(result => {
                    if (result && result.success) {
                        this.loadCourse();
                    }
                });
            }

            confirmDialogRef = null;
        });
    }

    onDelete(id): void {
        let confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
            disableClose: false,
            maxWidth: '400px'
        });

        confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?<br/><br/>This will cause you to lose all distance run on this course which will effect your overall '
        + 'statistics and the total distance run.';

        confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;
                this.htcService.delete('course', id).subscribe((res) => {
                    this.loading = false;
                    this.loadCourse();
                }, (err) => {
                    this.loading = false;
                    console.log(err);
                });
            }
            confirmDialogRef = null;
        });
    }
}
