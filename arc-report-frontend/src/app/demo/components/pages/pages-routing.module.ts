import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'crud',
                loadChildren: () =>
                    import('./crud/crud.module').then((m) => m.CrudModule),
            },
            {
                path: 'charts',
                loadChildren: () =>
                    import('./charts/chartsdemo.module').then(
                        (m) => m.ChartsDemoModule
                    ),
            },
            {
                path: 'administration',
                loadChildren: () =>
                    import('./administration/administration.module').then(
                        (m) => m.AdministrationModule
                    ),
            },
            {
                path: 'arc-swift',
                loadChildren: () =>
                    import('./swift/swift.module').then((m) => m.SwiftModule),
            },
            {
                path: 'docfile-rms',
                loadChildren: () =>
                    import('./docfile/docfile.module').then(
                        (m) => m.DocfileModule
                    ),
            },
            {
                path: 'location-rms',
                loadChildren: () =>
                    import('./location/location.module').then(
                        (m) => m.LocationModule
                    ),
            },
            {
                path: 'old-component',
                loadChildren: () =>
                    import('./older/older.module').then((m) => m.OlderModule),
            },
            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
