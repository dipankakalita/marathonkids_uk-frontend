import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { config } from '../../config';
import { HttpService } from './http.service';
import * as CryptoJS from 'crypto-js';
import * as _ from 'lodash';
import { Accounts } from '../enums';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    isLoggedIn = false;

    private curAccountInfo = new BehaviorSubject<any>(this.getCurrentAccount());
    currentAccount = this.curAccountInfo.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router,
        private httpService: HttpService
    ) {
        if (!!this.getToken()) {
            try {
                this.setCurrentAccount(this.getCurrentAccount());
                this.isLoggedIn = true;
            } catch (error) {
                this.logout();
            }
        }
    }

    login(params): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-private': 'true',
            'x-account-id': params._account_id,
            Authorization: 'Basic ' + btoa(`${params.email}:${params.password}`)
        });

        return this.http.post<any>(`${config.apiUrl}/auth/login`, params, { headers })
            .pipe(map(result => {
                if (result) {
                    const data = result.data;
                    if (data.token) {
                        return {
                            token: data.token,
                            _account_id: data.__account_id,
                            _user_id: data._id
                        };
                    }
                }

                return null;
            }));
    }

    // update last login date when visit the site.
    updateLoginDate() {
        if (this.isLoggedIn) {
            const curAccount = this.getCurrentUser();
            const data = {
                last_login: new Date()
            };
            this.httpService.put(`${config.apiUrl}/account/${curAccount.account._id}`, data).subscribe();
        }
    }

    checkTeam(teamName): Observable<boolean> {
        return this.httpService.get(`${config.apiUrl}/auth/checkteam/${teamName}`);
    }

    logout(isRedirect = true): void {
        // remove account from local storage to log account out
        this.clear();
        this.isLoggedIn = false;
        if (isRedirect) {
            this.router.navigate(['/login']);
        }
    }

    emailConfirm(confirmId): Observable<any> {
        return this.http.post(`${config.apiUrl}/auth/confirm/${confirmId}`, {});
    }

    appEmailConfirm(confirmId): Observable<any> {
        return this.http.post(`${config.apiUrl}/auth/app-confirm/${confirmId}`, {});
    }

    teamNameRequest(params): Observable<any> {
        return this.http.post(`${config.apiUrl}/auth/forgot_teamname`, params);
    }

    resetPwdRequest(params): Observable<any> {
        return this.http.post(`${config.apiUrl}/auth/forgot_pwd`, params);
    }

    resetPassword(tokenId, params): Observable<any> {
        return this.http.post(`${config.apiUrl}/auth/reset_pwd/${tokenId}`, params);
    }

    appResetPassword(tokenId, params): Observable<any> {
        return this.http.post(`${config.apiUrl}/auth/parent/confirm/${tokenId}`, params);
    }

    setLoginData(data): void {
        const account = { id: data.__account_id };
        this.setCurrentAccount(account);

        const user = { id: data._id };
        this.setCurrentUser(user);
    }

    setLoggedIn(): void {
        this.isLoggedIn = true;
    }

    setToken(token): void {
        localStorage.setItem('token', token);
    }

    getToken(): any {
        return localStorage.getItem('token');
    }

    setCurrentAccount(account): void {
        const encAccount = this.encryptString(JSON.stringify(account));
        localStorage.setItem('account', encAccount);
        this.curAccountInfo.next(account);
    }

    getCurrentAccount() {
        try {
            let curAccount = localStorage.getItem('account');
            curAccount = this.decryptString(curAccount);
            return JSON.parse(curAccount);
        } catch {
            if (this.isLoggedIn) {
                this.logout();
            }
        }
    }

    setCurrentUser(user): void {
        const encUser = this.encryptString(JSON.stringify(user));
        localStorage.setItem('user', encUser);
        this.curAccountInfo.next(user);
    }

    getCurrentUser(): any {
        try {
            let curAccount = localStorage.getItem('user');
            curAccount = this.decryptString(curAccount);
            return JSON.parse(curAccount);
        } catch {
            if (this.isLoggedIn) {
                this.logout();
            }
        }
    }

    clear(): void {
        localStorage.removeItem('account-type');
        localStorage.removeItem('token');
        localStorage.removeItem('account');
        localStorage.removeItem('user');
        sessionStorage.clear();
        this.isLoggedIn = false;
    }

    isMainAdmin(): boolean {
        return this.checkUserType('58cbc4407d391b1b49591ad5');
    }

    isAccountAdmin(): boolean {
        return this.checkUserType('58cbc4407d391b1b49591ad6');
    }

    isAdmin(): boolean {
        return this.checkUserType('58cbc4407d391b1b49591ad7');
    }

    isLimited(): boolean {
        return this.checkUserType('58cbc4407d391b1b49591ad8');
    }

    isKrfAccount(): boolean {
        const curAccount = this.getCurrentAccount();
        return curAccount._id === Accounts.krfAccount;
    }

    checkUserType(profileId): boolean {
        const curUser: any = this.getCurrentUser();
        if (curUser) {
            if (curUser.account) {
                const curProfileId = curUser.account._profile_id;
                return (curProfileId === profileId);
            }
        }

        return false;
    }

    hasPermission(permissions): boolean {
        const user: any = this.getCurrentUser();
        let result = false;

        permissions = permissions || [];
        if (!_.isArray(permissions)) { permissions = [permissions]; }

        if (permissions.length === 0 || _.get(user, '__permissions.god', false) || _.get(user, '__permissions.God', false)) {
            return true;
        } else if (permissions.length === 1 && _.get(user, '__permissions[' + permissions[0] + ']') !== undefined) {
            result = user.__permissions[permissions[0]];
            return result;
        } else {
            let orResult = false;
            _.forEach(permissions, (or) => {
                if (_.isArray(or)) {
                    let andResult = true;
                    _.forEach(or, (and) => {
                        if (_.get(user, '__permissions[' + and + ']', false)) {
                        } else {
                            andResult = false;
                        }
                    });
                    orResult = andResult;
                } else {
                    if (_.get(user, '__permissions[' + or + ']', false)) {
                        orResult = true;
                    }
                }
            });
            result = orResult;
        }
        return result;
    }

    encryptString(input) {
        return CryptoJS.AES.encrypt(input, 'secret_jwt').toString();
    }

    decryptString(input) {
        return CryptoJS.AES.decrypt(input, 'secret_jwt').toString(CryptoJS.enc.Utf8);
    }
    setAccountType(type): void {
        localStorage.setItem('account-type', type);
    }

    getAccountType(): any {
        return localStorage.getItem('account-type');
    }
}
