import { Component, OnInit } from '@angular/core';
import { config } from 'src/app/config';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/core/services';

@Component({
  selector: 'app-protected-footer',
  templateUrl: './protected-footer.component.html',
  styleUrls: ['./protected-footer.component.scss']
})
export class ProtectedFooterComponent implements OnInit {

  curAccount;

  constructor(
    private cookieService: CookieService,
    public authService: AuthService
  ) {
    this.curAccount = this.authService.getCurrentAccount();
  }

  ngOnInit(): void {

  }

  onRunnerExport(event, type) {
    event.preventDefault();
    this.cookieService.deleteAll('/');
    const min = 5555;
    const max = 555555;
    const token = Math.floor(Math.random() * (max - min + 1)) + min;
    const runnerExportDetail = {
      headers: {
        authorization: `bearer ${this.authService.getToken()}`
      },
      params: {
        collection: type
      },
      query: { where: { deleted: false } }
    };

    this.cookieService.set(token.toString(), JSON.stringify(runnerExportDetail), 1, '/');
    window.open(`${config.apiUrl}/download/${token}.csv`, '_blank');
  }
}
