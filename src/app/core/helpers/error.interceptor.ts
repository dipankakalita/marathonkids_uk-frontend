import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LogoutDialogComponent } from 'src/app/shared/components/logout-dialog/logout-dialog.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private router: Router,
        private matDialog: MatDialog
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {

            if (err.status === 401) {
                // auto logout if 401 response returned from api
                if (this.authService.isLoggedIn) {
                    if (this.matDialog.openDialogs && this.matDialog.openDialogs.length > 0) {
                        return;
                    }

                    const dialogRef = this.matDialog.open(LogoutDialogComponent, {
                        width: '500px'
                    });

                    dialogRef.afterClosed().subscribe(result => {
                        this.authService.clear();
                        if (result) {
                            this.router.navigate(['/login']);
                        } else {
                            this.router.navigate(['/forgotten-password']);
                        }
                        setTimeout(() => {
                            location.reload(true);
                        }, 1000);
                    });
                }
            }

            return throwError(err);
        }));
    }
}
