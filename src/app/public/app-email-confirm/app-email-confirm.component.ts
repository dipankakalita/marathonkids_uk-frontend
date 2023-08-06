import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-app-confirm',
  templateUrl: './app-email-confirm.component.html',
  styleUrls: ['./app-email-confirm.component.scss']
})
export class AppEmailConfirmComponent implements OnInit {

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
    this.authService.appEmailConfirm(confirmId).subscribe((result) => {
      this.contentTitle = 'Email Confirmed';
      this.contentMessage = 'Thanks for confirming your email address';
      this.loading = false;
    }, (err) => {
      this.contentTitle = 'Token is invalid.';
      this.contentMessage = 'Your email may already be confirmed.';
      this.loading = false;
    });
  }

  ngOnInit() {
  }

}
