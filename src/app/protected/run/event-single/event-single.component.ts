import { Component, OnInit } from '@angular/core';

import { HttpCommonService, AuthService, YearService, AlertService } from 'src/app/core/services';
import { ActivatedRoute, Router } from '@angular/router';
import * as Utils from 'src/app/core/helpers/utils';
import * as _ from 'lodash';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-dashboard-event-single',
    templateUrl: './event-single.component.html',
    styleUrls: ['./event-single.component.scss']
})
export class EventSingleComponent implements OnInit {

    curAccount;
    eventId;
    eventData;
    courseData;
    curYearId;
    formObjs = [];
    runnerData = [];
    runnerDistance = 0;
    sessions = [];
    forms = [];

    validYear;

    loading = false;

    constructor(
        private htcService: HttpCommonService,
        private yearService: YearService,
        private actRouter: ActivatedRoute,
        private _router: Router,
        private authService: AuthService,
        private alertService: AlertService
    ) {
        this.curAccount = this.authService.getCurrentAccount();
        this.eventId = this.actRouter.snapshot.params.id;
    }

    ngOnInit() {
        this.loading = true;
        this.yearService.getYears().subscribe((years) => {
            this.loading = false;
            if (years) {
                // const validYears = result.data.filter((item) => item._academic_year_region === this.curAccount._academic_year_region);
                // this.curYearId = Utils.getCurrentYearID(validYears);
                this.curYearId = this.curAccount._valid_for;
                if (this.curYearId) {
                    this.loadEventDatas();
                }
            }
        }, (err) => {
            this.loading = false;
            console.log(err);
        });
    }

    async loadEventDatas() {
        this.formObjs = [];
        this.runnerData = [];
        this.runnerDistance = 0;
        this.sessions = [];
        this.forms = [];
        this.courseData = null;

        this.loading = true;
        
        let event = await this.htcService.getById('event', this.eventId).toPromise()
            .catch(() => {
                this.alertService.openSnackBar('Error occured while get form information', 'error');
                this.loading = false;
                return;
            });
        
        if (event.count > 0) {
            this.eventData = event.data;
            const loadTasks = [];

            loadTasks.push(this.htcService.getById('course', this.eventData._course_id));

            // search runner option
            let options: any = {
                where: {
                    _form_id: {
                        $in: this.eventData.forms
                    },
                    _valid_for: this.curYearId,
                    deleted: false
                },
                by: {
                    last_name: 'asc'
                }
            };
            loadTasks.push(this.htcService.post('runner/search', options));

            // search session option
            options = {
                where: { _event_id: this.eventId, deleted: false }
            };
            loadTasks.push(this.htcService.post('session/search', options));

            forkJoin(loadTasks).subscribe((dataList: any) => {
                this.courseData = dataList[0].data;
                this.runnerData = dataList[1].data;

                const sessionData = dataList[2].data;
                _.forEach(sessionData, (session) => {
                    this.sessions[session._runner_id] = session;
                });
                
                _.forEach(this.runnerData, (runner: any) => {
                    this.forms = _.union(this.forms, [runner._form_id]);
                    const laps = _.round(_.get(this, 'sessions[' + runner._id + '].laps', null));
				 
                    if (laps > 0) {
						this.runnerDistance = laps;
					}
                    if (laps !== null) {
                        runner.oldValue = laps;
                        runner.newValue = laps;
                    } else {
                        runner.oldValue = _.round(_.get(this, 'sessions[' + runner._id + '].distance', 0)
                            / this.courseData.distance, 2);
                        runner.newValue = _.round(_.get(this, 'sessions[' + runner._id + '].distance', 0)
                            / this.courseData.distance, 2);
                    }
                });
				
                if (this.forms.length > 0) {
                    options = {
                        where: {
                            _id: {
                                $in: this.forms
                            },
                            deleted: false
                        }
                    };

                    this.htcService.post('form/search', options).subscribe((resForms) => {
                        if (resForms.count > 0) {

                            const formArray = [];
                            _.forEach(resForms.data, (elForm) => {
                                formArray.push({
                                    name: elForm.name,
                                    id: elForm._id
                                });
                            });

                            formArray.sort(this.sortForms);

                            this.formObjs = formArray;
                        }
                        this.loading = false;
                    }, () => {
                        this.loading = false;
                    });
                } else {
                    this.loading = false;
                }

            }, (err) => {
                this.alertService.openSnackBar('Error occured while get form information', 'error');
                this.loading = false;
            });

        } else {
            this.alertService.openSnackBar('Error occured while get form information', 'error');
            this.loading = false;
        }
    }

    onSave(): void {
        const posts = [];
        const puts = [];

        for (const runner of this.runnerData) {
            const session = _.get(this, 'sessions[' + runner._id + ']');
            if (!_.isUndefined(_.get(session, 'distance'))) {
                if (runner.newValue !== runner.oldValue) {
                    puts.push({
                        _id: _.get(session, '_id'),
                        _runner_id: runner._id,
                        laps: runner.newValue,
						applicable_for: "DTS_Schools",
                        distance: runner.newValue * this.courseData.distance,
                        old_distance: _.get(session, 'distance'),
                        participated: _.get(session, 'participated', false)
                    });
                }
            } else {
                posts.push({
                    _runner_id: runner._id,
					applicable_for: "DTS_Schools",
                    _event_id: this.eventData._id,
                    _course_id: this.courseData._id,
                    laps: runner.newValue,
                    distance: runner.newValue * this.courseData.distance,
                    start_date: moment().isBefore(this.eventData.end_date) ? moment().toISOString() : this.eventData.end_date
                });
            }
        }

        if (puts.length > 0 || posts.length > 0) {
            this.loading = true;
            this.htcService.post('session/create/internal', { new_sessions: posts, update_sessions: puts, eventId: this.eventId }).subscribe((result) => {
                this.loading = false;
                this._router.navigate(['dashboard/run']);
            }, (err) => {
                this.loading = false;
                this.loadEventDatas();
            });
        }
    }

    // Sort Forms
    sortForms(a, b) {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
    }

}
