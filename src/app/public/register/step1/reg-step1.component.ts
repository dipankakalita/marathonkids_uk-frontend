import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SchoolTypes, IntroductionOptions } from 'src/app/core/enums';
import { FormGroup, FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Countries } from 'src/app/core/enums';

@Component({
  selector: 'app-reg-step1',
  templateUrl: './reg-step1.component.html',
  styleUrls: ['./reg-step1.component.scss']
})
export class RegStep1Component implements OnInit, OnDestroy {

  public townFilterCtrl: FormControl = new FormControl();
  public filteredTowns: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
  protected onDestroyTown = new Subject<void>();

  public countyFilterCtrl: FormControl = new FormControl();
  public filteredCounties: ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>(1);
  protected onDestroyCounty = new Subject<void>();

  @Input() form: FormGroup;
  @Input() counties;
  @Input() towns;
  @Output() NavigateStep = new EventEmitter();
  countries = Countries;

  townsOfCity = [];

  formSubmitted = false;

  schoolTypes = SchoolTypes;
  instroOptions = IntroductionOptions;

  loading = false;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      // load the initial county list
      this.filteredCounties.next(this.counties.slice());

      // listen for search field value changes
      this.countyFilterCtrl.valueChanges
        .pipe(takeUntil(this.onDestroyCounty))
        .subscribe(() => {
          this.filterItems(this.counties, this.countyFilterCtrl, this.filteredCounties);
        });
    }, 2000);
  }

  mapTowns() {

  }

  ngOnDestroy() {
    this.onDestroyTown.next();
    this.onDestroyTown.complete();
    this.onDestroyCounty.next();
    this.onDestroyCounty.complete();
  }

  onSubmit(event) {
    event.preventDefault();
    this.formSubmitted = true;

    if (this.form.valid) {
      const data = { action: 'increase', step: 1 };
      this.NavigateStep.emit(data);
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

  onBack() {
    const data = { action: 'decrease', step: 2 };
    this.NavigateStep.emit(data);
  }

  get controls() {
    return this.form.controls;
  }

  isInvalid(field) {
    return ((this.formSubmitted || this.form.get(field).touched) && this.form.get(field).errors);
  }
}
