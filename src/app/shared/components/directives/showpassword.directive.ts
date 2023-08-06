import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[appShowPassword]'
})
export class AppPasswordDirective {
    private bShown = false;

    constructor(private el: ElementRef) {
        this.setup();
    }

    toggle(icon: HTMLElement) {
        this.bShown = !this.bShown;
        if (this.bShown) {
            this.el.nativeElement.setAttribute('type', 'text');
            icon.setAttribute('class', 'fa fa-eye-slash');
        } else {
            this.el.nativeElement.setAttribute('type', 'password');
            icon.setAttribute('class', 'fa fa-eye');
        }
    }

    setup() {
        setTimeout(() => {
            const parent = this.el.nativeElement.parentNode;
            const label = document.createElement('label');
            label.setAttribute('class', 'input_glyph-wrapper password-eye');
            const icon = document.createElement('i');
            icon.setAttribute('class', 'fa fa-eye');
            label.appendChild(icon);
            label.addEventListener('click', (event) => {
                this.toggle(icon);
            });
            parent.appendChild(label);
        });
    }
}
