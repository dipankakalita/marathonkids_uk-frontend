import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, HttpCommonService } from 'src/app/core/services';
import { ErrorMessages } from 'src/app/core/enums/error_messages';
import { AuthService } from 'src/app/core/services/auth.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as Utils from 'src/app/core/helpers/utils';
import { config } from 'src/app/config';
import * as moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	
  accountType;
  isMainAdmin = false;		  
  notices : [];
  teamForm: FormGroup;
  submittedTeam = false;
  teamInfo = null;

  loginForm: FormGroup;
  submittedLogin = false;

  emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  loginStep = 1;

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private htcService: HttpCommonService
  ) { }

  ngOnInit() {
    this.teamForm = this.formBuilder.group({
      subdomain: ['', [Validators.required]]
    });

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
	
	const options: any = {     
	  where: {
		  deleted: false,
		  start_date: {
			$lte: moment().toISOString()
		},        
		expiry_date: {
			$gte: moment().toISOString()
		},
		$or: [
		  { display_on: 1 },
		  { display_on : 2 }
	   ]      
	  }
	};
  
	this.htcService.post('notification/search', options).subscribe((result) => {
        this.notices = result.data;     
	}, (err) => {     
		console.log(err);
	});
	  
  }

  submitTeam() {
    this.submittedTeam = true;
    this.teamInfo = null;

    if (this.teamForm.invalid) {
      alert('Please check your inputs.');
      return;
    }

    this.loading = true;

    this.authService.checkTeam(this.teamForm.get('subdomain').value).subscribe((result) => {
      this.teamInfo = result;
      this.loading = false;
      this.loginStep = 2;
    }, (err) => {
      this.loading = false;
      if (err.status === 404) {
        this.alertService.error('Team Name not found');
      } else if (err.status === 400 && err.error.error.code === 40010) {
        this.alertService.error(err.error.error.message);
      } else {
        this.alertService.error(ErrorMessages.login_team_error);
      }
    });
  }

  submitLogin(event) {
    event.preventDefault();
    this.submittedLogin = true;
    if (!this.teamInfo) {
      this.alertService.error('Please check your team.');
      this.loginStep = 1;
    }

    if (this.loginForm.invalid) {
      alert('Please check your inputs.');
      return;
    }

    this.loading = true;

    const data = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
      _account_id: this.teamInfo.data._account_id,
      device: Utils.getDeviceName()
    };

    this.authService.login(data).pipe(first())
      .subscribe(
        (result) => {
          if (result) {

            // get account information
            this.htcService.getByIdWithHeader('account', result._account_id, result).subscribe((resAccount) => {
              if (resAccount.count > 0) {

                // get user information
                this.htcService.getByIdWithHeader('user', result._user_id, result).subscribe((resUser) => {
                  if (resUser.count > 0) {
                    this.authService.setToken(result.token);
                    this.authService.setCurrentAccount(resAccount.data);
					console.log(resAccount.data);
                    this.authService.setCurrentUser(resUser.data);
                    this.authService.setLoggedIn();
                    this.loading = false;
                    
					this.isMainAdmin = this.authService.isMainAdmin();
					this.accountType = this.authService.getAccountType();
					if(this.isMainAdmin==true && this.accountType==null){
						this.router.navigate(['/dashboard/account-type']);
					}else{
					// if(resAccount.data){
						this.router.navigate(['/dashboard/summary']);
					// }else{
					// }
					}
					
                  } else {
                    this.loading = false;
                    this.alertService.error('Error occured while get user information.');
                  }
                }, () => {
                  this.loading = false;
                  this.alertService.error('Error occured while get user information.');
                });

              } else {
                this.loading = false;
                this.alertService.error('Error occured while get account information.');
              }
            }, () => {
              this.loading = false;
              this.alertService.error('Error occured while get account information.');
            });
          } else {
            this.loading = false;
            this.alertService.error('Error occured while login.');
          }
        },
        error => {
          if (error.status === 400
            && error.error.error
            && error.error.error.name === 'User Not Active') {
              this.router.navigate(['/not-verified']);
          } else if (error.error.error.message) {
            this.alertService.error(error.error.error.message);
          } else {
            this.alertService.error('Error occured while login.');
          }

          this.loading = false;
        });
  }

  goFirst($event) {
    $event.preventDefault();
    this.loginStep = 1;
  }

  get loginControls() {
    return this.loginForm.controls;
  }

  isInvalid(form, field, submitted) {
    return ((submitted || form.get(field).touched) && form.get(field).errors);
  }
}
