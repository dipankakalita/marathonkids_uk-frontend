import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpCommonService } from 'src/app/core/services';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-dashboard-audit',
    templateUrl: './audit-list.component.html',
    styleUrls: ['./audit-list.component.scss']
})
export class AuditListComponent implements OnInit, OnDestroy {

    audits = [];

    displayedColumns: string[] = ['created_at', '_user_id', 'name', 'ip_address'];
    dataSource: MatTableDataSource<any>;
    @ViewChild('paginator', {}) paginator;

    totalCount = 0;
    pageSize = 10;
    currentPage = 1;

    searchForm: any = {
        filter: '',
        sort: {
            created_at: -1
        },
    };

    private modelChanged: Subject<string> = new Subject<string>();
    private subscription: Subscription;
    debounceTime = 600;

    loading = false;

    constructor(
        private htcService: HttpCommonService
    ) {
    }

    ngOnInit() {
        this.loadAudits();

        this.subscription = this.modelChanged
            .pipe(
                debounceTime(this.debounceTime),
            )
            .subscribe(() => {
                this.loadAudits('SEARCH');
            });
    }

    filterChanged() {
        this.modelChanged.next();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadAudits(type = null) {
        this.loading = true;

        if (type === 'SEARCH') {
            this.currentPage = 1;
            this.paginator.pageIndex = 1;
        }

        const options: any = {
            limit: this.pageSize,
            skip: (this.currentPage - 1) * this.pageSize,
            by: this.searchForm.sort,
            populate: ['_user_id'],
            where: {
                deleted: false
            }
        };

        if (this.searchForm.filter && this.searchForm.filter !== '') {
            options.filter = this.searchForm.filter;
        }

        this.htcService.post('audit/search', options).subscribe((result) => {
            this.totalCount = result.total;
            this.audits = result.data;

            this.dataSource = new MatTableDataSource(this.audits);
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
        this.loadAudits('SEARCH');
    }

    handlePage(e: any): void {
        this.currentPage = e.pageIndex;

        this.loadAudits();
    }
}
