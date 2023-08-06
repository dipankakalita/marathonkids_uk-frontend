import { Component, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-error-404',
    templateUrl: './error-404.component.html',
    styleUrls: ['./error-404.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class Error404Component {
    /**
     * Constructor
     */
    constructor(private location: Location) { }

    redirectBack(e): void {
        e.preventDefault();
        this.location.back();
    }
}
