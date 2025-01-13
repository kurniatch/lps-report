import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Report, ReportStatus } from '../api/customer';
import { environment } from 'src/environments/environment';

@Injectable()
export class ComponentService {
    findSearch: any = [];
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    constructor(private http: HttpClient) {}

    getComponentsArcTotal() {
        console.log('header : ', this.headers);
        const url = `${environment.backendUrl}/report/result-total`;
        return this.http
            .get<Report[]>(url, { headers: this.headers })
            .toPromise()
            .then((data) => {
                if (data) {
                    console.log('data : ', data);
                    return data;
                } else {
                    throw new Error('Failed to fetch report data.');
                }
            });
    }

    getComponentsArc() {
        const url = `${environment.backendUrl}/report/result`;
        return this.http
            .get<Report[]>(url, { headers: this.headers })
            .toPromise()
            .then((data) => {
                if (data) {
                    return data;
                } else {
                    throw new Error('Failed to fetch report data.');
                }
            });
    }

    getComponentsArcStatus() {
        const url = `${environment.backendUrl}/report/total-status`;
        return this.http
            .get<ReportStatus[]>(url, { headers: this.headers })
            .toPromise()
            .then((data) => {
                if (data) {
                    return data;
                } else {
                    throw new Error('Failed to fetch status data.');
                }
            });
    }

    removeReportArc(data: any) {
        const url = `${environment.backendUrl}/report/add-old`;
        return this.http
            .post(
                url,
                { body: JSON.stringify(data) },
                { headers: this.headers }
            )
            .toPromise();
    }

    getComponentsArcStatusNull() {
        const url = `${environment.backendUrl}/report/total-status-null`;
        return this.http.get(url, { headers: this.headers }).toPromise();
    }

    getComponentsArcStatusGeneral() {
        const url = `${environment.backendUrl}/report/total-status-general`;
        return this.http.get(url, { headers: this.headers }).toPromise();
    }

    getOperatorData() {
        const url = `${environment.backendUrl}/report/operator`;
        return this.http.get(url, { headers: this.headers }).toPromise();
    }
}
