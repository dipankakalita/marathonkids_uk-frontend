import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { HttpCommonService, AuthService, YearService } from 'src/app/core/services';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SharedDataService } from 'src/app/core/services/shared_data.service';
import * as Utils from 'src/app/core/helpers/utils';
import { config } from 'src/app/config';

@Component({
    selector: 'app-dashboard-certificate',
    templateUrl: './certificate-list.component.html',
    styleUrls: ['./certificate-list.component.scss']
})
export class CertificateListComponent implements OnInit, OnDestroy {

    curValidYear;
    curAccount;
    certificates = [];
    @ViewChild('paginator', {}) paginator;

    totalCount = 0;
    pageSize = 10;
    currentPage = 1;

    searchForm = {
        printStatus: false,
        filter: '',
        sort: {
            runner_name: {
                direction: '',
                order: 0
            },
            form_name: {
                direction: '',
                order: 0
            },
            distance: {
                direction: '',
                order: 0
            }
        }
    };

    sortPriority = 0;

    private modelChanged: Subject<string> = new Subject<string>();
    private subscription: Subscription;
    debounceTime = 600;

    loading = false;

    constructor(
        private htcService: HttpCommonService,
        private yearService: YearService,
        public matDialog: MatDialog,
        private sharedDataService: SharedDataService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.curAccount = this.authService.getCurrentAccount();
        this.loading = true;
        this.yearService.getYears().subscribe((years) => {
            if (years) {
                this.curValidYear = years.find((item) => item._id === this.curAccount._valid_for);
                this.loading = false;
                this.loadCertificate();
            }
        }, () => {
            this.loading = false;
        });

        this.subscription = this.modelChanged
            .pipe(
                debounceTime(this.debounceTime),
            )
            .subscribe(() => {
                this.loadCertificate('SEARCH');
            });
    }

    filterChanged() {
        this.modelChanged.next();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadCertificate(type = null) {
        this.loading = true;

        if (type === 'SEARCH') {
            this.currentPage = 1;
            this.paginator.pageIndex = 1;
        }

        const options: any = {
            limit: this.pageSize,
            skip: (this.currentPage - 1) * this.pageSize,
            where: {
                deleted: false,
                created_at: {
                    $gt: this.curValidYear.start_date
                }
            }
        };

        if (this.searchForm.filter && this.searchForm.filter !== '') {
            options.filter = this.searchForm.filter;
        }

        const sortOption = Utils.getMultiSortOption(this.searchForm.sort);
        if (sortOption) {
            options.by = sortOption;
        }

        options.where.printed = this.searchForm.printStatus;

        this.htcService.post('certificate/search', options).subscribe((result) => {
            this.totalCount = result.total;
            this.certificates = result.data;

            this.loading = false;
        }, (err) => {
            this.loading = false;
            console.log(err);
        });
    }

    onPrint(item) {
        event.preventDefault();
        this.sharedDataService.certClear();
        const data = {
            type: 'SINGLE',
            certificate: {
                _id: item._id,
                runner_name: item.runner_name,
                distance: (item.distance / 1000).toFixed(1),
                date: new Date()
            },
            filter: {
                where: {
                    printed: this.searchForm.printStatus
                }
            }
        };

        this.sharedDataService.setCertToken(data);
        window.open(`${config.CLIENT_URL}/dashboard/print-custom-certificate`, '_blank');
    }

    onPrintAll(event) {
		let thisObj = this;
		this.syncCertificates();
        event.preventDefault();
        this.sharedDataService.certClear();
        const sortBy = Utils.getMultiSortOption(this.searchForm.sort);
		setTimeout(function(){
			const data = {
				type: 'MULTIPLE',
				filter: {
					limit: 1000,
					by: sortBy,
					where: {
						deleted: false,
						created_at: {
							$gt: thisObj.curValidYear.start_date
						},
						printed: thisObj.searchForm.printStatus
					},
					filter: thisObj.searchForm.filter
				}
			};

			thisObj.sharedDataService.setCertToken(data);
			window.open(`${config.CLIENT_URL}/dashboard/print-custom-certificate`, '_blank');
		}, 8000);
    }

    onPrintCurrentAll(event) {
		let thisObj = this;
		this.syncCertificates();
        event.preventDefault();
		this.sharedDataService.certClear();
		setTimeout(function(){
			const data = {
				type: 'MULTIPLE',
				filter: {
					limit: 1000,
					where: {
						deleted: false,
						
						created_at: {
							$gt: thisObj.curValidYear.start_date
						},
						printed: thisObj.searchForm.printStatus
					},
					filter: thisObj.searchForm.filter,
				}
			};
			
			thisObj.sharedDataService.setCertToken(data);
			window.open(`${config.CLIENT_URL}/dashboard/print-custom-certificate`, '_blank');
		}, 8000);
    }

    onFilterPrint() {
        this.loadCertificate('SEARCH');
    }

    onSort(direction, field) {
        this.sortPriority++;
        this.searchForm.sort[field].direction = direction;
        this.searchForm.sort[field].order = this.sortPriority;

        this.loadCertificate('SEARCH');
    }

    handlePage(e: any): void {
        this.currentPage = e.pageIndex;

        this.loadCertificate();
    }
	
    syncCertificates() {
        this.loading = true;
		this.htcService.post('certificate/syncCertificates', {
			where : {
				deleted: false,
				_academic_year_id: this.curValidYear._id,
				_account_id : this.curAccount._id,
			}
		}).subscribe(async(result) => {
            this.loading = false;
			console.log('Certicates sync done');
		});
	}
}
