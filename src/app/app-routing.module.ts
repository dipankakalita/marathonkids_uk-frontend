import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards';
import { MaintenanceComponent } from './public/maintenance/maintenance.component';
import { config } from 'src/app/config';

let routes: Routes;

if (config.MAINTENANCE) {
  routes = [
    {path: 'maintenance', component: MaintenanceComponent},
    {path: '**', redirectTo: '/maintenance'}
  ];
} else {
  routes = [
    {
      path: 'account-type',
      loadChildren: () => import('./protected/protected.module').then(mod => mod.ProtectedModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'dashboard',
      loadChildren: () => import('./protected/protected.module').then(mod => mod.ProtectedModule),
      canActivate: [AuthGuard]
    },
    {
      path: '',
      loadChildren: () => import('./public/public.module').then(mod => mod.PublicModule)
    },
  ];
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
