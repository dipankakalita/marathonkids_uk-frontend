import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AlertService {
    private appLoading = new Subject<any>();
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(
        private router: Router,
        public snackBar: MatSnackBar) {
        // clear alert message on route change
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }

    success(message: string, keepAfterNavigationChange = false): void {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'success', text: message });
    }

    error(message: string, keepAfterNavigationChange = false): void {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'error', text: message });
    }

    clear(): void {
        this.subject.next();
    }

    setAppLoading(): void {
        this.appLoading.next(true);
    }

    clearAppLoading(): void {
        this.appLoading.next(false);
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    getAppLoading(): Observable<any> {
        return this.appLoading.asObservable();
    }

    openSnackBar(message: string, type: string, duration = 2000): void {
        this.snackBar.open(message, 'X', {
            panelClass: ['style-snack-' + type],
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration
        });
    }
}
