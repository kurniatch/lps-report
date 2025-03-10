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

    importDataCsv(file: File): Promise<any> {
        const url = `${environment.backendUrl}/report/import-laba-rugi`;
      
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

    getComponentsReportSearch(body: { keyword: string, kategori: string } | undefined) {
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

    updateReportLaba(data: any) {
        const url = `${environment.backendUrl}/report/update-laba-rugi`;
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

    createReportLaba(data: any) {
        const url = `${environment.backendUrl}/report/new-laba`;
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

    getBankPeriode() {
        const url = `${environment.backendUrl}/report/bank-periode`;
        return this.http.get(url, { headers: this.headers }).toPromise();
    }

    getLabaRugiPeriode() {
        const url = `${environment.backendUrl}/report/laba-rugi-periode`;
        return this.http.get(url, { headers: this.headers }).toPromise();
    }

    getDataLct(tableName: string, keyword: string) {
        const url = `${environment.backendUrl}/report/data-lct`;
        const params = { tableName, keyword};
        return this.http.get(url, { headers: this.headers, params }).toPromise();
    }

    getDataLctPeriode(tableName: string, keyword: string, tanggal: string) {
        const url = `${environment.backendUrl}/report/data-lct-periode`;
        const params = { tableName, keyword, tanggal };
        return this.http.get(url, { headers: this.headers, params }).toPromise();
    }

    deleteDuplicateDataNeraca() {
        const url = `${environment.backendUrl}/report/neraca-remove-duplicate`;
        return this.http.delete(url, { headers: this.headers }).toPromise();
      }

    deleteDataNeraca(nama_bank: string) {
        const url = `${environment.backendUrl}/report/neraca-remove-all?nama_bank=${encodeURIComponent(nama_bank)}`;
        return this.http.delete(url, { headers: this.headers }).toPromise();
      }
    
    deleteDuplicateDataLaba() {
        const url = `${environment.backendUrl}/report/laba-remove-duplicate`;
        return this.http.delete(url, { headers: this.headers }).toPromise();
      }

    deleteDataLaba(nama_bank: string) {
        const url = `${environment.backendUrl}/report/laba-remove-all?nama_bank=${encodeURIComponent(nama_bank)}`;
        return this.http.delete(url, { headers: this.headers }).toPromise();
      }
}
