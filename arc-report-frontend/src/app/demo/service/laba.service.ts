import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class LabaService {
    findSearch: any = [];
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    constructor(private http: HttpClient) {}

    getSwiftAll(params: { page: string; perPage: string } | undefined) {
        const url = `${environment.backendUrl}/swift/all`;
        return this.http
            .get<any[]>(url, { params, headers: this.headers })
            .toPromise()
            .then((data) => {
                if (data) {
                    return data;
                } else {
                    throw new Error('Failed to fetch customer data.');
                }
            });
    }

    getSwiftAllCount() {
        const url = `${environment.backendUrl}/swift/all/count`;
        return this.http
            .get<number>(url, { headers: this.headers })
            .toPromise()
            .then((data) => {
                if (data) {
                    return data;
                } else {
                    throw new Error('Failed to fetch customer data.');
                }
            });
    }

    getSwiftAllSearch(body: { keyword: string } | undefined) {
        const url = `${environment.backendUrl}/swift/search`;
        return this.http
            .post(url, body, { headers: this.headers })
            .toPromise()
            .then((data) => {
                if (data) {
                    this.findSearch = data;
                    return this.findSearch;
                } else {
                    throw new Error('Failed to fetch customer data.');
                }
            });
    }

    updateSwift(data: any) {
        const url = `${environment.backendUrl}/swift/update`;
        return this.http
            .post(url, JSON.stringify(data), { headers: this.headers })
            .toPromise();
    }

    createSwift(data: any) {
        const url = `${environment.backendUrl}/swift/new`;
        return this.http
            .post(url, JSON.stringify(data), { headers: this.headers })
            .toPromise();
    }

    removeSwift(data: any) {
        const url = `${environment.backendUrl}/swift/remove`;
        return this.http
            .delete(url, { headers: this.headers, body: JSON.stringify(data) })
            .toPromise();
    }
}
