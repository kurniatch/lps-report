import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class CrudService {
    findSearch: any = [];
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    constructor(private http: HttpClient) {}

    getComponentsReportTotal() {
        const url = `${environment.backendUrl}/report/total-view`;
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

    getLabaRugiReportTotal() {
        const url = `${environment.backendUrl}/report/result-total-laba`;
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

    getComponentsReport(params: { page: string; perPage: string } | undefined) {
        const url = `${environment.backendUrl}/report/view`;
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

    getLabaRugiReport(params: { page: string; perPage: string } | undefined) {
        const url = `${environment.backendUrl}/report/view-laba-rugi`;
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

    getComponentsReportSearch(body: { keyword: string } | undefined) {
        const url = `${environment.backendUrl}/report/search-bank`;
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

    getLabaRugiReportSearch(body: { keyword: string } | undefined) {
        const url = `${environment.backendUrl}/report/search-laba-rugi`;
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

    updateReport(data: any) {
        const url = `${environment.backendUrl}/report/update-bank`;
        return this.http
            .post(url, JSON.stringify(data), { headers: this.headers })
            .toPromise();
    }

    createReport(data: any) {
        const url = `${environment.backendUrl}/report/new-bank`;
        return this.http
            .post(url, JSON.stringify(data), { headers: this.headers })
            .toPromise();
    }

    removeReport(data: any) {
        const url = `${environment.backendUrl}/report/remove`;
        return this.http
            .delete(url, { headers: this.headers, body: JSON.stringify(data) })
            .toPromise();
    }
    getBankData() {
        const url = `${environment.backendUrl}/report/bank`;
        return this.http.get(url, { headers: this.headers }).toPromise();
    }

    getLabaRugiData() {
        const url = `${environment.backendUrl}/report/laba-rugi`;
        return this.http.get(url, { headers: this.headers }).toPromise();
    }
}
