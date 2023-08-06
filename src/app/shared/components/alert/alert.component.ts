import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss']
})

export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit(): void {
        this.subscription = this.alertService.getMessage().subscribe(message => {
            this.message = message;
        });
    }

    alertDismiss() {
        this.alertService.clear();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
