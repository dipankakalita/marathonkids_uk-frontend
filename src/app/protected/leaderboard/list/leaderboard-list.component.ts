import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AlertService,HttpCommonService, HttpService,AuthService } from 'src/app/core/services';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormType } from 'src/app/core/enums';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { config } from 'src/app/config';
import * as Utils from 'src/app/core/helpers/utils';

@Component({
    selector: 'app-dashboard-leaderboard',
    templateUrl: './leaderboard-list.component.html',
    styleUrls: ['./leaderboard-list.component.scss']
})
export class LeaderboardListComponent implements OnInit {

    curYearId;
    isMainAdmin = false;
    accountType;
    curAccount;
	sortField = '';
	sortDirection = '';
    leaderboards = [];
    displayedColumns: string[] = ['no', 'school_name', 'avg_per_runner', 'total_distance', 'participation'];
    dataSource: MatTableDataSource<any>;
	
	@ViewChild('paginator', {}) paginator;

    loading = false;

    totalCount = 0;
    pageSize = 10;
    currentPage = 1;
	
	searchForm: any = {
        filter: '',
        sort: {
            name: {
                direction: 'asc',
                order: 0
            },
            total_distance: {
                direction: '',
                order: 0
            },
            participation: {
                direction: '',
                order: 0
            },
            average_per_runner: {
                direction: '',
                order: 0
            },
			firstrunsession:{
				direction: '',
                order: 0
			},
			_total_monthly_attendance:{
				direction: '',
                order: 0
			},
			_total_fortnightly_attendance:{
				direction: '',
                order: 0
			},
			_total_weekly_attendance:{
				direction: '',
                order: 0
			}
        },
    };
	
	private modelChanged: Subject<string> = new Subject<string>();
    private subscription: Subscription;
    debounceTime = 600;

    sortPriority = 0;
	
    constructor(
        private htcService: HttpCommonService,
		private http: HttpService,
        public matDialog: MatDialog,
        private authService: AuthService,
		private alertService: AlertService,
		private router: Router,
    ) {
		this.isMainAdmin = this.authService.isMainAdmin();
        this.accountType = this.authService.getAccountType();
        this.curAccount = this.authService.getCurrentAccount();
    }
	
    ngOnInit() {
        this.curYearId = this.curAccount._valid_for;
        
		if (this.curYearId) {
            this.loadLeaderboard();
        }
		this.subscription = this.modelChanged
            .pipe(
                debounceTime(this.debounceTime),
            )
            .subscribe(() => {
                this.loadLeaderboard('SEARCH');
            });
    }
	
	filterChanged() {
        this.modelChanged.next();
    }

    syncLeaderboardData() {
        this.loading = true;
		if(this.accountType =='Parks'){
			this.htcService.post('parkLeaderboard/syncLeaderboardForPark', {}).subscribe(async(result) => {
				console.log('sync done');
			});
            this.loading = false;
			this.loadLeaderboard();
		}
	}
	
    loadLeaderboard(type = null) {
        this.loading = true;
        this.leaderboards = [];
		
		if (type === 'SEARCH') {
            this.currentPage = 1;
            this.paginator.pageIndex = 1;
        }
		
		var curYearId = this.curYearId;
		var API_URL = 'leaderboard/getAll';
		if(this.accountType =='Parks'){
			const options: any = {
				limit: this.pageSize,
				skip: (this.currentPage - 1) * this.pageSize,
				where : { deleted : false }
			};
			const sortOption = Utils.getMultiSortOption(this.searchForm.sort);
			if (sortOption) {
				options.by = sortOption;
			}
			if (this.searchForm.filter && this.searchForm.filter !== '') {
				options.filter = this.searchForm.filter;
			}
			
			var API_URL = 'parkLeaderboard/leaderboardListForPark';
			
			this.htcService.post(API_URL,options).subscribe(async (result) => {
				var position = 1;
				for (const lb of result.data) {
					this.leaderboards.push({
						_account_id: '',
						account_name: lb.name,
						position: position,
						average_per_runner: (lb.average_per_runner / 1000).toFixed(1) + ' km',
						total_distance: (lb.total_distance / 1000).toFixed(1) + ' km',
						participation: lb.participation + ' %',
						_total_monthly_attendance: lb._total_monthly_attendance + ' %',
						_total_fortnightly_attendance: lb._total_fortnightly_attendance + ' %',
						_total_weekly_attendance: lb._total_weekly_attendance + ' %',
						firstrunsession: lb.firstrunsession
					});
					position++;
				}
				this.totalCount = result.total;
				this.dataSource = new MatTableDataSource(this.leaderboards);
				this.loading = false;
			}, (err) => {
				this.loading = false;
				console.log(err);
			});
		}else{
			var limit = this.pageSize; 
			var skip = (this.currentPage - 1) * this.pageSize;
			var sortBy = this.sortField;
			var sortOrder = this.sortDirection;
			var search = this.searchForm.filter
			
			this.htcService.get(API_URL+'?limit='+limit+'&skip='+skip+'&sortBy='+sortBy+'&sortOrder='+sortOrder+'&search='+search).subscribe((result) => {
				for (const lb of result.data) {
					this.leaderboards.push({
						_account_id: lb._account_id,
						account_name: lb.account_name,
						position: lb.position,
						average_per_runner: (lb.average_per_runner / 1000).toFixed(1) + ' km',
						total_distance: Math.round(lb.total_distance / 1000) + ' km',
						participation: Math.round(lb.participation * 100) / 100 + ' %'
					});
				}
				this.totalCount = result.total;
				this.dataSource = new MatTableDataSource(this.leaderboards);
				this.loading = false;
			}, (err) => {
				this.loading = false;
				console.log(err);
			});
		}
    }
	
	onSortData(direction, field) {
		this.sortField = field;
		this.sortDirection = direction;
		
        this.sortPriority++;
        this.searchForm.sort[field].direction = direction;
        this.searchForm.sort[field].order = this.sortPriority;
        this.loadLeaderboard('SEARCH');
    }
	
	handlePage(e: any): void {
        this.currentPage = e.pageIndex;
        this.loadLeaderboard();
    }
}

