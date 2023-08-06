import { Component, OnInit } from '@angular/core';
import { AuthService ,HttpCommonService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { SettingFormDlgComponent } from '../../setting/setting-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileFormDlgComponent } from '../../profile/profile-form-dialog.component';
import * as moment from 'moment';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-protected-admin-header',
  templateUrl: './protected-admin-header.component.html',
  styleUrls: ['./protected-admin-header.component.scss']
})
export class ProtectedAdminHeaderComponent implements OnInit {

  curUser;
  curAccount;
  notices; 
  accountType;
  isMainAdmin = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    public matDialog: MatDialog,
    private htcService: HttpCommonService
  ) {
    this.curUser = this.authService.getCurrentUser();
    this.curAccount = this.authService.getCurrentAccount();
    this.accountType = this.authService.getAccountType();
	this.isMainAdmin = this.authService.isMainAdmin();
  }

	showData(type){
		this.authService.setAccountType(type);
		window.location.href = '/dashboard/summary';
	}
	
  ngOnInit(): void {
	  const options: any = {
		  limit: 1,
		  skip: 0,   
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
		  },
		  by: { expiry_date : "desc" }
	  };
	  
	  this.htcService.post('notification/search', options).subscribe((result) => {
		  this.notices = result.data;     
	  }, (err) => {     
		  console.log(err);
	  });
  }

  onSetting(event): void {
    event.preventDefault();

    this.matDialog.open(SettingFormDlgComponent, {
      width: '500px'
    });
  }

  onProfile(event): void {
    event.preventDefault();

    this.matDialog.open(ProfileFormDlgComponent, {
      width: '500px'
    });
  }

  onLogOut(event): void {
    event.preventDefault();

    this.authService.logout();
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }
  
  onDelete(id): void {
		let confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
			disableClose: false,
			maxWidth: '400px'
		});

		confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete this notice?';

		confirmDialogRef.afterClosed().subscribe(result => {
			if (result) {
			  this.notices = [];
			}
			confirmDialogRef = null;
		});
   }
}
