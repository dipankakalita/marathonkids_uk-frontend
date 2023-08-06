import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../login/login.component.scss', './reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  tokenId;
  submitted = false;

  // pwdRegEx = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,}$/;

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private authService: AuthService,
    private actRouter: ActivatedRoute
  ) {
    this.tokenId = this.actRouter.snapshot.queryParams.id;
  }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      // password: ['', [Validators.required, Validators.pattern(this.pwdRegEx)]]
      password: ['', [Validators.required]]
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.submitted = true;

    this.loading = true;

    this.authService.resetPassword(this.tokenId, this.resetForm.value).subscribe((result) => {
      this.loading = false;
      this.alertService.success('Your new password has been saved, please login');
    }, (err) => {
      this.loading = false;
      this.alertService.error('Token is no longer valid.');
    });
  }

  get controls() {
    return this.resetForm.controls;
  }

  isInvalid(field) {
    return ((this.submitted || this.resetForm.get(field).touched) && this.resetForm.get(field).errors);
  }
}
