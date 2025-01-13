import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
        ToastModule, // Mengimpor modul Toast dari Primeng
    ],
})
export class AuthModule {}
