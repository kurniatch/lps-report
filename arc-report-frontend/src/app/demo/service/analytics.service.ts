import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class AnalyticsService {
    findSearch: any = [];
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    constructor(private http: HttpClient) {}

    getOperatorData() {
        const url = `${environment.backendUrl}/report/operator`;
        return this.http.get(url, { headers: this.headers }).toPromise();
    }

    getAircraftData() {
        const url = `${environment.backendUrl}/report/reg-plane`;
        return this.http.get(url, { headers: this.headers }).toPromise();
    }

    findPlaneData(keyword: any) {
        const url = `${environment.backendUrl}/report/search-plane`;
        const body: { keyword: string } = { keyword };
        return this.http.post(url, body, { headers: this.headers }).toPromise();
    }

    getAcData(keyword: any) {
        const url = `${environment.backendUrl}/report/search-operator`;
        const body: { keyword: string } = { keyword };
        return this.http.post(url, body, { headers: this.headers }).toPromise();
    }
}
