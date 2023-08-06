import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AlertService,HttpCommonService, HttpService,AuthService } from 'src/app/core/services';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ParkEventFormComponent } from '../park-event-form/park-event-form.component';
import { FormType } from 'src/app/core/enums';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { config } from 'src/app/config';
import * as Utils from 'src/app/core/helpers/utils';

@Component({
  selector: 'app-park-event',
  templateUrl: './park-event.component.html',
  styleUrls: ['./park-event.component.scss']
})
export class ParkEventComponent implements OnInit, OnDestroy {

    events = [];
    // displayedColumns: string[] = ['start_date', 'name', 'total_distance', 'action'];
    displayedColumns: string[] = ['start_date', 'name', 'action'];
    dataSource: MatTableDataSource<any>;
    @ViewChild('paginator', {}) paginator;
	accountType;
	isMainAdmin = false;
    curAccount;
    curYearId;
    totalCount = 0;
	totalrunner = 0;
	totalactive = 0;
    pageSize = 10;
    currentPage = 1;

    searchForm: any = {
        filter: '',
        sort: {
            name: {
                direction: 'asc',
                order: 0
            },
            runnercount: {
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
            parentcount: {
                direction: '',
                order: 0
            },
            _park_name: {
                direction: '',
                order: 0
            },
			_county_name :{
				direction: '',
                order: 0
			},
			_town_name:{
				direction: '',
                order: 0
			},
            start_date: {
                direction: '',
                order: 0
            },
            end_date: {
                direction: '',
                order: 0
            },
			deleted :{
				direction: '',
                order: 0
			}
        },
    };

    private modelChanged: Subject<string> = new Subject<string>();
    private subscription: Subscription;
    debounceTime = 600;

    sortPriority = 0;
    loading = false;

    constructor(
        private htcService: HttpCommonService,
        private http: HttpService,
        public matDialog: MatDialog,
		private router: Router,
		private authService: AuthService,
		private alertService: AlertService
    ) {
		this.isMainAdmin = this.authService.isMainAdmin();
        this.accountType = this.authService.getAccountType();
		
        this.curAccount = this.authService.getCurrentAccount();
    }
	
    ngOnInit() {
		this.curYearId = this.curAccount._valid_for;
		if (this.curYearId) {
            this.loadEvents();
        }
        
        this.subscription = this.modelChanged
            .pipe(
                debounceTime(this.debounceTime),
            )
            .subscribe(() => {
                this.loadEvents('SEARCH');
            });
    }

    filterChanged() {
        this.modelChanged.next();
    }

    syncEventData() {
        this.loading = true;
		if(this.accountType =='Parks'){
			var curYearId = this.curYearId;
			this.htcService.post('parkEvent/saveEventData', {
				verified: false,
				_academic_year_id: curYearId
			}).subscribe(async(result) => {
				console.log('sync done');
			});
            this.loading = false;
			this.loadEvents();
		}
	}
	
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadEvents(type = null) {
        this.loading = true;
		
		
        if (type === 'SEARCH') {
            this.currentPage = 1;
            this.paginator.pageIndex = 1;
        }
		
        const options: any = {
            limit: this.pageSize,
            skip: (this.currentPage - 1) * this.pageSize,
            where: {
                deleted: false
            }
        };
		
		const optionsactive: any = {
            // where: {
                // end_date : {
					// $gt : new Date()
				// }
            // }
			where: {
                deleted : false
            }
        };
        const sortOption = Utils.getMultiSortOption(this.searchForm.sort);
        if (sortOption) {
            options.by = sortOption;
        }

		var curYearId = this.curYearId;
        if (this.searchForm.filter && this.searchForm.filter !== '') {
            options.filter = this.searchForm.filter;
        }

		var API_URL = 'parkEvent/search';
		if(this.accountType =='Parks'){
			var API_URL = 'parkEvent/geteventsListforpark';
			var API_URL_ActiveEvent = 'parkEvent/getrunnercountforparkevent';
			
			//options.where.runnercount = { $ne : '0' };
			//optionsactive.where.runnercount = { $ne : '0' };
		}
		
		this.htcService.post(API_URL_ActiveEvent, optionsactive).subscribe(async(result) => {
			this.totalrunner = result.data;
		});
		
        this.htcService.post(API_URL, options).subscribe(async(result) => {
			this.totalCount = result.total;
			await result.data.forEach(function(obj, index){
				var where: any = {
					event_id: obj._id,
					verified: false,
					_academic_year_id: curYearId
				};
				
				result.data[index].ticked = true;
				if(new Date(obj.end_date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)){
					result.data[index].ticked = false;
				}
			});
			
            this.events = result.data;
			this.dataSource = new MatTableDataSource(this.events);
            this.loading = false;
        }, (err) => {
            this.loading = false;
            console.log(err);
        });
    }

    onSortData(direction, field) {
        this.sortPriority++;
        this.searchForm.sort[field].direction = direction;
        this.searchForm.sort[field].order = this.sortPriority;
        this.loadEvents('SEARCH');
    }
    
    handlePage(e: any): void {
        this.currentPage = e.pageIndex;
        this.loadEvents();
    }

    onAdd(): void {
        const dialogRef = this.matDialog.open(ParkEventFormComponent, {
            width: '500px',
            data: {
                action: FormType.NEW
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadEvents();
            }
        });
    }

    onEdit(item): void {
        const dialogRef = this.matDialog.open(ParkEventFormComponent, {
            width: '500px',
            data: {
                action: FormType.EDIT,
                data: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadEvents();
            }
        });
    }
	
    parentsList(item) : void{
        this.router.navigate(['/dashboard/parent'],
            { queryParams: { eventId: item._id, name: item.name } });
    
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
                this.htcService.delete('parkEvent', id).subscribe((res) => {
                    this.loading = false;
                    this.loadEvents();
                }, (err) => {
                    this.loading = false;
					this.alertService.openSnackBar('Error occured while Delete Park Event', 'error');
                    console.log(err);
                });
            }
            confirmDialogRef = null;
        });
    }
}
