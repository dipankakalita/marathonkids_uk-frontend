import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfirmDialogModule } from './components/confirm-dialog/confirm-dialog.module';
import { AlertDialogModule } from './components/alert-dialog/alert-dialog.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from '../core/helpers';

import { HttpService, AlertService, HttpCommonService } from '../core/services';

import { LoadingComponent } from './components/loading/loading.component';
import { AlertComponent } from './components/alert/alert.component';
import { NumberTrackerComponent } from './components/number-tracker/number-tracker.component';
import { AppPasswordDirective } from './components/directives/showpassword.directive';
import { NumberOnlyDirective } from './components/directives/number-only.directive';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { ThSortComponent } from './components/th-sort/th-sort.component';
import { LogoutDialogModule } from './components/logout-dialog/logout-dialog.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [
    // components
    AlertComponent,
    LoadingComponent,
    NumberTrackerComponent,
    PaginatorComponent,
    ThSortComponent,

    // directives
    AppPasswordDirective,
    NumberOnlyDirective
  ],
  exports: [
    // Shared Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ConfirmDialogModule,
    AlertDialogModule,
    LogoutDialogModule,

    // Shared Components
    LoadingComponent,
    AlertComponent,
    NumberTrackerComponent,
    PaginatorComponent,
    ThSortComponent,

    // Directives
    AppPasswordDirective,
    NumberOnlyDirective
  ],
  providers: [
    HttpService,
    AlertService,
    HttpCommonService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
})
export class SharedAppModule { }
