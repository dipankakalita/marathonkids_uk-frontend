import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';

import { SharedDataService } from 'src/app/core/services/shared_data.service';
import { HttpCommonService } from 'src/app/core/services';
import { MatDialog } from '@angular/material/dialog';
import { CertifyDialogComponent } from '../certify-dialog/certify-dialog.component';

@Component({
    selector: 'app-dashboard-print-certificate',
    templateUrl: './print-certificate.component.html',
    styleUrls: ['./print-certificate.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PrintCertificateComponent implements OnInit {

    loading = false;

    certData;
    certificates = [];

    constructor(
        private sharedDataService: SharedDataService,
        private htcService: HttpCommonService,
        private matDialog: MatDialog
    ) {
        this.certData = this.sharedDataService.getCertToken();

        if (this.certData) {
            const filter = this.certData.filter;
            if (filter && filter.where && !filter.where.printed && localStorage.getItem('never_show') !== 'true') {
                this.openConfirmDlg(this.certData.filter.where.printed);
            }

            if (this.certData.type === 'SINGLE') {
                const tempCerts = [];
                tempCerts.push(this.certData.certificate);
                this.certificates = this.calcCertNum(tempCerts);
                if (this.certificates[0]._id) {
                    this.updateCertificate();
                }
            } else {
                this.loading = true;
                this.htcService.post('certificate/search', this.certData.filter).subscribe((result) => {
                    if (result.count > 0) {
                        const resCert = result.data;
                        this.certificates = this.calcCertNum(resCert, 'MULTIPLE');
                        this.updateCertificate();
                    }
                    this.loading = false;
                }, (err) => {
                    this.loading = false;
                    console.log(err);
                });
            }
        }
    }

    updateCertificate() {

        const ids = this.certificates.filter(cert => !(cert.printed)).map(item => item._id);
        const data = { ids };

        this.htcService.update('certificate/set-printed', null, data).subscribe((result) => {
        });
    }

    calcCertNum(certs, type = 'SINGLE') {
        let certNum;
        for (const [i, el] of certs.entries()) {
            if (type === 'MULTIPLE') {
                el.distance = Math.floor((el.distance / 1000) * 10) / 10;
                el.date = new Date();
            }

            certNum = Math.ceil(el.distance / 42.2);
            if (certNum < 1) { certNum = 1; }
            if (certNum > 4) { certNum = 4; }

            certs[i].certNum = certNum;
        }

        return certs;
    }

    openConfirmDlg(type) {
        const dialogRef = this.matDialog.open(CertifyDialogComponent, {
            width: '500px',
            data: {
                printed: type
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
                localStorage.setItem('never_show', result.never_show);
            }
        });
    }

    ngOnInit() {

    }

}
