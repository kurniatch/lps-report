import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from 'src/app/admin.auth.guard';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'financial',
                loadChildren: () =>
                    import('./financial/financial.module').then((m) => m.FinancialModule),
            },
            {
                path: 'administration',
                canActivate: [AdminAuthGuard], // Gunakan AuthGuard di sini
                loadChildren: () =>
                    import('./administration/administration.module').then(
                        (m) => m.AdministrationModule
                    ),
            },
            {
                path: 'laba-rugi',
                loadChildren: () =>
                    import('./laba/laba.module').then((m) => m.LabaModule),
            },
            {
                path: 'lct',
                loadChildren: () =>
                    import('./lct/lct.module').then(
                        (m) => m.LctModule
                    ),
            },
            {
                path: 'neraca',
                loadChildren: () =>
                    import('./neraca/neraca.module').then((m) => m.NeracaModule),
            },            {
                path: 'scv',
                loadChildren: () =>
                    import('./scv/scv.module').then((m) => m.ScvModule),
            },
            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
