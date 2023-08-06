import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  constructor(public http: HttpClient) { }

  public get(url, params?): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (params) {
      return this.http.get(url, { headers, params }).pipe(map(response => response));
    } else {
      return this.http.get(url, { headers }).pipe(map(response => response));
    }
  }

  public post(url, params): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const body = JSON.stringify(params);

    return this.http.post(url, body, { headers }).pipe(map(response => response));
  }
  public post1(url, params): Observable<any> {
    //const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	
    const body = JSON.stringify(params);

    return this.http.post(url, body, {
		responseType: "blob",
		headers: new HttpHeaders().append("Content-Type","application/json")
	  }).pipe(map(response => response));
  }
  public put(url, params): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = JSON.stringify(params);

    return this.http.put(url, body, { headers }).pipe(map(response => response));
  }

  public delete(url): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.delete(url, { headers }).pipe(map(response => response));
  }

  public upload(url, params): Observable<any> {
    // const headers = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });

    // const body = JSON.stringify(params);

    return this.http.post(url, params).pipe(map(response => response));
  }

  public download(url, params): Observable<Blob> {
    const body = JSON.stringify(params);

    const h = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const options: {} = {
      headers: h,
      responseType: 'blob'
    };

    return this.http.post(url, body, options).pipe(map((response: any) => (new Blob([response]))));
  }

  private generateUrl(url) {
    const rnd = new Date().getTime();

    if (url.includes('?')) {
      url += `&rnd=${rnd}`;
    } else {
      url += `?rnd=${rnd}`;
    }

    return url;
  }

}
