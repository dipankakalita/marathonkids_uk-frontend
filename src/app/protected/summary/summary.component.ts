import { Component, OnInit, OnDestroy, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js';

import { YearGroups, Genders, SchoolTypes } from 'src/app/core/enums';
import { HttpCommonService, AuthService, YearService } from 'src/app/core/services';
import { WhereConditions, FormType } from 'src/app/core/enums';
import { Observable, forkJoin, ReplaySubject, Subject } from 'rxjs';
import * as Utils from 'src/app/core/helpers/utils';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

declare let $;

@Component({
    selector: 'app-dashboard-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SummaryComponent implements OnInit, OnDestroy {

    @ViewChild('kygChart') kygChartElement: any;
    @ViewChild('kfChart') kfChartElement: any;
    @ViewChild('maChart') maChartElement: any;

    kygChart: any;
    kfChart: any;
    maChart: any;

    public countyFilterCtrl: FormControl = new FormControl();
    public filteredCounties: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    protected onDestroyCounty = new Subject<void>();

    public schoolFilterCtrl: FormControl = new FormControl();
    public filteredSchools: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    protected onDestroySchool = new Subject<void>();

    public parkFilterCtrl: FormControl = new FormControl();
    public filteredParks: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    protected onDestroyPark = new Subject<void>();

    public ethnicityFilterCtrl: FormControl = new FormControl();
    public filteredEthnicity: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    protected onDestroyEthnicity = new Subject<void>();

    fromDate;
    toDate;
    accountType;
    curAccount;
    curYearID;
    isMainAdmin = false;
    yearGroups = YearGroups;
    genders = Genders;
    schoolTypes = SchoolTypes;

    countOpts = {
        decimalPlaces: 1
    };

    years: any = [{
        label: 'All Years',
        value: WhereConditions.ALLOW_ALL
    }];

    schools: any = [{
        label: 'All Schools',
        value: WhereConditions.ALLOW_ALL
    }];

    parks: any = [{
        label: 'All Parks',
        value: WhereConditions.ALLOW_ALL
    }];

    counties: any = [{
        label: 'All Counties',
        value: WhereConditions.ALLOW_ALL
    }];

    players = [];
	
    ethnicity: any = [{
        label: 'All Ethnicity',
        value: WhereConditions.ALLOW_ALL
    }];
	
    search: any = {
        _academic_year_id: WhereConditions.ALLOW_ALL,
        _account_id: WhereConditions.ALLOW_ALL,
        _county_id: WhereConditions.ALLOW_ALL,
        year_group: WhereConditions.ALLOW_ALL,
        gender: WhereConditions.ALLOW_ALL,
        school_type: WhereConditions.ALLOW_ALL,
        data_type: WhereConditions.ALLOW_ALL,
        _course_id: WhereConditions.ALLOW_ALL,
        ethnicity: WhereConditions.ALLOW_ALL,
        created_at: WhereConditions.ALLOW_ALL
    };

    totalFeedback = {
		five_star_ratings : 0,
		four_star_ratings : 0,
		three_star_ratings : 0,
		two_star_ratings : 0,
		one_star_ratings : 0
	};
    totalVolunteers = 0;
    totalRunners;
    totalActRunners;
    totalDistance;
    attendance;
    avgRDistance;
    avgSDistance;
    distYearGroup;
    milestones = {
        tenkPC: null,
        halfPC: null,
        thirtykPC: null,
        marathonPC: null,
        marathonTwoPC: null,
        marathonThreePC: null,
        marathonFourPC: null,

        total: null,
        tenk: null,
        half: null,
        thirtyk: null,
        marathon: null,
        marathonTwo: null,
        marathonThree: null,
        marathonFour: null
    };

    appmilestones = {
        tenkPC: null,
        halfPC: null,
        thirtykPC: null,
        marathonPC: null,
        marathonTwoPC: null,
        marathonThreePC: null,
        marathonFourPC: null,
        marathonFivePC: null,
        marathonSixPC: null,
        marathonSevenPC: null,
        marathonEightPC: null,
        marathonNinePC: null,
        marathonTenPC: null,

        total: null,
        tenk: null,
        half: null,
        thirtyk: null,
        marathon: null,
        marathonTwo: null,
        marathonThree: null,
        marathonFour: null,
        marathonFive: null,
        marathonSix: null,
        marathonSeven: null,
        marathonEight: null,
        marathonNine: null,
        marathonTen: null
    };

    loading = false;
    loadingTR = false;
    loadingATR = false;
    loadingTD = false;
    loadingARD = false;
    loadingASD = false;
    loadingATT = false;
    loadingKYG = false;
    loadingKF = false;
    loadingMA = false;
    loadingMIL = false;

    constructor(
        private htcService: HttpCommonService,
        private yearService: YearService,
        private authService: AuthService
    ) {
        this.isMainAdmin = this.authService.isMainAdmin();
        this.curAccount = this.authService.getCurrentAccount();
        this.accountType = this.authService.getAccountType();
		
        this.loadLists();
		
		// check which type is selected from superadmin account
		if(this.isMainAdmin == true && this.accountType=="Schools"){
			this.search.data_type = WhereConditions.ALLOW_SCHOOL;
		}else if(this.isMainAdmin == true){
			this.search.data_type = WhereConditions.ALLOW_PARKS;
		}
    }

    ngOnInit() {
		this.getMonthlyAttendance();
		this.getParkAttendance();
	}
	
	getParkAttendance(){
        // this.loadLists = true;

        let whereCondition = this.getValidConditions('runners'); 
        let options: any = {
            where: whereCondition
        };
	
		if(this.search._academic_year_id == WhereConditions.ALLOW_ALL){
			options.where.created_at = {
				fromDate: '',
				toDate: new Date(new Date().getFullYear(), 12, 0), 
			}			
		}
		
        this.htcService.post('runner/get/park-attendance', options).subscribe((result) => {
            // this.loadLists = false;
        }, () => {
            setTimeout(() => {
                // this.loadLists = false;
            }, 500);
        });
	}
	
	createAppMilestones(){
        this.loadingMA = true;

        let whereCondition = this.getValidConditions('runners'); 
        let options: any = {
            where: whereCondition
        };
	
		if(this.search._academic_year_id == WhereConditions.ALLOW_ALL){
			options.where.created_at = {
				fromDate: new Date(new Date().getFullYear(), 0, 1), 
				toDate: new Date(new Date().getFullYear(), 12, 0), 
			}			
		}
		
        this.htcService.post('session/create/appmilstone', options).subscribe((result) => {
            this.loadingMA = false;
        }, () => {
            setTimeout(() => {
                this.loadingMA = false;
            }, 500);
        });
	}
	
    filterItems(itemArray, itemCtrl, filtered) {
        if (!itemArray) {
            return;
        }
        // get the search keyword
        let search = itemCtrl.value;
        if (!search) {
            filtered.next(itemArray.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        filtered.next(
            itemArray.filter(item => item.label.toLowerCase().indexOf(search) > -1)
        );
    }

    filterFrom(dt){
		if(dt){
			this.fromDate = new Date(dt.value);
			this.searchDatas();
		}
	}
	
    filterTo(dt){
		if(dt){
			this.toDate = new Date(dt.value);
			this.searchDatas();
		}
	}
	
    loadLists() {
        this.loading = true;

        const options = {
            by: {
                school_name: 'asc'
            },
            where: {
                deleted: false
            }
        };

        const park_options = {
            by: {
                name: 'asc'
            },
            where: {
                deleted: false
            }
        };

        let getListServices: Observable<any[]>;
        
		var ethnicityArr = ["White British", "White Others", "Black British", "Asian British", "Irish", "African", "Asian", "Other"];
		this.processEthnicityList(ethnicityArr);

        this.yearService.getYears().subscribe((resYears) => {
            this.processYearList(resYears);

            if (this.isMainAdmin) {
                getListServices = forkJoin([
                    this.htcService.post('parkEvent/list', park_options),
                    this.htcService.post('account/getAll', options),
                    this.htcService.get('county/getAll'),
                ]);
				
                getListServices.subscribe((responseList) => {
                    this.processParksList(responseList[0].data);
                    this.processSchoolList(responseList[1].data);
                    this.processCountyList(responseList[2].data);

                    setTimeout(() => {
                        // load the initial county list
                        this.filteredCounties.next(this.counties.slice());

                        // listen for search field value changes
                        this.countyFilterCtrl.valueChanges
                            .pipe(takeUntil(this.onDestroyCounty))
                            .subscribe(() => {
                                this.filterItems(this.counties, this.countyFilterCtrl, this.filteredCounties);
                            });
                    });

                    setTimeout(() => {
                        // load the initial school list
                        this.filteredSchools.next(this.schools.slice());

                        // listen for search field value changes
                        this.schoolFilterCtrl.valueChanges
                            .pipe(takeUntil(this.onDestroySchool))
                            .subscribe(() => {
                                this.filterItems(this.schools, this.schoolFilterCtrl, this.filteredSchools);
                            });
                    });

                    setTimeout(() => {
                        // load the initial park list
                        this.filteredParks.next(this.parks.slice());

                        // listen for search field value changes
                        this.parkFilterCtrl.valueChanges
                            .pipe(takeUntil(this.onDestroyPark))
                            .subscribe(() => {
                                this.filterItems(this.parks, this.parkFilterCtrl, this.filteredParks);
                            });
                    });

                    setTimeout(() => {
                        // load the initial ethnicity list
                        this.filteredEthnicity.next(this.ethnicity.slice());

                        // listen for search field value changes
                        this.ethnicityFilterCtrl.valueChanges
                            .pipe(takeUntil(this.onDestroyEthnicity))
                            .subscribe(() => {
                                this.filterItems(this.ethnicity, this.ethnicityFilterCtrl, this.filteredEthnicity);
                            });
                    });
					
                    this.searchDatas();
                    this.loading = false;
                }, (err) => {
                    this.loading = false;
                    console.log(err);
                });
            } else {
                this.searchDatas();
                this.loading = false;
            }
        }, () => {
            this.loading = false;
        });
    }

    processYearList(yearsList) {
        const revOrderYears = yearsList.reverse();

        let validYears = [];
        let validYearList = [];

        if (this.authService.isKrfAccount()) {
            validYears = revOrderYears;
            validYearList = validYears.map((year) => {
                return {
                    label: `${year.name} (${year.region_name})`,
                    value: year._id
                };
            });
        } else {
            validYears = revOrderYears.filter((item) => {
                return item._academic_year_region === this.curAccount._academic_year_region;
            });

            validYearList = validYears.map((year) => {
                return {
                    label: year.name,
                    value: year._id
                };
            });
        }

        this.curYearID = Utils.getCurrentYearID(validYears);

        this.years = this.years.concat(validYearList);

        if (!this.authService.isKrfAccount() && this.curAccount._valid_for) {
            const curYearItem = validYears.find((item) => {
                return this.curAccount._valid_for === item._id;
            });

            if (curYearItem) {
                this.search._academic_year_id = curYearItem._id;
            }
        }
    }

    processSchoolList(schoolsList) {
        const tempList = [];
        for (const school of schoolsList) {
            tempList.push({
                label: school.school_name,
                value: school._id
            });
        }

        this.schools = this.schools.concat(tempList);
    }

    processParksList(parksList) {
        const tempList = [];
        for (const parkItem of parksList) {
            tempList.push({
                label: parkItem.name,
                value: parkItem._id
            });
        }
        this.parks = this.parks.concat(tempList);
    }

    processEthnicityList(ethnicity) {
        const tempList = [];
        for (const ethnicityItem of ethnicity) {
            tempList.push({
                label: ethnicityItem,
                value: ethnicityItem
            });
        }
        this.ethnicity = this.ethnicity.concat(tempList);
    }

    processCountyList(countiesList) {
        const tempList = [];
        for (const county of countiesList) {
            tempList.push({
                label: county.name,
                value: county._id
            });
        }

        this.counties = this.counties.concat(tempList);
    }

    searchDatas() {
        this.getTotalRunners();
        this.getTotalFeedback();
        this.getActiveTotalRunners();
        this.getTotalDistance();
        this.getTotalVolunteers();
        this.getAttendance();
        this.getMonthlyAttendance();
        this.getParkAttendance();
        this.getAverageRDistance();
        this.getAverageSDistance();
        this.getKmByYearGroup();
        this.getKmByForm();
    }

    getValidConditions(collection = 'sessions') { 
        const validConditions: any = {};
        for (const key in this.search) {
			if (key === 'created_at'){
				if(this.fromDate && this.toDate){
					validConditions.created_at = {
						fromDate: (this.fromDate), 
						toDate: (this.toDate)
					}
				}else if(this.fromDate){
					validConditions.created_at = {
						fromDate: (this.fromDate)
					}
				}else if(this.toDate){
					validConditions.created_at = { 
						toDate: (this.toDate)
					}
				}
			}
			
            if (key in this.search && this.search[key] !== WhereConditions.ALLOW_ALL) {
                if (key === 'data_type'){
                    if (collection === 'sessions') {
                        validConditions.verified = this.search[key];
                    } else {
                        if (this.search[key]) {
                            // validConditions._app_runner = { $exists: true };
                            validConditions._school_runner = true;
                        } else {
                            validConditions._app_runner = true;
                            // validConditions._school_runner = { $exists: true };
                        }
                    }
                } else {
                    validConditions[key] = this.search[key];
                }
            }
        }
        return validConditions;
    }

    // RUNNERS_TOTAL
    getTotalFeedback() {
        const whereCondition = this.getValidConditions('runners');
        const options = {
            where: { ...{ deleted: false }, ...whereCondition }
        };
		
        this.loadingTR = true;
	
        this.htcService.post('session/get/total-feedback', options).subscribe((result) => {
			if(result.data){
				this.totalFeedback.five_star_ratings = (result.data.five_star_ratings);
				this.totalFeedback.four_star_ratings = (result.data.four_star_ratings);
				this.totalFeedback.three_star_ratings = (result.data.three_star_ratings);
				this.totalFeedback.two_star_ratings = (result.data.two_star_ratings);
				this.totalFeedback.one_star_ratings = (result.data.one_star_ratings);
			}else{
				this.totalFeedback.five_star_ratings = 0;
				this.totalFeedback.four_star_ratings = 0;
				this.totalFeedback.three_star_ratings = 0;
				this.totalFeedback.two_star_ratings = 0;
				this.totalFeedback.one_star_ratings = 0;
			}
			this.loadingTR = false;
        }, (err) => {
            setTimeout(() => {
                this.loadingTR = false;
            }, 500);
            console.log(err);
        });

    }

    // RUNNERS_TOTAL
    getTotalRunners() {
        const whereCondition = this.getValidConditions('runners');
        const options = {
            where: { ...{ deleted: false }, ...whereCondition }
        };
		
        this.loadingTR = true;
	
        this.htcService.post('runner/get/total-count', options).subscribe((result) => {
            this.totalRunners = _.get(result, 'data', 0);

            this.loadingTR = false;
        }, (err) => {
            setTimeout(() => {
                this.loadingTR = false;
            }, 500);
            console.log(err);
        });

    }

    // RUNNERS_TOTAL_ACTIVE
    getActiveTotalRunners() {
        this.loadingATR = true;
        this.loadingMIL = true;

        const whereCondition = this.getValidConditions();

        const options = {
            where: whereCondition
        };

        this.htcService.post('runner/get/active-runners', options).subscribe((result) => {
            this.totalActRunners = _.get(result, 'data', 0);

            this.getMilestones(this.totalActRunners);

            this.loadingATR = false;
        }, (err) => {
            setTimeout(() => {
                this.loadingATR = false;
            }, 500);
            console.log(err);
        });
    }

    // No Of Volunteers
    getTotalVolunteers() {
        this.loadingATT = true;

        const whereCondition = this.getValidConditions();

        const whereOptions = {
            deleted: false
        };

        const options = {
            where: { ...whereCondition, ...whereOptions }
        };

        this.htcService.post('session/get/total-volunteers', options).subscribe((result) => {
		 
            this.totalVolunteers = (_.get(result, 'data', 0));
            this.loadingATT = false;
        }, (err) => {
            setTimeout(() => {
                this.loadingATT = false;
            }, 500);
            console.log(err);
        });
    }

    // TOTAL_DISTANCE
    getTotalDistance() {
        this.loadingTD = true;

        const whereCondition = this.getValidConditions();

        const whereOptions = {
            deleted: false
        };

        const options = {
            where: { ...whereCondition, ...whereOptions }
        };

        this.htcService.post('session/get/total-distance', options).subscribe((result) => {
            this.totalDistance = (_.get(result, 'data', 0) / 1000).toFixed(1);
            this.loadingTD = false;
        }, (err) => {
            setTimeout(() => {
                this.loadingTD = false;
            }, 500);
            console.log(err);
        });
    }

    // MONTHLY ATTENDANCE
    getMonthlyAttendance(){
        this.loadingMA = true;

        let whereCondition = this.getValidConditions('runners'); 
        let options: any = {
            where: whereCondition
        };
	
		if(this.search._academic_year_id == WhereConditions.ALLOW_ALL){
			options.where.created_at = {
				fromDate: new Date(new Date().getFullYear(), 0, 1), 
				toDate: new Date(new Date().getFullYear(), 12, 0), 
			}			
		}
		
        this.htcService.post('runner/monthlyAttendance', options).subscribe((result) => {
			setTimeout(() => {
				this.initMonthlyBarChart(result.data, result.total);
			}, 1000);
			
            this.loadingMA = false;
        }, () => {
            setTimeout(() => {
                this.loadingMA = false;
            }, 500);
        });
    }
	
    // ATTENDANCE
    getAttendance() {
        this.loadingATT = true;

        let whereCondition = this.getValidConditions('runners');

        let options: any = {
            where: whereCondition
        };

        this.htcService.post('runner/get/attendance', options).subscribe((result) => { 
            this.attendance = result.data ? result.data.toFixed(1) : 0;
            this.loadingATT = false;
        }, () => {
            setTimeout(() => {
                this.loadingATT = false;
            }, 500);
        });
    }

    // AVERAGE_PER_RUNNER
    getAverageRDistance() {
        this.loadingARD = true;

        const whereCondition = this.getValidConditions();

        let options: any = {
            where: { ...whereCondition }
        };

        this.htcService.post('session/get/avg-per-runner', options).subscribe((result) => {
            this.avgRDistance = (result.data).toFixed(1);
            this.loadingARD = false;
        }, () => {
            setTimeout(() => {
                this.loadingATT = false;
            }, 500);
        });
    }

    // AVERAGE_PER_RUN
    getAverageSDistance() {
        this.loadingASD = true;

        const whereCondition = this.getValidConditions();

        const options = {
            where: { ...whereCondition }
        };

        this.htcService.post('session/get/avg-per-run', options).subscribe((result) => {
            this.avgSDistance = result.data.toFixed(1);

            this.loadingASD = false;
        }, (err) => {
            setTimeout(() => {
                this.loadingASD = false;
            }, 500);
            console.log(err);
        });
    }

    // KILOMETERS_BY_YEAR_GROUP
    getKmByYearGroup() {
        this.loadingKYG = true;

        const whereCondition = this.getValidConditions();

        const whereOptions = {
            deleted: false
        };

        const options = {
            where: { ...whereCondition, ...whereOptions }
        };

        this.htcService.post('session/get/by-year-group', options).subscribe((result) => {
            this.loadingKYG = false;

            if (result.count > 0) {
                setTimeout(() => {
                    this.initBarChart(result.data, 'year_group');
                });
            }
        }, (err) => {
            setTimeout(() => {
                this.loadingKYG = false;
            }, 500);
            console.log(err);
        });
    }

    // KILOMETERS_BY_FORM
    getKmByForm() {
        this.loadingKF = true;

        const whereCondition = this.getValidConditions();

        const whereOptions = {
            deleted: false
        };

        const options = {
            where: { ...whereCondition, ...whereOptions }
        };

        this.htcService.post('session/get/by-form', options).subscribe((result) => {
            this.loadingKF = false;

            if (result.count > 0) {
                setTimeout(() => {
                    this.initBarChart(result.data.slice(0, 20));
                });
            }
        }, (err) => {
            setTimeout(() => {
                this.loadingKF = false;
            }, 500);
            console.log(err);
        });
    }

    // MILESTONES
    getMilestones(activeRunners) {
        this.loadingMIL = true;
        let whereCondition = this.getValidConditions('runners');
        let options: any = {
            where: { ...whereCondition }
        };
		
		if(this.isMainAdmin && this.accountType=='Parks'){
			this.createAppMilestones();
			this.htcService.post('runner/get/by-park-milestone', options).subscribe((result) => {
				this.appmilestones.total = (activeRunners || 1).toFixed(1);
				this.appmilestones.tenk = (_.get(result, 'data[0].tenk', 0)).toFixed(1);
				this.appmilestones.half = (_.get(result, 'data[0].half', 0)).toFixed(1);
				this.appmilestones.thirtyk = (_.get(result, 'data[0].thirtyk', 0)).toFixed(1);
				this.appmilestones.marathon = (_.get(result, 'data[0].marathon', 0)).toFixed(1);
				this.appmilestones.marathonTwo = (_.get(result, 'data[0].marathon_2', 0)).toFixed(1);
				this.appmilestones.marathonThree = (_.get(result, 'data[0].marathon_3', 0)).toFixed(1);
				this.appmilestones.marathonFour = (_.get(result, 'data[0].marathon_4', 0)).toFixed(1);
				this.appmilestones.marathonFive = (_.get(result, 'data[0].marathon_5', 0)).toFixed(1);
				this.appmilestones.marathonSix = (_.get(result, 'data[0].marathon_6', 0)).toFixed(1);
				this.appmilestones.marathonSeven = (_.get(result, 'data[0].marathon_7', 0)).toFixed(1);
				this.appmilestones.marathonEight = (_.get(result, 'data[0].marathon_8', 0)).toFixed(1);
				this.appmilestones.marathonNine = (_.get(result, 'data[0].marathon_9', 0)).toFixed(1);
				this.appmilestones.marathonTen = (_.get(result, 'data[0].marathon_10', 0)).toFixed(1);

				this.appmilestones.tenkPC = (this.appmilestones.tenk > 0 ? (this.appmilestones.tenk / this.appmilestones.total) * 100 : 0).toFixed(1);
				this.appmilestones.halfPC = (this.appmilestones.half > 0 ? (this.appmilestones.half / this.appmilestones.total) * 100 : 0).toFixed(1);
				this.appmilestones.thirtykPC = (this.appmilestones.thirtyk > 0 ?
					(this.appmilestones.thirtyk / this.appmilestones.total) * 100 : 0).toFixed(1);
				this.appmilestones.marathonPC = (this.appmilestones.marathon > 0 ?
					(this.appmilestones.marathon / this.appmilestones.total) * 100 : 0).toFixed(1);
				this.appmilestones.marathonTwoPC = (this.appmilestones.marathonTwo > 0 ?
					(this.appmilestones.marathonTwo / this.appmilestones.total) * 100 : 0).toFixed(1);
				this.appmilestones.marathonThreePC = (this.appmilestones.marathonThree > 0 ?
					(this.appmilestones.marathonThree / this.appmilestones.total) * 100 : 0).toFixed(1);
				this.appmilestones.marathonFourPC = (this.appmilestones.marathonFour > 0 ?
					(this.appmilestones.marathonFour / this.appmilestones.total) * 100 : 0).toFixed(1);
				this.appmilestones.marathonFivePC = (this.appmilestones.marathonFive > 0 ?
					(this.appmilestones.marathonFive / this.appmilestones.total) * 100 : 0).toFixed(1);
				this.appmilestones.marathonSixPC = (this.appmilestones.marathonSix > 0 ?
					(this.appmilestones.marathonSix / this.appmilestones.total) * 100 : 0).toFixed(1);
				this.appmilestones.marathonSevenPC = (this.appmilestones.marathonSeven > 0 ?
					(this.appmilestones.marathonSeven / this.appmilestones.total) * 100 : 0).toFixed(1);
				this.appmilestones.marathonEightPC = (this.appmilestones.marathonEight > 0 ?
					(this.appmilestones.marathonEight / this.appmilestones.total) * 100 : 0).toFixed(1);
				this.appmilestones.marathonNinePC = (this.appmilestones.marathonNine > 0 ?
					(this.appmilestones.marathonNine / this.appmilestones.total) * 100 : 0).toFixed(1);
				this.appmilestones.marathonTenPC = (this.appmilestones.marathonTen > 0 ?
					(this.appmilestones.marathonTen / this.appmilestones.total) * 100 : 0).toFixed(1);
					
				this.loadingMIL = false;
			}, (err) => {
				setTimeout(() => {
					this.loadingMIL = false;
				}, 500);
				console.log(err);
			});	
		}else{
			this.htcService.post('runner/get/by-milestone', options).subscribe((result) => {
				this.milestones.total = (activeRunners || 1).toFixed(1);
				this.milestones.tenk = (_.get(result, 'data[0].tenk', 0)).toFixed(1);
				this.milestones.half = (_.get(result, 'data[0].half', 0)).toFixed(1);
				this.milestones.thirtyk = (_.get(result, 'data[0].thirtyk', 0)).toFixed(1);
				this.milestones.marathon = (_.get(result, 'data[0].marathon', 0)).toFixed(1);
				this.milestones.marathonTwo = (_.get(result, 'data[0].marathon_2', 0)).toFixed(1);
				this.milestones.marathonThree = (_.get(result, 'data[0].marathon_3', 0)).toFixed(1);
				this.milestones.marathonFour = (_.get(result, 'data[0].marathon_4', 0)).toFixed(1);

				this.milestones.tenkPC = (this.milestones.tenk > 0 ? (this.milestones.tenk / this.milestones.total) * 100 : 0).toFixed(1);
				this.milestones.halfPC = (this.milestones.half > 0 ? (this.milestones.half / this.milestones.total) * 100 : 0).toFixed(1);
				this.milestones.thirtykPC = (this.milestones.thirtyk > 0 ?
					(this.milestones.thirtyk / this.milestones.total) * 100 : 0).toFixed(1);
				this.milestones.marathonPC = (this.milestones.marathon > 0 ?
					(this.milestones.marathon / this.milestones.total) * 100 : 0).toFixed(1);
				this.milestones.marathonTwoPC = (this.milestones.marathonTwo > 0 ?
					(this.milestones.marathonTwo / this.milestones.total) * 100 : 0).toFixed(1);
				this.milestones.marathonThreePC = (this.milestones.marathonThree > 0 ?
					(this.milestones.marathonThree / this.milestones.total) * 100 : 0).toFixed(1);
				this.milestones.marathonFourPC = (this.milestones.marathonFour > 0 ?
					(this.milestones.marathonFour / this.milestones.total) * 100 : 0).toFixed(1);
					
				this.loadingMIL = false;
			}, (err) => {
				setTimeout(() => {
					this.loadingMIL = false;
				}, 500);
				console.log(err);
			});
		}
    }

    initMonthlyBarChart(dataObj, labelArray) { 
        const data = [];

        let chartElementId, chartContainer;
        let oldChart;
        let chartContext;

		chartElementId = 'maChart';
		chartContainer = 'ma-container';

		oldChart = this.maChart;
		chartContext = this.maChartElement;

		for (const res of dataObj) {
			if(res){
				const attendance = res.toFixed(1);
				if (parseFloat(attendance) > 0) {
					data.push(attendance);
				}
			}
		}
		
        oldChart = new Chart(chartContext.nativeElement, {
            type: 'bar',
            data: {
                labels: labelArray,
                datasets: [
                    {
                        data: data,
                        borderColor: '#4286ff',
                        backgroundColor: '#4286ff',
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        display: true
                    }],
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                },
                tooltips: {
                    callbacks: {
                        label: (tooltipItem) => {
                            return 'Attendance = ' + Number(tooltipItem.yLabel) + '%';
                        }
                    }
                }
            }
        });
		 
        this.maChart = oldChart;
	}
	
    initBarChart(groups, type = 'form') {
        const labelArray = [];
        const data = [];

        let chartElementId, chartContainer;
        let oldChart;
        let chartContext;

        if (type === 'form') {
            chartElementId = 'kfChart';
            chartContainer = 'kf-container';

            oldChart = this.kfChart;
            chartContext = this.kfChartElement;

            for (const groupItem of groups) {
                const distance = (groupItem.total_distance / 1000).toFixed(2);
                if (parseFloat(distance) > 0) {
                    labelArray.push(groupItem._id);
                    data.push(distance);
                }
            }
        } else {
            chartElementId = 'kygChart';
            chartContainer = 'kyg-container';

            oldChart = this.kygChart;
            chartContext = this.kygChartElement;

            for (const item of this.yearGroups) {
                const groupItem = groups.find((group) => group._id === item.value);

                if (groupItem) {
                    const distance = (groupItem.total_distance / 1000).toFixed(2);
                    if (parseFloat(distance) > 0) {
                        labelArray.push(item.label);
                        data.push(distance);
                    }
                }
            }
        }

        // const canvas = <HTMLCanvasElement> document.getElementById(chartElementId);
        // console.log(canvas);
        // const chartContext = canvas.getContext("2d");

        /* if (oldChart) {
            $(`#${chartElementId}`).remove();
            $(`.${chartContainer}`).append(`<canvas id="${chartElementId}"></canvas>`);
        }*/

        // let chartContext:Element = document.getElementById(chartElementId);

        oldChart = new Chart(chartContext.nativeElement, {
            type: 'bar',
            data: {
                labels: labelArray,
                datasets: [
                    {
                        data: data,
                        borderColor: '#4286ff',
                        backgroundColor: '#4286ff',
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        display: true
                    }],
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                },
                tooltips: {
                    callbacks: {
                        label: (tooltipItem) => {
                            return 'Runs = ' + Number(tooltipItem.yLabel) + 'km';
                        }
                    }
                }
            }
        });

        if (type === 'form') {
            this.kfChart = oldChart;
        } else {
            this.kygChart = oldChart;
        }
    }

    ngOnDestroy() {
        this.onDestroyCounty.next();
        this.onDestroyCounty.complete();
        this.onDestroySchool.next();
        this.onDestroySchool.complete();
    }
}
