import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services';
import { ErrorMessages } from 'src/app/core/enums/error_messages';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-forgot-team',
  templateUrl: './forgot-team.component.html',
  styleUrls: ['../login/login.component.scss', './forgot-team.component.scss']
})
export class ForgotTeamComponent implements OnInit {

  resetForm: FormGroup;
  submitted = false;

  emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegEx)]]
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.submitted = true;

    this.loading = true;

    this.authService.teamNameRequest(this.resetForm.value).subscribe((result) => {
      this.loading = false;
      this.alertService.success('We have sent you an email to complete the process.');
      console.log(result);
    }, (err) => {
      this.loading = false;
      this.alertService.error(ErrorMessages.login_error);
    });
  }

  get controls() {
    return this.resetForm.controls;
  }

  isInvalid(field) {
    return ((this.submitted || this.resetForm.get(field).touched) && this.resetForm.get(field).errors);
  }
}
