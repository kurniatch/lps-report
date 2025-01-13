import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(): Promise<boolean> {
        console.log('Admin Auth Guard : canActivate()');
        return new Promise<boolean>((resolve) => {
            const key = localStorage.getItem('key');
            if (key === 'admin') {
                console.log('Admin Auth Guard : ', key);
                resolve(true);
            } else {
                this.router.navigate(['/notfound']);
                console.log('Admin Auth Guard : ', key);
                resolve(false);
            }
        });
    }
}
