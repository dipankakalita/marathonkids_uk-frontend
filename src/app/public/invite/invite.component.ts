import { Component, OnInit } from '@angular/core';
import { AlertService, HttpCommonService } from 'src/app/core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

  contentTitle = 'You have been invited';
  form: FormGroup;
  formSubmitted = false;

  loading = false;

  constructor(
    private actRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private htcService: HttpCommonService,
    private router: Router
  ) {
    const inviteId = this.actRouter.snapshot.queryParams.id;
    const email = this.actRouter.snapshot.queryParams.email;

    this.form = this.formBuilder.group({
      id: [inviteId, Validators.required],
      email: [email, [Validators.required]],
      password: ['', [Validators.required]],
      password_confirmation: [null, null]
    }, {
        validator: [
          this.MatchConfirm('password', 'password_confirmation'),
        ]
      });
  }

  ngOnInit() {
  }

  onSubmit(event) {
    event.preventDefault();
    this.formSubmitted = true;

    this.loading = true;
    const inviteId = this.form.get('id').value;

    if (inviteId) {
      this.htcService.post(`auth/invite-confirm/${inviteId}`, this.form.value).subscribe((result) => {
        this.loading = false;

        this.alertService.openSnackBar('Your new password has been saved, please login', 'success');
        this.router.navigate(['login']);
      }, () => {
        this.loading = false;
        this.alertService.error('Token is no longer valid.');
      });
    } else {
      alert('Token invalid');
    }
  }

  get controls() {
    return this.form.controls;
  }

  isInvalid(field) {
    return ((this.formSubmitted || this.form.get(field).touched) && this.form.get(field).errors);
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
