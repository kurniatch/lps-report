import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class LocationService {
    findSearch: any = [];
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    constructor(private http: HttpClient) {}

    getLocationAll(params: { page: string; perPage: string } | undefined) {
        const url = `${environment.backendUrl}/location/all`;
        return this.http
            .get<any[]>(url, { params, headers: this.headers })
            .toPromise()
            .then((data) => {
                if (data) {
                    return data;
                } else {
                    throw new Error('Failed to fetch components data.');
                }
            });
    }

    getLocationAllCount() {
        const url = `${environment.backendUrl}/location/all/count`;
        return this.http
            .get<number>(url, { headers: this.headers })
            .toPromise()
            .then((data) => {
                if (data) {
                    return data;
                } else {
                    throw new Error('Failed to fetch components data.');
                }
            });
    }

    getLocationAllSearch(body: { keyword: string } | undefined) {
        const url = `${environment.backendUrl}/location/search`;
        console.log('body keyword', body?.keyword);
        return this.http
            .post(url, body, { headers: this.headers })
            .toPromise()
            .then((data) => {
                if (data) {
                    this.findSearch = data;
                    return this.findSearch;
                } else {
                    throw new Error('Failed to fetch components data.');
                }
            });
    }

    updateLocation(data: any) {
        const url = `${environment.backendUrl}/location/update`;
        return this.http
            .post(url, JSON.stringify(data), { headers: this.headers })
            .toPromise();
    }

    createLocation(data: any) {
        const url = `${environment.backendUrl}/location/new`;
        return this.http
            .post(url, JSON.stringify(data), { headers: this.headers })
            .toPromise();
    }

    removeLocation(data: any) {
        const url = `${environment.backendUrl}/location/remove`;
        return this.http
            .delete(url, { headers: this.headers, body: JSON.stringify(data) })
            .toPromise();
    }
}
