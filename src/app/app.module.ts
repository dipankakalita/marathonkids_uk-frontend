import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
// import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import 'hammerjs';

import { AppRoutingModule } from './app-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule,  } from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { SharedAppModule } from './shared/shared.app.module';
import { CookieService } from 'ngx-cookie-service';

import { AuthGuard, PublicGuard } from './core/guards';

import { AppComponent } from './app.component';
import { MaintenanceComponent } from './public/maintenance/maintenance.component';
import { AlertService } from './core/services';
import { CdkColumnDef } from '@angular/cdk/table';
// import { AccountTypeComponent } from './protected/account-type/account-type.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    MaintenanceComponent,
    // AccountTypeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedAppModule,
    HttpClientModule,

    // material modue
    MatSnackBarModule,
	MatRadioModule,
    MatProgressBarModule
  ],
  providers: [
    AuthGuard,
    PublicGuard,
    AlertService,
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    CdkColumnDef,
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }