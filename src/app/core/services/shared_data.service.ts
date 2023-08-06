import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SharedDataService {

    years: any;

    constructor(
    ) { }


    setCertToken(data): void {
        localStorage.setItem('certify_token', JSON.stringify(data));
    }

    getCertToken(): any {
        const data = localStorage.getItem('certify_token');
        return JSON.parse(data);
    }

    certClear(): void {
        localStorage.removeItem('certify_token');
    }

    setSchoolFilter(data): void {
        sessionStorage.setItem('school_filter', JSON.stringify(data));
    }

    getSchoolFilter(): any {
        const data = sessionStorage.getItem('school_filter');
        return JSON.parse(data);
    }

    schoolFilterClear(): void {
        sessionStorage.removeItem('school_filter');
    }
}
