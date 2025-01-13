import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const backendUrl = environment.backendUrl;

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private http: HttpClient) {}

    canActivate(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const token = localStorage.getItem('token');
            if (!token) {
                this.router.navigate(['']);
                resolve(false);
                return;
            }

            const headers = new HttpHeaders({
                Authorization: `Bearer ${token}`,
            });

            this.http
                .post(`${backendUrl}/auth/verify-token`, {}, { headers })
                .subscribe(
                    (response) => {
                        resolve(true);
                    },
                    (error) => {
                        this.router.navigate(['']);
                        resolve(false);
                    }
                );
        });
    }
}
