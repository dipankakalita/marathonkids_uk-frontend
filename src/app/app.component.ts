import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AuthService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kidsrunfree';

  appLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {

    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          setTimeout(() => {
            this.appLoading = true;
          });
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          setTimeout(() => {
            this.appLoading = false;
          });
          break;
        }

        default: {
          break;
        }
      }
    });

    this.authService.updateLoginDate();
  }
}
