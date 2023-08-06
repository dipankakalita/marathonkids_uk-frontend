import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedAppModule } from 'src/app/shared/shared.app.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { ValidationService } from '../core/services';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegStep1Component } from './register/step1/reg-step1.component';
import { RegStep2Component } from './register/step2/reg-step2.component';
import { RegStep3Component } from './register/step3/reg-step3.component';
import { RegStep4Component } from './register/step4/reg-step4.component';
import { EmailConfirmComponent } from './email-confirm/email-confirm.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotTeamComponent } from './forgot-team/forgot-team.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NotVerifiedComponent } from './not-verified/not-verified.component';
import { AppEmailConfirmComponent } from './app-email-confirm/app-email-confirm.component';
import { PublicGuard } from '../core/guards';
import { AppResetPasswordComponent } from './app-reset-password/app-reset-password.component';
import { InviteComponent } from './invite/invite.component';
import { LegalComponent } from './legal/legal.component';
import { TermsComponent } from './terms/terms.component';
import { AppPrivacyPolicyComponent } from './app-privacy-policy/app-privacy-policy.component';
import { AppPermissionLetterComponent } from './app-permission-letter/app-permission-letter.component';

const routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [PublicGuard]
  },
  {
    path: 'registration',
    component: RegisterComponent,
    canActivate: [PublicGuard]
  },
  {
    path: 'forgotten-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'forgotten-team',
    component: ForgotTeamComponent
  },
  {
    path: 'new-password',
    component: ResetPasswordComponent
  },
  {
    path: 'app-password',
    component: AppResetPasswordComponent
  },
  {
    path: 'not-verified',
    component: NotVerifiedComponent,
    canActivate: [PublicGuard]
  },
  {
    path: 'invite',
    component: InviteComponent
  },
  {
    path: 'confirm',
    component: EmailConfirmComponent
  },
  {
    path: 'app-confirm',
    component: AppEmailConfirmComponent
  },
  {
    path: 'legal',
    component: LegalComponent
  },
  {
    path: 'terms',
    component: TermsComponent
  },
  {
    path: 'app-privacy-policy',
    component: AppPrivacyPolicyComponent
  },
  {
    path: 'app-permission-letter',
    component: AppPermissionLetterComponent
  },
  {
    path: '**',
    redirectTo: '/login',
    canActivate: [PublicGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedAppModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    NgxMatSelectSearchModule,
    MatIconModule
  ],
  declarations: [
    LoginComponent,

    // register
    RegisterComponent,
    RegStep1Component,
    RegStep2Component,
    RegStep3Component,
    RegStep4Component,

    EmailConfirmComponent,
    AppEmailConfirmComponent,
    ForgotPasswordComponent,
    ForgotTeamComponent,
    ResetPasswordComponent,
    AppResetPasswordComponent,
    NotVerifiedComponent,
    InviteComponent,
    LegalComponent,
    TermsComponent,
    AppPrivacyPolicyComponent,
    AppPermissionLetterComponent
  ],
  providers: [
    ValidationService
  ]
})
export class PublicModule { }
