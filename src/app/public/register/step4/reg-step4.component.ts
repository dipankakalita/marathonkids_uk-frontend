import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WeekDays } from 'src/app/core/enums';

@Component({
  selector: 'app-reg-step4',
  templateUrl: './reg-step4.component.html',
  styleUrls: ['./reg-step4.component.scss']
})
export class RegStep4Component implements OnInit {

  @Input() form: FormGroup;
  @Output() NavigateStep = new EventEmitter();

  weekDays = WeekDays;

  formSubmitted = false;

  loading = false;

  constructor() { }

  ngOnInit() {
  }

  onBack() {
    const data = { action: 'decrease', step: 2 };
    this.NavigateStep.emit(data);
  }

  onSubmit(event) {
    event.preventDefault();
    this.formSubmitted = true;

    if (this.form.valid) {
      const data = { action: 'complete', step: 4 };
      this.NavigateStep.emit(data);
    }
  }

  get controls() {
    return this.form.controls;
  }

  isInvalid(field) {
    return ((this.formSubmitted || this.form.get(field).touched) && this.form.get(field).errors);
  }
}
