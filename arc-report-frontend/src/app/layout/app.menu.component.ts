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
                    {
                        label: 'Financial Modelling',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/pages/charts'],
                    },
                    {
                        label: 'Analyst LCT',
                        icon: 'pi pi-fw pi-money-bill',
                        routerLink: ['/pages/crud'],
                    },
                ],
            },
            ...(isAdmin
                ? [
                      {
                          label: 'Database',
                          items: [
                              {
                                  label: 'Database LCT',
                                  icon: 'pi pi-fw pi-book',
                                  routerLink: ['/pages/old-component'],
                              },
                              {
                                  label: 'Database X',
                                  icon: 'pi pi-fw pi-bookmark',
                                  routerLink: ['/pages/arc-swift'],
                              },
                              {
                                  label: 'Database XX',
                                  icon: 'pi pi-fw pi-database',
                                  routerLink: ['/pages/docfile-rms'],
                              },
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
