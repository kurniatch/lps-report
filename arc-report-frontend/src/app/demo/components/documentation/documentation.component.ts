import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    templateUrl: './documentation.component.html',
})
export class DocumentationComponent implements OnInit {
    items: MenuItem[] = [];

    cardMenu: MenuItem[] = [];

    text: string | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'Angular.io',
                icon: 'pi pi-external-link',
                url: 'http://angular.io',
            },
            {
                label: 'Theming',
                icon: 'pi pi-bookmark',
                routerLink: ['/theming'],
            },
        ];

        this.cardMenu = [
            {
                label: 'Save',
                icon: 'pi pi-fw pi-check',
            },
            {
                label: 'Update',
                icon: 'pi pi-fw pi-refresh',
            },
            {
                label: 'Delete',
                icon: 'pi pi-fw pi-trash',
            },
        ];
    }

    onMenuClick(event: any) {
        console.log(event);
    }
}
