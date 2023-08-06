import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from '../../config';
import { Observable } from 'rxjs';

@Injectable()
export class ValidationService {
    constructor(private http: HttpService) { }

    validate(collection, params): Observable<any> {
        return this.http.post(`${config.apiUrl}/${collection}/validate`, params);
    }
}
