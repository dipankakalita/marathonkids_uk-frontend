import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedRoutingModule } from './protected-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SettingFormModule } from './setting/setting.module';
import { ProfileFormModule } from './profile/profile.module';
import { AutoRunScanDlgModule } from './layout/protected-header/automated-run-scan/automated-run-scan-dialog.module';
import { UpgradePkgDlgModule } from './layout/protected-header/upgrade-package-dialog/upgrade-package-dialog.module'; 
import { FlexLayoutModule } from '@angular/flex-layout';

import { ProtectedLayoutComponent } from './layout/protected-layout/protected-layout.component';
import { ProtectedHeaderComponent } from './layout/protected-header/protected-header.component';
import { ProtectedAdminHeaderComponent } from './layout/protected-admin-header/protected-admin-header.component';
import { ProtectedFooterComponent } from './layout/protected-footer/protected-footer.component';
import { ProtectedSideMenuComponent } from './layout/protected-sidemenu/protected-sidemenu.component';
import { SharedAppModule } from '../shared/shared.app.module';
import { ReregistrationDlgModule } from './layout/reregistration/reregistration.module';
import { NewYearDlgModule } from './layout/dialogs/newyear-dlg/newyear-dialog.module';
import { NewYearLiteDlgModule } from './layout/dialogs/newyear-lite-dlg/newyear-lite-dialog.module';
import { PreNewYearDlgModule } from './layout/dialogs/pre-newyear-dlg/pre-newyear-dialog.module';
import { PreNewYearConfirmDlgModule } from './layout/dialogs/pre-newyear-confirm-dlg/pre-newyear-confirm-dialog.module';
import { YearService } from '../core/services';

@NgModule({
  imports: [
    CommonModule,
    ProtectedRoutingModule,
    SettingFormModule,
    ProfileFormModule,
	AutoRunScanDlgModule,
	UpgradePkgDlgModule,
    SharedAppModule,

    FlexLayoutModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,

    ReregistrationDlgModule,
    NewYearDlgModule,
    NewYearLiteDlgModule,
    PreNewYearDlgModule,
    PreNewYearConfirmDlgModule
  ],
  declarations: [
    ProtectedLayoutComponent,
    ProtectedHeaderComponent,
    ProtectedAdminHeaderComponent,
    ProtectedFooterComponent,
    ProtectedSideMenuComponent,
  ],
  providers: [
    YearService
  ],
  entryComponents: [
  ]
})
export class ProtectedModule { }
