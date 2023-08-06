import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountTypeComponent } from './account-type.component';

const routes: Routes = [
    {
        path     : '',
        component: AccountTypeComponent,
        children : []
    },
    {
        path     : '**',
        redirectTo: '/dashboard/support'
    }
];

@NgModule({
	declarations: [AccountTypeComponent],
    imports     : [
        RouterModule.forChild(routes),
    ],
})
export class AccountTypeModule { }
