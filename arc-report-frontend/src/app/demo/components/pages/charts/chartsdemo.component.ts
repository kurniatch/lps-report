import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/demo/service/analytics.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { HttpClient } from '@angular/common/http';

interface Type {
    name: string;
    code: string;
}

@Injectable()
@Component({
    templateUrl: './chartsdemo.component.html',
})
export class ChartsDemoComponent implements OnInit, OnDestroy {
    operator: Type[] = [];

    typeGaruda: Type[] = [];

    typeCitilink: Type[] = [];

    typeOthers: Type[] = [];

    selectedAircraft: string | undefined;

    llpPercentage: any = '';

    tcPercentage: any = '';

    nonTcPercentage: any = '';

    dataTotalLinked: any = '';

    dataTotalBaseline: any = '';

    dataOperator: any = [];

    dataAc: any = [];

    data: any = [];

    dataAircraft: any = [];

    selectedOperator: boolean = false;

    typePlane: any;

    lineData: any;

    barData: any;

    pieData: any;

    dataLinked: any;

    dataBaseline: any;

    dataLlp: any;

    dataTc: any;

    dataNonTc: any;

    polarData: any;

    radarData: any;

    lineOptions: any;

    barOptions: any;

    pieOptions: any;

    polarOptions: any;

    radarOptions: any;

    subscription: Subscription;

    loading: boolean = true;

    constructor(
        public layoutService: LayoutService,
        private http: HttpClient,
        private analyticsService: AnalyticsService
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(
            (config) => {
                this.initCharts();
            }
        );
    }

    ngOnInit() {
        this.initCharts();
    }

    initCharts() {
        this.loading = true;
        this.getOperatorData();
        this.loadData();
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.operator = [
            { name: 'Garuda', code: 'GA' },
            { name: 'Citilink', code: 'CITI' },
            { name: 'Other', code: 'OTHER' },
        ];

        this.typeGaruda = [
            { name: 'PK-GPA', code: 'GA' },
            { name: 'PK-GNR', code: 'CITI' },
        ];

        this.typeCitilink = [
            { name: 'PK-GEG', code: 'GA' },
            { name: 'PK-GEH', code: 'CITI' },
        ];

        this.typeOthers = [{ name: 'RP-C34', code: 'GA' }];

        this.dataLinked = {
            labels: ['LLP', 'TC', 'Non-TC'],
            datasets: [
                {
                    data: [0, 1, 0],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                    ],
                },
            ],
        };

        this.dataBaseline = {
            labels: ['LLP', 'TC', 'Non-TC'],
            datasets: [
                {
                    data: [0, 1, 0],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--teal-500'),
                        documentStyle.getPropertyValue('--cyan-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--teal-400'),
                        documentStyle.getPropertyValue('--cyan-400'),
                        documentStyle.getPropertyValue('--orange-400'),
                    ],
                },
            ],
        };

        this.dataLlp = {
            labels: ['Linked', 'Not Linked'],
            datasets: [
                {
                    data: [0, 1],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--orange-500'),
                        documentStyle.getPropertyValue('--teal-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--orange-400'),
                        documentStyle.getPropertyValue('--teal-400'),
                    ],
                },
            ],
        };

        this.dataTc = {
            labels: ['Linked', 'Not Linked'],
            datasets: [
                {
                    data: [0, 1],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--teal-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--teal-400'),
                        documentStyle.getPropertyValue('--ywllow-400'),
                    ],
                },
            ],
        };

        this.dataNonTc = {
            labels: ['Linked', 'Not Linked'],
            datasets: [
                {
                    data: [0, 1],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--cyan-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--cyan-400'),
                        documentStyle.getPropertyValue('--orange-400'),
                    ],
                },
            ],
        };

        this.pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor,
                    },
                },
            },
        };

        this.barOptions = {
            plugins: {
                legend: false,
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };

        this.lineData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'LLP',
                    backgroundColor:
                        documentStyle.getPropertyValue('--yellow-500'),
                    borderColor: documentStyle.getPropertyValue('--yellow-500'),
                    data: [65, 59, 80, 81, 56, 55, 40],
                    tension: 0.4,
                },
                {
                    label: 'TC',
                    backgroundColor:
                        documentStyle.getPropertyValue('--green-500'),
                    borderColor: documentStyle.getPropertyValue('--green-500'),
                    data: [28, 48, 40, 19, 86, 27, 90],
                    tension: 0.4,
                },
                {
                    label: 'NON TC',
                    backgroundColor:
                        documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [44, 30, 38, 25, 70, 35, 60],
                    tension: 0.4,
                },
            ],
        };

        this.lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
        this.loading = false;
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    initData() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.llpPercentage = this.data[0].llp_percentage;
        this.tcPercentage = this.data[0].tc_percentage;
        this.nonTcPercentage = this.data[0].non_tc_percentage;

        this.dataLlp = {
            labels: ['Not Linked', 'Linked'],
            datasets: [
                {
                    data: [
                        this.data[0].llp_baseline - this.data[0].llp_linked,
                        this.data[0].llp_linked,
                    ],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--teal-500'),
                        documentStyle.getPropertyValue('--blue-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--teal-400'),
                        documentStyle.getPropertyValue('--blue-400'),
                    ],
                },
            ],
        };

        this.dataTc = {
            labels: ['Not Linked', 'Linked'],
            datasets: [
                {
                    data: [
                        this.data[0].tc_baseline - this.data[0].tc_linked,
                        this.data[0].tc_linked,
                    ],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--blue-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--blue-400'),
                    ],
                },
            ],
        };

        this.dataNonTc = {
            labels: ['Not Linked', 'Linked'],
            datasets: [
                {
                    data: [
                        this.data[0].non_tc_baseline -
                            this.data[0].non_tc_linked,
                        this.data[0].non_tc_linked,
                    ],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--blue-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--blue-400'),
                    ],
                },
            ],
        };

        this.dataLinked = {
            labels: ['LLP', 'TC', 'Non-TC'],
            datasets: [
                {
                    data: [
                        this.data[0].llp_linked,
                        this.data[0].tc_linked,
                        this.data[0].non_tc_linked,
                    ],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                    ],
                },
            ],
        };

        this.dataBaseline = {
            labels: ['LLP', 'TC', 'Non-TC'],
            datasets: [
                {
                    data: [
                        this.data[0].llp_baseline,
                        this.data[0].tc_baseline,
                        this.data[0].non_tc_baseline,
                    ],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--teal-500'),
                        documentStyle.getPropertyValue('--cyan-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--teal-400'),
                        documentStyle.getPropertyValue('--cyan-400'),
                        documentStyle.getPropertyValue('--orange-400'),
                    ],
                },
            ],
        };

        this.dataTotalLinked =
            this.data[0].llp_linked +
            this.data[0].tc_linked +
            this.data[0].non_tc_linked;
        this.dataTotalBaseline =
            this.data[0].llp_baseline +
            this.data[0].tc_baseline +
            this.data[0].non_tc_baseline;
    }

    async loadData() {
        try {
            const aircraftData = await this.analyticsService.getAircraftData();
            this.dataAircraft = aircraftData;
            console.log('Hasil Aircraft', aircraftData);
        } catch (error) {
            console.error('Failed to fetch aircraft data.', error);
        }
    }

    async findData(keyword: any) {
        try {
            const searchData = await this.analyticsService.findPlaneData(
                keyword
            );
            this.data = searchData;
            console.log('Hasil Search service', searchData);
        } catch (error) {
            console.error('Failed to fetch search data.', error);
        }
    }

    async onOperatorSelect(event: any) {
        console.log(event);
        this.selectedOperator = true;
        await this.getAcData(event.value.operator);
    }

    async onTypeSelect(event: any) {
        this.loading = true;
        console.log(event);
        await this.findData(event.value);
        this.dataLlp.datasets[0].data[0] = this.data[0].llp_linked;
        console.log('Hasil Search', this.dataLlp.datasets[0].data[0]);
        this.initData();
        this.loading = false;
    }

    async getAcData(keyword: any) {
        try {
            this.dataAc = await this.analyticsService.getAcData(keyword);
            this.dataAc = this.dataAc.map((item: any) => ({
                ...item,
                operator: item.operator || 'Other',
            }));
        } catch (error) {
            console.error('Failed to fetch data.', error);
        }
    }

    async getOperatorData() {
        try {
            this.dataOperator = await this.analyticsService.getOperatorData();
            this.dataOperator = this.dataOperator.map((item: any) => ({
                ...item,
                operator: item.operator || 'Other',
            }));
        } catch (error) {
            console.error('Failed to fetch data.', error);
        }
    }

    customFilterFunction(event: Event) {
        console.log('event', event);
        // if (!searchInput) {
        //   return true; // If search input is empty, display all options
        // }
        // return value.toLowerCase().includes(searchInput.toLowerCase());
    }
}
