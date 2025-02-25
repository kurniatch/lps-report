import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Report, ReportStatus } from '../api/customer';
import { environment } from 'src/environments/environment';

@Injectable()
export class KreditService {
    findSearch: any = [];
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    constructor(private http: HttpClient) {}

    getComponentsReport(params: { page: string; perPage: string } | undefined) {
        const url = `${environment.backendUrl}/kredit/view`;
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
        const url = `${environment.backendUrl}/kredit/total-view`;
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

    getComponentsReportSearch(body: { keyword: string, page: string, perPage: string }) {
        console.log('Request Body:', body);
        const url = `${environment.backendUrl}/kredit/search-kredit`;
        body.page = String(body.page);
        body.perPage = String(body.perPage);

        try {
            const data = this.http.post(url, body, { headers: this.headers }).toPromise();
            if (data) {
                this.findSearch = data;
                return this.findSearch;
            } else {
                throw new Error('Failed to fetch components data.');
            }
        } catch (error) {
            console.error('Error fetching components data:', error);
            throw error; 
        }
    }
    

    getBankPeriode(body: { keyword: string} | undefined) {
        const url = `${environment.backendUrl}/kredit/search-bank-periode`;
        return this.http.post(url, body, { headers: this.headers }).toPromise();
    }

    getSummaryKredit(params: { table: string, period: string} | undefined) {
        const url = `${environment.backendUrl}/kredit/summary-kredit`;
        //trim period params 7 character
        if (params && params.period){
            params.period = params.period.substring(0, 7);
        }
        return this.http.get(url, { params, headers: this.headers }).toPromise();
    }

    getSummaryKreditGeneral(params: { table: string;} | undefined) {
        const url = `${environment.backendUrl}/kredit/summary-kredit-general`;
        return this.http.get(url, { params, headers: this.headers }).toPromise();
    }



    createReport(data: any) {
        const url = `${environment.backendUrl}/kredit/new-kredit`;
        return this.http
            .post(url, JSON.stringify(data), { headers: this.headers })
            .toPromise();
    }

    importDataCsv(file: File): Promise<any> {
        const url = `${environment.backendUrl}/kredit/import-kredit`;
      
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
}
