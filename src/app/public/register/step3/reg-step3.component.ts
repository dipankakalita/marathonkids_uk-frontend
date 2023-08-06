import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reg-step3',
  templateUrl: './reg-step3.component.html',
  styleUrls: ['./reg-step3.component.scss']
})
export class RegStep3Component implements OnInit {

  @Input() form: FormGroup;
  @Output() NavigateStep = new EventEmitter();

  formSubmitted = false;

  loading = false;

  constructor( ) { }

  ngOnInit() {
  }

  onBack() {
    const data = { action: 'decrease', step: 2 };
    this.NavigateStep.emit(data);
  }

  onSubmit(event) {
    event.preventDefault();
    this.formSubmitted = true;

    const data = { action: 'increase', step: 3 };
    this.NavigateStep.emit(data);
  }

  get controls() {
    return this.form.controls;
  }

  isInvalid(field) {
    return ((this.formSubmitted || this.form.get(field).touched) && this.form.get(field).errors);
  }
}
