import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // add authorization header with jwt token if available
        const token = this.authService.getToken();
        const account = this.authService.getCurrentAccount();
        const header: any = {};

        if (token) {
            header.Authorization = `Bearer ${token}`;
        }

        if (account) {
            header['x-private'] = 'true';
            header['x-account-id'] = account._id;
        }

        if (token || account) {
            request = request.clone({
                setHeaders: header
            });
        }

        return next.handle(request);
    }
}
