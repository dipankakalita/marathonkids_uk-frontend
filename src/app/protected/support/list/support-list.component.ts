import { Component, OnInit } from '@angular/core';
import { config } from 'src/app/config';
import { AuthService } from 'src/app/core/services';
import { UpgradePkgDlgComponent } from '../../layout/protected-header/upgrade-package-dialog/upgrade-package-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-dashboard-support',
    templateUrl: './support-list.component.html',
    styleUrls: ['./support-list.component.scss']
})
export class SupportListComponent implements OnInit {

    curAccount;
    resourcePath = config.API_RESOURCE_URL;

    constructor( 
		public matDialog: MatDialog,
        private authService: AuthService
	) {
        this.curAccount = this.authService.getCurrentAccount();
    }

    ngOnInit() {
    }

	onUpgrade(event): void {
		event.preventDefault();

		this.matDialog.open(UpgradePkgDlgComponent, {
		  width: '500px'
		});
	}
}
