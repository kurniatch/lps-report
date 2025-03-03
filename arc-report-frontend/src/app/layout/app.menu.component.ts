import { Component, OnInit } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    constructor(public layoutService: LayoutService) {}

    ngOnInit() {
        const key = localStorage.getItem('key');
        const isAdmin = key === 'admin';

        this.model = [
            {
                label: 'Home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/dashboard'],
                    },
                    // {
                    //     label: 'Financial Modelling',
                    //     icon: 'pi pi-fw pi-chart-bar',
                    //     routerLink: ['/pages/financial'],
                    // },
                    // {
                    //     label: 'Analyst LCT',
                    //     icon: 'pi pi-fw pi-money-bill',
                    //     routerLink: ['/pages/crud'],
                    // },
                ],
            },
                    {
                        label: 'Analyst LCT',
                        items: [
                            {
                                label: 'Least Cost Test',
                                icon: 'pi pi-fw pi-money-bill',
                                routerLink: ['/pages/lct'],
                            },
                            {
                                label: 'Laporan Neraca',
                                icon: 'pi pi-fw pi-book',
                                routerLink: ['/pages/neraca'],
                            },
                            {
                                label: 'Laporan Laba Rugi',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['/pages/laba-rugi'],
                            },
                            {
                                label: 'Laporan SCV',
                                icon: 'pi pi-fw pi-credit-card',
                                routerLink: ['/pages/scv'],
                            },
                            {
                                label: 'Laporan Kredit',
                                icon: 'pi pi-fw pi-credit-card',
                                routerLink: ['/pages/kredit'],
                            },
                        ]
                        
                    },
            
            ...(isAdmin
                ? [
                      {
                          label: 'Database',
                          items: [
                              {
                                  label: 'Database XXX',
                                  icon: 'pi pi-fw pi-flag',
                                  routerLink: ['/pages/location-rms'],
                              },
                          ],
                      },
                  ]
                : []),
            {
                label: 'Technical',
                items: [
                    {
                        label: 'Documentation',
                        icon: 'pi pi-spin pi-cog',
                        routerLink: ['/documentation'],
                    },
                    ...(isAdmin
                        ? [
                              {
                                  label: 'Administration',
                                  icon: 'pi pi-fw pi-user-edit',
                                  routerLink: ['/pages/administration'],
                              },
                          ]
                        : []),
                ],
            },
            {
                label: 'Support',
                items: [
                    {
                        label: 'Log Out',
                        icon: 'pi pi-fw pi-power-off',
                        command: () => this.logout(),
                        routerLink: [''],
                    },
                ],
            },
        ];
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('key');
        localStorage.removeItem('username');
    }
}
