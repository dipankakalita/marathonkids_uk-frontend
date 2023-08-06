import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services';

@Injectable()
export class PublicGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router) {
  }

  canActivate(): boolean {
    if (this.authService.isLoggedIn) {
      console.log('public guard is logged in');
      this.router.navigate(['/dashboard']);
      return false;
    } else {
      console.log('public guard is not logged in');
      return true;
    }
  }
}
