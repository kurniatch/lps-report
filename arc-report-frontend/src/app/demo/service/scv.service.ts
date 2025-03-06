import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Report, ReportStatus } from '../api/customer';
import { environment } from 'src/environments/environment';

@Injectable()
export class ScvService {
    findSearch: any = [];
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    constructor(private http: HttpClient) {}

    getComponentsReport(params: { page: string; perPage: string } | undefined) {
        const url = `${environment.backendUrl}/scv/view`;
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

    getComponentsReportTotal() {
        const url = `${environment.backendUrl}/scv/total-view`;
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

    getComponentsReportSearch(body: { keyword: string} | undefined) {
        const url = `${environment.backendUrl}/scv/search-scv`;
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

    getBankPeriode(body: { keyword: string} | undefined) {
        const url = `${environment.backendUrl}/scv/search-bank-periode`;
        return this.http.post(url, body, { headers: this.headers }).toPromise();
    }

    getDataReport(params: { keyword: string;} | undefined) {
        const url = `${environment.backendUrl}/scv/report-data`;
        return this.http.get<any[]>(url, {params, headers: this.headers }).toPromise();
    }

    getDataReportPeriod(params: { keyword: string, period: string} ) {
        const url = `${environment.backendUrl}/scv/report-data-period`;
        return this.http.get<any[]>(url, {params, headers: this.headers }).toPromise();
    }

    createReport(data: any) {
        const url = `${environment.backendUrl}/scv/new-scv`;
        return this.http
            .post(url, JSON.stringify(data), { headers: this.headers })
            .toPromise();
    }

    importDataCsv(file: File): Promise<any> {
        const url = `${environment.backendUrl}/scv/import-scv`;
      
        console.log('Request URL:', url);
      
        const formData = new FormData();
        formData.append('file', file, file.name);
      
        let headers = this.headers.keys().reduce((acc, key) => {
          if (key.toLowerCase() !== 'content-type') {
            acc = acc.set(key, this.headers.get(key) as string);
          }
          return acc;
        }, new HttpHeaders());
    
        console.log('Request Headers tanpa Content-Type:', headers);
      
        return this.http
          .post(url, formData, { headers })
          .toPromise()
          .then(response => {
            console.log('Upload berhasil:', response);
            return response;
          })
          .catch(error => {
            console.error('Upload gagal:', error);
            throw error;
          });
      }
    
      deleteDuplicateData() {
        const url = `${environment.backendUrl}/scv/remove-duplicate`;
        return this.http.delete(url, { headers: this.headers }).toPromise();
      }

      deleteData(nama_bank: string) {
        const url = `${environment.backendUrl}/scv/remove-all?nama_bank=${encodeURIComponent(nama_bank)}`;
        return this.http.delete(url, { headers: this.headers }).toPromise();
      }
}
