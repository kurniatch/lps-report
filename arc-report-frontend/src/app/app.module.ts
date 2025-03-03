import { LOCALE_ID, NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ComponentService } from './demo/service/component.service';
import { LabaService } from './demo/service/laba.service';
import { DocfileService } from './demo/service/docfile.service';
import { LocationService } from './demo/service/location.service';
import { AuthService } from './demo/service/auth.service';
import { NeracaService } from './demo/service/neraca.service';
import { AnalyticsService } from './demo/service/analytics.service';
import { CrudService } from './demo/service/crud.service';
import { ScvService } from './demo/service/scv.service';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import { TableModule } from 'primeng/table';
import { KreditService } from './demo/service/kredit.service';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartModule } from 'primeng/chart';


Chart.register(...registerables, ChartDataLabels);

// Daftarkan locale Indonesia
registerLocaleData(localeId);

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        ButtonModule,
        CalendarModule,
        TableModule,
        ChartModule,
        RouterModule.forRoot([], { useHash: false }),
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: LOCALE_ID, useValue: 'id-ID' },
        ComponentService,
        LabaService,
        DocfileService,
        LocationService,
        AuthService,
        NeracaService,
        CrudService,
        AnalyticsService,
        ScvService,
        KreditService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
