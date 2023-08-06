import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-reg-step2',
  templateUrl: './reg-step2.component.html',
  styleUrls: ['./reg-step2.component.scss']
})
export class RegStep2Component implements OnInit {

  @Input() form: FormGroup;
  @Output() NavigateStep = new EventEmitter();

  formSubmitted = false;

  loadingChkEmail = false;

  constructor(
    private validService: ValidationService
  ) { }

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
      this.loadingChkEmail = true;

      let getListServices: Observable<any[]>;
      let validTeamName = false;
      let validSchEmail = false;
      let validRecEmail = false;

      getListServices = forkJoin([
        this.validateField('account', 'subdomain', 'subdomain'),
        this.validateField('user', 'local.email', 'school_email'),
        this.validateField('user', 'local.email', 'receiption_email')
      ]);

      getListServices.subscribe((responseList) => {
        validTeamName = this.setValidationError(responseList[0], 'subdomain');
        validSchEmail = this.setValidationError(responseList[1], 'school_email');
        validRecEmail = this.setValidationError(responseList[2], 'receiption_email');

        if (validTeamName && validSchEmail && validRecEmail) {
          const data = { action: 'increase', step: 3 };
          this.NavigateStep.emit(data);
        }
      }).add(() => this.loadingChkEmail = false);
    }
  }

  validateField(collection, colKey, controlKey): Observable<any> {
    const data: any = { deleted: false };
    if (colKey === 'subdomain') {
      data[colKey] = this.form.get(controlKey).value;
    } else {
      data[colKey] = (this.form.get(controlKey).value).toLowerCase();
    }

    const options: any = {
      validation: 'unique',
      data
    };

    return this.validService.validate(collection, options);
  }

  setValidationError(res, ctrlKey): boolean {
    if (res && res.data.result) {
      return true;
    } else {
      this.form.get(ctrlKey).setErrors({ duplicate: true });
      return false;
    }
  }

  get controls() {
    return this.form.controls;
  }

  isInvalid(field) {
    return ((this.formSubmitted || this.form.get(field).touched) && this.form.get(field).errors);
  }
}
