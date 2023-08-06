import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { HttpCommonService, AuthService } from 'src/app/core/services';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as Utils from 'src/app/core/helpers/utils';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import * as _ from 'lodash';
@Component({
    selector: 'app-dashboard-parent',
    templateUrl: './parent-list.component.html',
    styleUrls: ['./parent-list.component.scss']
})
export class ParentListComponent implements OnInit, OnDestroy {

    accountType;
    isMainAdmin = false;
    curAccount;
    curYearId;
	
    parents = [];
    @ViewChild('paginator', {}) paginator;

    totalCount = 0;
    pageSize = 10;
    currentPage = 1;

    searchForm: any = {
        filter: '',
        sort: {
            name: {
                direction: '',
                order: 0
            },
            'local.email': {
                direction: '',
                order: 0
            },
			'_town_name':{
				direction: '',
                order: 0
			},
			'_county_name':{
				direction: '',
                order: 0
			},
			school_count:{
				direction: '',
                order: 0
			},
			eventcount: {
                direction: '',
                order: 0
            },
			volunteercount: {
                direction: '',
                order: 0
            },
			lastrunsession: {
                direction: '',
                order: 0
            },
            telephone: {
                direction: '',
                order: 0
            },
            marketing: {
                direction: '',
                order: 0
            },
            contact_allowed: {
                direction: '',
                order: 0
            }
        }
    };
	filterEvent;
	filterEventName;
    sortPriority = 0;

    private modelChanged: Subject<string> = new Subject<string>();
    private subscription: Subscription;
    debounceTime = 600;

    loading = false;

    constructor(
        private htcService: HttpCommonService,
        private authService: AuthService,
		private actRoute: ActivatedRoute,
        private router: Router,
        public matDialog: MatDialog
    ) {
        this.isMainAdmin = this.authService.isMainAdmin();
        this.accountType = this.authService.getAccountType();
        this.curAccount = this.authService.getCurrentAccount();
    }

    ngOnInit() {
		this.actRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
            this.filterEvent = paramMap.get('eventId');
            this.filterEventName = paramMap.get('name');
            this.curYearId = this.curAccount._valid_for;
			if (this.curYearId) {
				this.loadParent();
			}
        });
        
        this.subscription = this.modelChanged
            .pipe(
                debounceTime(this.debounceTime),
            )
            .subscribe(() => {
                this.loadParent('SEARCH');
            });
    }
	
	saveParentInfo() {
        this.loading = true;
		if(this.accountType =='Parks'){
			var curYearId = this.curYearId;
			this.htcService.post('parent/saveEventData', {
				verified: false,
				_academic_year_id: curYearId
			}).subscribe(async(result) => {
				console.log('sync done');
				 this.loading = false;
				 this.loadParent();
			});
		}
	}
	
    filterChanged() {
        this.modelChanged.next();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadParent(type = null) {
        this.loading = true;

        if (type === 'SEARCH') {
            this.currentPage = 1;
            this.paginator.pageIndex = 1;
        }

        const options: any = {
            limit: this.pageSize,
            skip: (this.currentPage - 1) * this.pageSize,
            populate: [
                '_town_id', '_county_id', 'account._id'
            ],
            where: {
                deleted: false
            }
        };
		var url = 'parent/search';
		var curYearId = this.curYearId;
		if(this.accountType =='Parks')
		{
			url = 'parent/searchparents';
			
		}
		if (this.filterEvent) {
			var url = 'parent/searchbyevent';
            _.set(options, ['where', `_event_id`], this.filterEvent);
			_.set(options, ['where', `_academic_year_id`], curYearId);
			_.set(options, ['where', `verified`], false);
        }
        if (this.searchForm.filter && this.searchForm.filter !== '') {
            options.filter = this.searchForm.filter;
        }

        const sortOption = Utils.getMultiSortOption(this.searchForm.sort);
        if (sortOption) {
            options.by = sortOption;
        }
 
		var api_call = this.htcService;
        this.htcService.post(url, options).subscribe( async (result) => {
            this.totalCount = result.total; 
			this.parents = result.data;
            this.loading = false;
        }, (err) => {
            this.loading = false;
            console.log(err);
        });
		
    }

    onSort(direction, field) {
        this.sortPriority++;
        this.searchForm.sort[field].direction = direction;
        this.searchForm.sort[field].order = this.sortPriority;

        this.loadParent('SEARCH');
    }
	
    handlePage(e: any): void {
        this.currentPage = e.pageIndex;

        this.loadParent();
    }
	onNameClear() {
        this.router.navigate(['/dashboard/parent']);
    }
}
