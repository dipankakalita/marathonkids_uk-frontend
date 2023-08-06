import { Component, OnInit, Input } from '@angular/core';
import { AuthService, HttpCommonService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SettingFormDlgComponent } from '../../setting/setting-form-dialog.component';
import { ProfileFormDlgComponent } from '../../profile/profile-form-dialog.component';
import { AutoRunScanDlgComponent } from '../protected-header/automated-run-scan/automated-run-scan-dialog.component';

@Component({
  selector: 'app-protected-sidemenu',
  templateUrl: './protected-sidemenu.component.html',
  styleUrls: ['./protected-sidemenu.component.scss']
})
export class ProtectedSideMenuComponent implements OnInit {

  @Input() sideMenu;

  curUser;
  accountType;
  curAccount;
  isMainAdmin = false;
  constructor(
    public authService: AuthService,
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
	
  ngOnInit(): void { }

  onGoUrl(event, url): void {
    event.preventDefault();
    this.sideMenu.toggle();
    setTimeout(() => {
      this.router.navigateByUrl(url);
    }, 100);
  }

  onSetting(event): void {
    event.preventDefault();
    this.sideMenu.toggle();

    this.matDialog.open(SettingFormDlgComponent, {
      width: '500px'
    });
  }

  onProfile(event): void {
    event.preventDefault();
    this.sideMenu.toggle();

    this.matDialog.open(ProfileFormDlgComponent, {
      width: '500px'
    });
  }

  onAutoScan(event): void {
    event.preventDefault();

    this.matDialog.open(AutoRunScanDlgComponent, {
      width: '500px'
    });
  }
  
  onLogOut(event): void {
    event.preventDefault();
    this.sideMenu.toggle();

    this.authService.logout();
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }
}
