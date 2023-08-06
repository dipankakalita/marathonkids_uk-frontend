import * as _ from 'lodash';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertService, HttpCommonService, AuthService } from 'src/app/core/services';
import { MatDialogRef } from '@angular/material/dialog';
import { SchoolTypes } from 'src/app/core/enums';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-setting-form-dlg',
    templateUrl: './setting-form-dialog.component.html',
    styleUrls: ['./setting-form-dialog.component.scss']
})
export class SettingFormDlgComponent implements OnInit, OnDestroy {

    schoolTypes = SchoolTypes;

    dlgTitle = 'Setting';

    curAccount;

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

    loading = false;
    loadingRegions = false;

    constructor(
        private fb: FormBuilder,
        private htcService: HttpCommonService,
        private matDialogRef: MatDialogRef<SettingFormDlgComponent>,
        private authService: AuthService,
        private alertService: AlertService
    ) {
        this.curAccount = this.authService.getCurrentAccount();
    }

    ngOnInit() {
        // loading countys and towns
        this.loading = true;
        this.htcService.get('county/getAll').subscribe((resCounty) => {
            this.counties = resCounty.data;

            this.htcService.get('town/getAll').subscribe((resTown) => {
                this.towns = resTown.data;

                this.filteredCounties.next(this.counties.slice());

                // listen for search field value changes
                this.countyFilterCtrl.valueChanges
                    .pipe(takeUntil(this.onDestroyCounty))
                    .subscribe(() => {
                        this.filterItems(this.counties, this.countyFilterCtrl, this.filteredCounties);
                    });
                setTimeout(() => {
                    this.onSelectCounty(this.curAccount.location._county_id);
                }, 1000);
                this.loading = false;
            }, () => {
                this.loading = false;
            });

        }, () => {
            this.loading = false;
        });

        // loading academic year regions
        this.loadingRegions = true;

        this.htcService.get('region/getAll').subscribe((result) => {
            this.yearRegions = result.data.filter(item => item._id == '5aeb1feccdad59430fd8b6f5');
            this.loadingRegions = false;
        }, () => {
            this.loadingRegions = false;
        });

        this.form = this.fb.group({
            school_name: [this.curAccount.school_name, [Validators.required]],
            subdomain: [this.curAccount.subdomain, [Validators.required]],
            school_type: [this.curAccount.school_type, [Validators.required]],
            'location._county_id': [this.curAccount.location?._county_id, [Validators.required]],
            'location._town_id': [this.curAccount.location?._town_id, [Validators.required]],
            _academic_year_region: [this.curAccount._academic_year_region, [Validators.required]],
            'location.postcode': [_.get(this.curAccount, ['location', 'postcode']), [Validators.required]],
            contact_name: [this.curAccount.contact_name, null],
            phone_number: [this.curAccount.phone_number, [Validators.required]],
            'settings.leaderboard_opt_in': [_.get(this.curAccount, 'settings.leaderboard_opt_in'), null]
        });
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.form.invalid) {
            alert('Please fill correct information');
            return;
        }

        this.loading = true;

        this.htcService.update('account', this.curAccount._id, this.form.value).subscribe(() => {
            this.loading = false;

            const updates = this.form.value;
            for (const key in updates) {
                if (key in updates) {
                    this.curAccount[key] = updates[key];
                }
            }
            this.authService.setCurrentAccount(this.curAccount);

            this.matDialogRef.close({
                success: true
            });
        }, (err) => {
            this.loading = false;
            this.alertService.openSnackBar('Error occured while update setting.', 'error');
            console.log(err);
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
        return ((this.submitted || this.form.controls[field].touched) && this.form.controls[field].errors);
    }
}
