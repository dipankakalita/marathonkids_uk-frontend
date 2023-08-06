import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedDataService } from './shared_data.service';
import { config } from '../../config';

@Injectable()
export class YearService {
    constructor(
        private http: HttpService,
        private sharedDataService: SharedDataService
    ) { }

    getYears(): Observable<any> {
        if (this.sharedDataService.years) {
            return of(this.sharedDataService.years);
        } else {
            const options = {
                by: {
                    end_date: 'asc'
                },
                where: {
                    deleted: false
                }
            };

            return this.http.post(`${config.apiUrl}/year/getAll`, options).pipe(map((result) => {
                if (result && result.count > 0) {
                    this.sharedDataService.years = result.data;
                } else {
                    this.sharedDataService.years = null;
                }
                return this.sharedDataService.years;
            }));
        }
    }
}
