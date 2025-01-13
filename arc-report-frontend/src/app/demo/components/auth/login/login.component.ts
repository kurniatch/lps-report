import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { environment } from 'src/environments/environment';

const backendUrl = environment.backendUrl;

const token = localStorage.getItem('token');
console.log('Token : ', token);

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
    providers: [MessageService],
})
export class LoginComponent {
    email: string = '';
    password: string = '';

    constructor(
        private router: Router,
        private messageService: MessageService
    ) {}

    login() {
        //this.router.navigate(['/dashboard']);
        const requestBody = {
            email: this.email,
            password: this.password,
        };

        // Mengirim permintaan login ke backend
        fetch(`${backendUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    console.log('Login berhasil');
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Login Success',
                        detail: 'Have a Nice Day!',
                    });
                    localStorage.setItem('token', data.token); // Ganti dengan sessionStorage jika ingin menyimpan dalam sessionStorage
                    localStorage.setItem('key', data.key); // Ganti dengan sessionStorage jika ingin menyimpan dalam sessionStorage )
                    localStorage.setItem('username', requestBody.email); // Ganti dengan sessionStorage jika ingin menyimpan dalam sessionStorage )

                    setTimeout(() => {
                        this.router.navigate(['/dashboard']);
                    }, 100);
                } else {
                    console.log('Login gagal');
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Login Failed',
                        detail: 'Invalid email or password',
                    });
                }
            })
            .catch((error) => {
                console.error('Terjadi kesalahan:', error);
            });
    }

    forgotPassword() {
        this.messageService.add({
            severity: 'info',
            summary: 'Forgot Password',
            detail: 'Please contact your administrator',
        });
    }
}
