import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Report, ReportStatus } from '../api/customer';
import { environment } from 'src/environments/environment';

export interface ServerStatus {
    storageUsage: number;
    cpuUsage: number;
    memoryUsage: number;
  }

@Injectable()
export class ComponentService {
    findSearch: any = [];
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    constructor(private http: HttpClient) {}

    getComponentsArcTotal() {
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

    getComponentsData(body: { keyword: string } | undefined) {
        const url = `${environment.backendUrl}/report/result-individual`;
        return this.http
            .post<ReportStatus>(url, body, { headers: this.headers })
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

    getNeracaBank() {
        const url = `${environment.backendUrl}/report/result-total`;
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

    getLabaRugiTotal() {
        const url = `${environment.backendUrl}/report/result-total-laba`;
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

    getMissingData() {
        const url = `${environment.backendUrl}/report/total-missing`;
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

    getOperatorData() {
        const url = `${environment.backendUrl}/report/operator`;
        return this.http.get(url, { headers: this.headers }).toPromise();
    }

    getBankData() {
        const url = `${environment.backendUrl}/report/bank`;
        return this.http.get(url, { headers: this.headers }).toPromise();
    }

    getServerStatus() {
        const url = `${environment.backendUrl}/report/server-status`;
        return this.http.get<ServerStatus>(url, { headers: this.headers });
    }

}
