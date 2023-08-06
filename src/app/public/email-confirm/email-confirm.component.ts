import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-confirm',
  templateUrl: './email-confirm.component.html',
  styleUrls: ['./email-confirm.component.scss']
})
export class EmailConfirmComponent implements OnInit {

  contentMessage = '';
  contentTitle = 'Processing confirm email...';
  confirmed = true;
  loading = false;

  constructor(
    private authService: AuthService,
    private actRouter: ActivatedRoute
  ) {
    const confirmId = this.actRouter.snapshot.queryParams.id;
    this.loading = true;
    this.authService.emailConfirm(confirmId).subscribe((result) => {
      this.contentTitle = 'Email Confirmed';
      this.contentMessage = `Accounts need to be verified by Marathon Kids.
        Please allow up to 5 working days. You will be notified once your account is active.`;
      this.loading = false;
      console.log(result);
    }, (err) => {
      this.contentTitle = 'Token is invalid.';
      this.contentMessage = 'Your email may already be confirmed.';
      this.loading = false;
      console.log(err);
    });
  }

  ngOnInit() {
  }

}
