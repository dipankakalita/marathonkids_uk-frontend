import * as _ from 'lodash';

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { HttpCommonService, AlertService, AuthService, YearService  } from 'src/app/core/services';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RunnerFormDlgComponent } from '../form/runner-form-dialog.component';
import { FormType, YearGroups } from 'src/app/core/enums';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { config } from 'src/app/config';

import * as Utils from 'src/app/core/helpers/utils';
import { SharedDataService } from 'src/app/core/services/shared_data.service';
import { CookieService } from 'ngx-cookie-service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
    selector: 'app-dashboard-runner',
    templateUrl: './runner-list.component.html',
    styleUrls: ['./runner-list.component.scss']
})
export class RunnerListComponent implements OnInit, OnDestroy {

    yearGroups = _.keyBy(YearGroups, 'value');
    runners = [];
    @ViewChild('paginator', {}) paginator;
    @ViewChild('importCSV', {}) importCsv;

    accountType;
    isMainAdmin = false;
    curAccount;
    curYearId;
    validYear;
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
            form_name: {
                direction: '',
                order: 0
            },
			year_group:{
				direction: '',
                order: 0
			},
            _total_verified_distance: {
                direction: '',
                order: 0
            }, 
            'data._total_verified_distance': {
                direction: '',
                order: 0
            },
            _participated: {
                direction: '',
                order: 0
            },
            _total_participation: {
                direction: '',
                order: 0
            },
            _total_unverified_distance: {
                direction: '',
                order: 0
            },
            _total_distance: {
                direction: '',
                order: 0
            },
			_event_count:{
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
			},
			'countyInfo.name':{
				direction: '',
                order: 0
			},
			'townsInfo.name':{
				direction: '',
                order: 0
			},
			'schoolData.school_name':{
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
        public matDialog: MatDialog,
        private yearService: YearService,
        private alertService: AlertService,
        private authService: AuthService,
        private sharedDataService: SharedDataService,
        private cookieService: CookieService,
    ) {
        this.isMainAdmin = this.authService.isMainAdmin();
        this.accountType = this.authService.getAccountType();
        this.curAccount = this.authService.getCurrentAccount();
    }

    ngAfterContentInit() {
		if(this.accountType != 'Parks'){
			this.syncSessionDTS(false);
		}
	}
	
    ngOnInit() {
        this.curYearId = this.curAccount._valid_for;
        if (this.curYearId) {
            this.loadRunners();
        }
		
        this.yearService.getYears().subscribe((years) => {
            this.loading = false;
            if (years) {
                this.validYear = years.find((item) => item._id === this.curAccount._valid_for);
            }
        }, (err) => {
            this.loading = false; 
        });

        this.subscription = this.modelChanged
            .pipe(
                debounceTime(this.debounceTime),
            )
            .subscribe(() => {
                this.loadRunners('SEARCH');
            });
		
    }

    saveRunnerInfo() {
        this.loading = true;
		if(this.accountType =='Parks'){
			var curYearId = this.curYearId;
			this.htcService.post('runner/saveRunnerInfo', {
				verified: false,
				_valid_for: curYearId
			}).subscribe(async(result) => {
				console.log('sync done');
			});
            this.loading = false;
			this.loadRunners();
		}
	}
	
    syncRunnersDTS(status: Boolean) { 
		this.htcService.post('runner/syncRunnersDTS', {
			where : {
				deleted: false,
				_academic_year_id: this.curYearId,
				_account_id : this.curAccount._id,
                start_date: {
                    $gt: this.validYear.start_date
                }
			}
		}).subscribe(async(result) => {
			console.log('Runners sync done');
			if(status==true)
				window.location.reload();
			else
				this.loadRunners();
		});
		this.loading = false;
	}
	
    syncSessionDTS(status: Boolean) {
        this.loading = true;
		this.htcService.post('runner/syncSessionDTS', {
			where : {
				deleted: false,
				_academic_year_id: this.curYearId,
				_account_id : this.curAccount._id,
                start_date: {
                    $gt: this.validYear ? this.validYear.start_date : new Date()
                }
			}
		}).subscribe(async(result) => {
			console.log('Session sync done');
			this.syncRunnersDTS(status);
		});
	}
	
    filterChanged() {
        this.modelChanged.next();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadRunners(type = null) {
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
                _valid_for: this.curYearId
            }
        }; 

        if (this.searchForm.filter && this.searchForm.filter !== '') {
            options.filter = this.searchForm.filter;
        }

        const sortOption = Utils.getMultiSortOption(this.searchForm.sort);
        if (sortOption) {
            options.by = sortOption;
        }

		var API_URL = 'runner/search';
		if(this.accountType =='Parks'){
			var API_URL = 'runner/runnerListForPark';
		}
		
		var api_call = this.htcService;
		this.htcService.post(API_URL, options).subscribe( async (result) => {
			this.totalCount = _.get(result, 'total', 0);	
			console.log(result.data);			
			this.runners = result.data;
			this.loading = false;
		}, (err) => {
			this.loading = false;
			console.log(err);
		});
		
    }

    onSort(direction, field) {
		// console.log(field);
		// if(field == "data._total_verified_distance"){
			// field = 'data.'+ this.curYearId + '._total_verified_distance';
			// console.log(field);
			
			// console.log(this.searchForm.sort[field]);
			// this.searchForm.sort[field] = {
				// direction : '',
				// order : 0
			// }
		// }
		// console.log(field);
        this.sortPriority++;
        this.searchForm.sort[field].direction = direction;
        this.searchForm.sort[field].order = this.sortPriority;

        this.loadRunners('SEARCH');
    }

    handlePage(e: any): void {
        this.currentPage = e.pageIndex;
        this.loadRunners();
    }

    onAdd(): void {
        const dialogRef = this.matDialog.open(RunnerFormDlgComponent, {
            width: '500px',
            data: {
                action: FormType.NEW
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadRunners();
            }
        });
    }

    onEdit(item, tabIndex): void {
        const dialogRef = this.matDialog.open(RunnerFormDlgComponent, {
            width: '500px',
            data: {
                action: FormType.EDIT,
                tab_index: tabIndex,
                data: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.success) {
                this.loadRunners();
            }
        });
    }

    onDelete(id): void {
        let confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
            maxWidth: '400px',
            disableClose: false,
        });

        confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?<br /><br />This will cause you to lose any running data already added to the system. You can add the' + 'child back into the system but you will not be able to get their previous distance back.';

        confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;
                this.htcService.delete('runner', id).subscribe((res) => {
                    this.loading = false;
                    this.loadRunners();
                }, (err) => {
                    this.loading = false;
                    console.log(err);
                });
            }
            confirmDialogRef = null;
        });
    }

    onPrintRunner(event) {
        event.preventDefault();
        this.cookieService.deleteAll('/');
        const min = 5555;
        const max = 555555;
        const token = Math.floor(Math.random() * (max - min + 1)) + min;

        const runnerExportDetail = {
            headers: {
                authorization: `bearer ${this.authService.getToken()}`
            },
            params: {
                collection: 'runners',
                page: 'runner',
				currentyear: this.curYearId,
            },
            query: {
                where: {
                    _valid_for: this.curAccount._valid_for,
                    _account_id: this.curAccount._id,
                    deleted: false
                },
                // select: ['name', 'form_name', 'year_group', '_particiapted', '_unparticiapted', '_total_verified_distance'],
            }
        };

        this.cookieService.set(token.toString(), JSON.stringify(runnerExportDetail), 1, '/');
        window.open(`${config.apiUrl}/download/${token}.csv`, '_blank');
    }

    onPrintAll(event) {
        event.preventDefault();
        this.sharedDataService.certClear();
        window.open(`${config.CLIENT_URL}/dashboard/print-pts-certificate`, '_blank');
    }

    onResendToParent(event) {
        event.preventDefault();
        this.loading = true;
        this.htcService.post('parent/send-emails', {}).subscribe(() => {
            this.loading = false;
            this.alertService.openSnackBar('Emails has been sent succesfully!', 'success');
        }, (err) => {
            this.loading = false;
            const errMsg = _.get(err, 'error.error.message', 'Error occured while send email code.');
            this.alertService.openSnackBar(errMsg, 'error');
        });
    }

    onPrintQR(event) {
        event.preventDefault();
        this.sharedDataService.certClear();
        window.open(`${config.CLIENT_URL}/dashboard/print-pair-runner`, '_blank');
    }

    onClickImport(event) {
        event.preventDefault();
        let alertDialogRef = this.matDialog.open(AlertDialogComponent, {
            disableClose: false,
            maxWidth: '400px'
        });

        alertDialogRef.componentInstance.confirmMessage = 'Children and parent emails will be uploaded to your DTS.'
         + 'Make sure you are only importing children who have been given permission.'
         + '<br />You can do as many CSV File uploads as required';
	
        alertDialogRef.afterClosed().subscribe(result => {
            const fileInput: HTMLElement = document.getElementById('file-import') as HTMLElement;
            fileInput.click();
        });
    }

    onImportFile(event) {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();

            if (fileExt === 'csv' || fileExt === 'txt') {
                const superObj = this;
                this.csv2Array(file, function (jsonData) {
                    superObj.loading = true; 
                    superObj.htcService.post(`runner/upload`, { runners: jsonData }).subscribe((result) => {
                        superObj.alertService.openSnackBar('Imported successfully.', 'success', 5000);
                        superObj.loading = false;
                        superObj.fileReset();
                        superObj.loadRunners();
                    }, (err) => {  
						if(err.status == 400){
							superObj.alertService.openSnackBar(err.error.error, 'error', 5000);
						}else{ 
							superObj.alertService.openSnackBar('Error occured while import file.', 'error', 5000);
						}
                        superObj.fileReset();
                        superObj.loading = false;
                    });
                });
            } else {
                this.alertService.openSnackBar('Please select csv or txt file.', 'error');
            }
        }
    }

    csv2Array(file, cb) {
        let reader: FileReader = new FileReader();
        reader.readAsText(file);

        reader.onload = (e) => {
            let csvData = reader.result;			
            let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);			
            let headersRow = this.getHeaderArray(csvRecordsArray);
            headersRow = headersRow.map((item) => item.trim());			
            const jsonResult = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow);
            cb(jsonResult);
        }
    }

    getHeaderArray(csvRecordsArr: any) {
        let headers = (<string>csvRecordsArr[0]).split(',');
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headersRow: any) {
        let csvArr = [];		
        for (let i = 1; i < csvRecordsArray.length; i++) {
            if(csvRecordsArray[i]) {			
                let curruntRecord = (<string>csvRecordsArray[i]).split(',');				
                const csvRecord: any = {};				
                for (let j = 0; j < headersRow.length; j++) {
					if(curruntRecord[j]){						
						let checkstring = curruntRecord[j].replace(/['"]+/g, '');						
						if(checkstring){
							csvRecord[headersRow[j]] = curruntRecord[j].trim();							
						}
					}
				}
				if(csvRecord.UPN){
					csvArr.push(csvRecord);
				}
            }
        }
		console.log(csvArr);	
        return csvArr;
    }

    fileReset() {
        this.importCsv.nativeElement.value = "";
    }

    deprecatedOnImportFile(event) {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();

            if (fileExt === 'csv' || fileExt === 'txt') {
                this.loading = true;

                const formData = new FormData();
                formData.append('file', file, file.name);

                const rndArg = Math.random().toString(36).substring(7);

                this.htcService.upload(`assets/csv?${rndArg}`, formData).subscribe((result) => {
                    this.alertService.openSnackBar('Imported successfully.', 'success', 5000);
                    this.loading = false;
                    this.loadRunners();
                }, (err) => {
                    this.alertService.openSnackBar('Error occured while import file.', 'error');
                    this.loading = false;
                });
            } else {
                this.alertService.openSnackBar('Please select csv or txt file.', 'error');
            }
        }
    }
}
