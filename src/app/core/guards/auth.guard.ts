import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService, AlertService, HttpCommonService } from '../services';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService,
        private alertService: AlertService,
        private htcService: HttpCommonService
    ) { }

    canActivate(): Observable<boolean> {
        console.log('auth guard call');
        if (this.authService.isLoggedIn) {
            this.alertService.setAppLoading();
            const curUserId = this.authService.getCurrentUser()._id;
            const curAccountId = this.authService.getCurrentAccount()._id;

            const getUserServices = forkJoin([
                this.htcService.getById('user', curUserId),
                this.htcService.getById('account', curAccountId)
            ]);

            return getUserServices.pipe(map((responseList) => {
                this.alertService.clearAppLoading();
                const userInfo = responseList[0];
                if (userInfo.count > 0) {
                    this.authService.setCurrentUser(userInfo.data);
                } else {
                    return false;
                }

                const accountInfo = responseList[1];
                if (accountInfo.count > 0) {
                    this.authService.setCurrentAccount(accountInfo.data);
                } else {
                    return false;
                }

                return true;
            }, (err) => {
                this.alertService.clearAppLoading();
                return false;
            }));
        } else {
            console.log('auth logged out');
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/login']);
            return of(false);
        }
    }
}
