/* tslint:disable:component-selector */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: '[app-th-sort]',
    templateUrl: './th-sort.component.html',
    styleUrls: ['./th-sort.component.scss']
})

export class ThSortComponent implements OnInit {
    @Input() colName;
    @Input() defaultDirection;
    @Output() sort = new EventEmitter();
    direction = '';

    constructor() { }

    ngOnInit(): void {
        if (this.defaultDirection) {
            this.direction = this.defaultDirection;
        }
    }

    onChangeSort() {
        switch (this.direction) {
            case '':
                this.direction = 'asc';
                break;
            case 'asc':
                this.direction = 'desc';
                break;
            case 'desc':
                this.direction = '';
                break;
        }

        this.sort.emit(this.direction);
    }
}
