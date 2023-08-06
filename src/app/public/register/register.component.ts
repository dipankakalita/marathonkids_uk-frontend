import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpCommonService, AlertService } from 'src/app/core/services';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  stepTitles = [
    'Register your school',
    'Account Admins & DTS Registration',
    'Choose Your Package',
    'Schedule a Phone Call',
    'Thank you for registering!'
  ];

  public formStep1: FormGroup;
  public formStep2: FormGroup;
  public formStep3: FormGroup;
  public formStep4: FormGroup;

  curStep = 1;

  towns = [];
  counties = [];

  emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  // pwdRegEx = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,}$/;

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private htcService: HttpCommonService,
    private alertService: AlertService
  ) {
    this.formStep1 = this.formBuilder.group({
      school_type: [null, [Validators.required]],
      school_name: [null, [Validators.required]],
      school_phone: [null, [Validators.required]],
      school_address: [null, [Validators.required]],
      school_city: [null, [Validators.required]],
      school_county: [null, [Validators.required]],
      school_postcode: [null, [Validators.required]],
      school_country: [null, [Validators.required]],
      school_twitter: [null, null],
      school_introduced: [null, null],
      school_introduced_detail: [null, null]
    });

    this.formStep2 = this.formBuilder.group({
      contact_name: [null, [Validators.required]],
      phone_number: [null, [Validators.required]],
      subdomain: [null, [Validators.required]],
      school_email: [null, [Validators.required, Validators.pattern(this.emailRegEx)]],
      school_email_confirmation: [null, [Validators.required]],
      // password: [null, [Validators.required, Validators.pattern(this.pwdRegEx)]],
      password: [null, [Validators.required]],
      password_confirmation: [null, null],
      receiption_name: [null, [Validators.required]],
      receiption_email: [null, [Validators.required, Validators.pattern(this.emailRegEx)]],
      terms_agreement: [null, [Validators.requiredTrue]],
      legal_agreement: [null, [Validators.requiredTrue]],
      contact_agreement: [null, [Validators.requiredTrue]],
      newsletter_agreement: [null, null]
    }, {
      validator: [
        this.MatchConfirm('password', 'password_confirmation'),
        this.MatchConfirm('school_email', 'school_email_confirmation')
      ]
    });

    this.formStep3 = this.formBuilder.group({
      school_package: [null, [Validators.required]]
    });
	
    this.formStep4 = this.formBuilder.group({
      school_contact_days: [null, [Validators.required]],
      school_contact_times: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.loading = true;

    forkJoin([
      this.htcService.get('county/getAll'),
      this.htcService.get('town/getAll')
    ]).subscribe((dataList) => {
      this.counties = dataList[0].data;
      this.towns = dataList[1].data;
    }).add(() => this.loading = false);
  }

  navigateStep(data) {
    if (data.action === 'increase') {
      this.increaseStep();
    } else if (data.action === 'decrease') {
      this.decreaseStep();
    } else if (data.action === 'complete') {
      this.submitRegister();
    }
  }

  increaseStep() {
    this.alertService.clear();
    if (this.curStep < 5) {
      this.curStep++;
    }
  }

  decreaseStep() {
    this.alertService.clear();
    this.curStep--;
  }

  submitRegister() {
    this.alertService.clear();

    const form1 = this.formStep1.value;
    const form2Data = this.formStep2.value;
    form2Data.email = form2Data.school_email;
    const form3 = this.formStep3.value;
    const form4 = this.formStep4.value;

    const data = { ...form1, ...form2Data, ...form3, ...form4 };

    this.loading = true;
    this.htcService.post('auth/register', data).subscribe(() => {
      this.loading = false;
      this.increaseStep();
    }, (err) => {

      if (err.error.status === 400) {
        this.alertService.error(err.error.error.message);
      } else {
        this.alertService.error('Error occured while register account.');
      }

      this.loading = false;
    });
  }

  private MatchConfirm(type1: any, type2: any) {

    return (checkForm: FormGroup) => {
      const value1 = checkForm.controls[type1];
      const value2 = checkForm.controls[type2];

      if (value1.value === value2.value) {
        return value2.setErrors(null);
      } else {
        return value2.setErrors({ notEquivalent: true });
      }
    };
  }
}
