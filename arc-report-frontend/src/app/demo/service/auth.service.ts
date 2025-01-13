import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../api/member';

@Injectable()
export class AuthService {
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    constructor(private http: HttpClient) {}

    getAllUsers() {
        const url = `${environment.backendUrl}/auth/getallusers`;

        return this.http
            .get<Member[]>(url, { headers: this.headers })
            .toPromise()
            .then((data) => {
                if (data) {
                    return data;
                } else {
                    throw new Error('Failed to fetch components data.');
                }
            });
    }

    registerAccount(newAccount: any) {
        const url = `${environment.backendUrl}/auth/register`;
        return this.http
            .post(url, JSON.stringify(newAccount), { headers: this.headers })
            .toPromise();
    }

    deleteMember(memberId: string) {
        const url = `${environment.backendUrl}/auth/${memberId}`;
        return this.http.delete(url, { headers: this.headers }).toPromise();
    }
}
