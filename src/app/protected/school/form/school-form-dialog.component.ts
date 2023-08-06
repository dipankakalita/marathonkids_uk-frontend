import * as _ from 'lodash';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertService, HttpCommonService } from 'src/app/core/services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SchoolTypes, FormType } from 'src/app/core/enums';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-school-form-dlg',
    templateUrl: './school-form-dialog.component.html',
    styleUrls: ['./school-form-dialog.component.scss']
})
export class SchoolFormDlgComponent implements OnInit, OnDestroy {

    schoolTypes = SchoolTypes;

    dlgTitle = 'School';

    public townFilterCtrl: FormControl = new FormControl();
    public filteredTowns: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    protected onDestroyTown = new Subject<void>();

    public countyFilterCtrl: FormControl = new FormControl();
    public filteredCounties: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
    protected onDestroyCounty = new Subject<void>();

    counties = [];
    towns = [];
    townsOfCity = [];
    yearRegions = [];

    form: FormGroup;
    submitted = false;
    formType;
    sourceData;

    loading = false;
    loadingRegions = false;

    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private matDialogRef: MatDialogRef<SchoolFormDlgComponent>,
        private alertService: AlertService
    ) {
        this.formType = data.action;
        if (this.formType === FormType.NEW) {
            this.dlgTitle = 'Create School';
        } else {
            this.sourceData = data.data;
            this.dlgTitle = 'Edit School';
        }
    }

    ngOnInit() {
        let school_name = '';
        let subdomain = '';
        let schoolType = '';
        let county_id = '';
        let townId = '';
        let academicYearRegion = '';
        let postcode = '';
        let contactName = '';
        let phone_number = '';
        let leaderboardOptIn = false;

        if (this.formType === FormType.EDIT) {
            school_name = this.sourceData.school_name;
            subdomain = this.sourceData.subdomain;
            schoolType = this.sourceData.school_type;
            county_id = _.get(this.sourceData.location, '_county_id');
            townId = _.get(this.sourceData.location, '_town_id._id');
            academicYearRegion = this.sourceData._academic_year_region;
            postcode = _.get(this.sourceData.location, 'postcode');
            contactName = this.sourceData.contact_name;
            phone_number = this.sourceData.phone_number;
            leaderboardOptIn = this.sourceData.settings.leaderboard_opt_in;
        }

        // loading countys and towns
        this.loading = true;

        forkJoin([
            this.htcService.get('county/getAll'),
            this.htcService.get('town/getAll')
        ]).subscribe((dataList) => {
            this.counties = dataList[0].data;
            this.towns = dataList[1].data;

            this.filteredCounties.next(this.counties.slice());

            // listen for search field value changes
            this.countyFilterCtrl.valueChanges
                .pipe(takeUntil(this.onDestroyCounty))
                .subscribe(() => {
                    this.filterItems(this.counties, this.countyFilterCtrl, this.filteredCounties);
                });

            this.onSelectCounty(county_id);

            this.loading = false;
        }, (err) => {
            console.log(err);
            this.loading = false;
        });

        // loading academic year regions
        this.loadingRegions = true;

        this.htcService.get('region/getAll').subscribe((result) => {
            this.yearRegions = result.data;
            this.loadingRegions = false;
        }, () => {
            this.loadingRegions = false;
        });



        this.form = this.fb.group({
            school_name: [school_name, [Validators.required]],
            subdomain: [subdomain, [Validators.required]],
            school_type: [schoolType, [Validators.required]],
            _county_id: [county_id, [Validators.required]],
            _town_id: [townId, [Validators.required]],
            _academic_year_region: [academicYearRegion, [Validators.required]],
            postcode: [postcode, [Validators.required]],
            contact_name: [contactName, null],
            phone_number: [phone_number, [Validators.required]],
            leaderboard_opt_in: [leaderboardOptIn, null]
        });
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.form.invalid) {
            alert('Please fill correct information');
            return;
        }

        this.loading = true;

        const {_county_id, _town_id, postcode, ...data} = this.form.value;
        data.location = { _county_id, _town_id, postcode };

        if (this.formType === FormType.NEW) {
            this.htcService.post('account', data).subscribe(() => {
                this.loading = false;

                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while create school.', 'error');
                console.log(err);
            });
        } else {
            this.htcService.update('account', this.sourceData._id, data).subscribe(() => {
                this.loading = false;

                this.matDialogRef.close({
                    success: true
                });
            }, (err) => {
                this.loading = false;
                this.alertService.openSnackBar('Error occured while update school.', 'error');
                console.log(err);
            });
        }
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
            itemArray.filter(item => item.name.toLowerCase().indexOf(search) > -1)
        );
    }

    onSelectCounty(countyId) {
        this.onDestroyTown.next();
        this.onDestroyTown.complete();

        this.townsOfCity = this.towns.filter((item) => item._county_id === countyId);

        this.filteredTowns = null;
        this.filteredTowns = new ReplaySubject<Array<any>>(1);

        // load the initial bank list
        this.filteredTowns.next(this.townsOfCity.slice());

        // listen for search field value changes
        this.townFilterCtrl.valueChanges
            .pipe(takeUntil(this.onDestroyTown))
            .subscribe(() => {
                this.filterItems(this.townsOfCity, this.townFilterCtrl, this.filteredTowns);
            });
    }

    ngOnDestroy() {
        this.onDestroyTown.next();
        this.onDestroyTown.complete();
        this.onDestroyCounty.next();
        this.onDestroyCounty.complete();
    }

    onCancel() {
        this.matDialogRef.close();
    }

    get controls() {
        return this.form.controls;
    }

    isInvalid(field) {
        return ((this.submitted || this.form.get(field).touched) && this.form.get(field).errors);
    }
}
