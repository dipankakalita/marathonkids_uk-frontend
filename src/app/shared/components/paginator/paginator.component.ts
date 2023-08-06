import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss']
})

export class PaginatorComponent implements OnInit {

    @Input() initialPage;
    @Input() length;
    @Input() pageSize;
    @Output() page = new EventEmitter();

    public pageIndex = 1;
    public pageNumber;

    constructor() { }

    ngOnInit(): void {
        if (this.initialPage) {
            this.pageIndex = this.initialPage;
        }
    }

    get pageCount(): number {
        return Math.ceil(this.length / this.pageSize);
    }

    onPrevious() {
        if (this.pageIndex > 1) {
            this.pageIndex--;

            this.page.emit({pageIndex: this.pageIndex});
        }
    }

    onForward() {
        if (this.pageIndex < this.pageCount) {
            this.pageIndex++;

            this.page.emit({pageIndex: this.pageIndex});
        }
    }

}
