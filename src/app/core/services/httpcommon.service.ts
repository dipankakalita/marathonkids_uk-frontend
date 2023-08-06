import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from '../../config';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as Utils from 'src/app/core/helpers/utils';

@Injectable()
export class HttpCommonService {
    constructor(
        private http: HttpService,
        private httpClient: HttpClient,
    ) { }

    get(collection): Observable<any> {
        return this.http.get(`${config.apiUrl}/${collection}`);
    }

    getById(collection, id): Observable<any> {
        return this.http.get(`${config.apiUrl}/${collection}/${id}`);
    }

    getByIdWithHeader(collection, id, header): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-private': 'true',
            'x-account-id': header._account_id,
            Authorization: `Bearer ${header.token}`
        });

        return this.httpClient.get(`${config.apiUrl}/${collection}/${id}`, { headers }).pipe(map(response => response));
    }

    post(collection, params: any): Observable<any> {
        return this.http.post(`${config.apiUrl}/${collection}`, params);
    }
	post1(collection, params: any): Observable<any> {
		
      
		return this.http.post1(`${config.apiUrl}/${collection}`, params);
	}
    upload(collection, params: any): Observable<any> {
        return this.http.upload(`${config.apiUrl}/${collection}`, params);
    }

    update(collection, id, params: any): Observable<any> {
        if (id == null) {
            return this.http.put(`${config.apiUrl}/${collection}`, params);
        } else {
            return this.http.put(`${config.apiUrl}/${collection}/${id}`, params);
        }
    }

    delete(collection, id: number): Observable<any> {
        return this.http.delete(`${config.apiUrl}/${collection}/${id}`);
    }

    deprecated_get(collection, options?): Observable<any> {
        let url = `${config.apiUrl}/${collection}`;

        if (options) {
            const params = Utils.serializeParams(options);
            url += `?${params}`;
        }

        return this.http.get(url);
    }

}
