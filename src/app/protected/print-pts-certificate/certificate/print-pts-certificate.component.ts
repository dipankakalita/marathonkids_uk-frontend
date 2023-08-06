import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { SharedDataService } from 'src/app/core/services/shared_data.service';
import { HttpCommonService, AuthService } from 'src/app/core/services';

@Component({
    selector: 'app-dashboard-print-pts-certificate',
    templateUrl: './print-pts-certificate.component.html',
    styleUrls: ['./print-pts-certificate.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PrintPTSCertificateComponent implements OnInit {

    loading = false;

    curAccount;
    certData;
    runners;

    constructor(
        private htcService: HttpCommonService,
        private sharedDataService: SharedDataService,
        private authService: AuthService
    ) {
        this.curAccount = this.authService.getCurrentAccount();
        this.certData = this.sharedDataService.getCertToken();
    }

    ngOnInit() {
        this.loading = true;

        const options = {
            limit: 1000,
            where: {
                _valid_for: this.curAccount._valid_for
            },
            by: {
                last_name: 'asc'
            }
        };

        this.htcService.post('runner/search', options).subscribe((resRunner) => {
            if (resRunner.count > 0) {
                const tmpArr = {};
                for (const item of resRunner.data) {
                    if (!tmpArr[item._form_id]) {
                        tmpArr[item._form_id] = [];
                    }

                    tmpArr[item._form_id].push(item);
                }

                this.runners = tmpArr;

            }
            this.loading = false;
        });

    }

}
