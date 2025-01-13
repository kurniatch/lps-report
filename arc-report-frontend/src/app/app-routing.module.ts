import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuard } from './auth.guard'; // Import AuthGuard

const routes: Routes = [
    {
        path: 'dashboard',
        component: AppLayoutComponent,
        canActivate: [AuthGuard], // Gunakan AuthGuard di sini
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./demo/components/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
        ],
    },
    {
        path: 'pages',
        component: AppLayoutComponent,
        canActivate: [AuthGuard], // Gunakan AuthGuard di sini
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./demo/components/pages/pages.module').then(
                        (m) => m.PagesModule
                    ),
            },
        ],
    },
    {
        path: 'documentation',
        component: AppLayoutComponent,
        canActivate: [AuthGuard], // Gunakan AuthGuard di sini
        children: [
            {
                path: '',
                loadChildren: () =>
                    import(
                        './demo/components/documentation/documentation.module'
                    ).then((m) => m.DocumentationModule),
            },
        ],
    },
    {
        path: '',
        loadChildren: () =>
            import('./demo/components/auth/auth.module').then(
                (m) => m.AuthModule
            ),
    },
    { path: 'notfound', component: NotfoundComponent },
    { path: '**', redirectTo: '/notfound' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
            onSameUrlNavigation: 'reload',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
