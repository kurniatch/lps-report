import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Report, ReportStatus } from '../api/customer';
import { environment } from 'src/environments/environment';

@Injectable()
export class OlderService {
    findSearch: any = [];
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    constructor(private http: HttpClient) {}

    getOlderTotal() {
        console.log('header : ', this.headers);
        const url = `${environment.backendUrl}/older/result-total`;
        return this.http
            .get<Report[]>(url, { headers: this.headers })
            .toPromise()
            .then((data) => {
                if (data) {
                    return data;
                } else {
                    throw new Error('Failed to fetch older data.');
                }
            });
    }

    getOlder() {
        const url = `${environment.backendUrl}/older/result`;
        return this.http
            .get<Report[]>(url, { headers: this.headers })
            .toPromise()
            .then((data) => {
                if (data) {
                    return data;
                } else {
                    throw new Error('Failed to fetch older data.');
                }
            });
    }

    removeOlder(data: any) {
        const url = `${environment.backendUrl}/older/remove`;
        return this.http
            .delete(url, { headers: this.headers, body: JSON.stringify(data) })
            .toPromise();
    }

    removeOlder2(data: any) {
        const url = `${environment.backendUrl}/older/remove-2`;
        return this.http
            .delete(url, { headers: this.headers, body: JSON.stringify(data) })
            .toPromise();
    }

    getOperatorData() {
        const url = `${environment.backendUrl}/older/operator`;
        return this.http.get(url, { headers: this.headers }).toPromise();
    }
}
