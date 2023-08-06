import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { SharedDataService } from 'src/app/core/services/shared_data.service';
import { HttpCommonService, AuthService } from 'src/app/core/services';
import * as Utils from 'src/app/core/helpers/utils';

@Component({
    selector: 'app-dashboard-print-pair-runner',
    templateUrl: './print-pair-runner.component.html',
    styleUrls: ['./print-pair-runner.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PrintPairRunnerComponent implements OnInit {

    loading = false;

    curAccount;
    qrData;
    runners = [];

    constructor(
        private htcService: HttpCommonService,
        private sharedDataService: SharedDataService,
        private authService: AuthService
    ) {
        this.curAccount = this.authService.getCurrentAccount();
        this.qrData = this.sharedDataService.getCertToken();
    }

    ngOnInit() {
        if (this.qrData && this.qrData.type === 'SINGLE') {
            this.runners.push(this.qrData.data);
        } else {
            this.loading = true;

            const options: any = {
                limit: 1000,
                where: {
                    _academic_year_id: this.curAccount._valid_for
                }
            };

            const sortOption = {
                form_name: {
                    direction: 'asc',
                    order: 1
                },
                name: {
                    direction: 'asc',
                    order: 0
                }
            };

            options.by = Utils.getMultiSortOption(sortOption);

            this.htcService.post('runner/search', options).subscribe((result) => {
                this.runners = result.data;
                this.loading = false;
            }, () => {
                this.loading = false;
            });
        }
    }

}
