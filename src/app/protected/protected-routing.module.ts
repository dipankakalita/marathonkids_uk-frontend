import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProtectedLayoutComponent } from './layout/protected-layout/protected-layout.component';

const routes: Routes = [
  {
    path: 'print-custom-certificate',
    loadChildren: () => import('./print-custom-certificate/print-certificate.module').then(mod => mod.PrintCertificateModule)
  },
  {
    path: 'print-pts-certificate',
    loadChildren: () => import('./print-pts-certificate/print-pts-certificate.module').then(mod => mod.PrintPTSCertificateModule)
  },
  {
    path: 'print-pair-runner',
    loadChildren: () => import('./print-pair-runner/print-pair-runner.module').then(mod => mod.PrintPairRunnerModule)
  },
  {
    path: 'account-type',
    loadChildren: () => import('./account-type/account-type.module').then(mod => mod.AccountTypeModule)
  },
  {
    path: '', component: ProtectedLayoutComponent,
    children: [
      {
        path: 'summary',
        loadChildren: () => import('./summary/summary.module').then(mod => mod.SummaryModule),
      },
      {
        path: 'event',
        loadChildren: () => import('./event/event.module').then(mod => mod.EventModule)
      },
      {
        path: 'school',
        loadChildren: () => import('./school/school.module').then(mod => mod.SchoolModule)
      },
      {
        path: 'parent',
        loadChildren: () => import('./parent/parent.module').then(mod => mod.ParentModule)
      },
      {
        path: 'leaderboard',
        loadChildren: () => import('./leaderboard/leaderboard.module').then(mod => mod.LeaderboardModule)
      },
      {
        path: 'run',
        loadChildren: () => import('./run/run.module').then(mod => mod.RunModule)
      },
      {
        path: 'runner',
        loadChildren: () => import('./runner/runner.module').then(mod => mod.RunnerModule)
      },
      {
        path: 'certificate',
        loadChildren: () => import('./certificate/certificate.module').then(mod => mod.CertificateModule)
      },
      {
        path: 'country',
        loadChildren: () => import('./country/country.module').then(mod => mod.CountryModule)
      },
      {
        path: 'county',
        loadChildren: () => import('./county/county.module').then(mod => mod.CountyModule)
      },
      {
        path: 'town',
        loadChildren: () => import('./town/town.module').then(mod => mod.TownModule)
      },
      {
        path: 'year',
        loadChildren: () => import('./year/year.module').then(mod => mod.YearModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(mod => mod.UserModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./forms/forms.module').then(mod => mod.FormsModule)
      },
      {
        path: 'course',
        loadChildren: () => import('./course/course.module').then(mod => mod.CourseModule)
      },
      {
        path: 'audit',
        loadChildren: () => import('./audit/audit.module').then(mod => mod.AuditModule)
      },
      {
        path: 'support',
        loadChildren: () => import('./support/support.module').then(mod => mod.SupportModule)
      },
	  {
        path: 'parkEvent',
        loadChildren: () => import('./park-event/park-event.module').then(mod => mod.ParkEventModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./notifications/notifications.module').then(mod => mod.NotificationsModule),
      },
      {
        path: '**',
        redirectTo: '/dashboard/account-type'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
