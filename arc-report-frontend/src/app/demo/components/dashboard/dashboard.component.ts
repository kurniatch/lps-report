import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ViewChild, ElementRef } from '@angular/core';
import {
    Report,
    Representative,
    ReportStatus,
} from 'src/app/demo/api/customer';
import { ComponentService, ServerStatus } from 'src/app/demo/service/component.service';
import { Table, TableModule } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ScvService } from 'src/app/demo/service/scv.service';

interface expandedRows {
    [key: string]: boolean;
}

interface Plane {
    operator: string;
}

interface Operator {
    name: string;
    code: string;
}

interface ReportData {
    total: number;
  }

const token = localStorage.getItem('token');
console.log('Token : ', token);

const operatorMappings = {
    GA: 'Garuda',
    CITI: 'Citilink',
    SJY: 'Sriwijaya',
    LNI: 'Lion',
    AIR: 'Air Asia',
    BAT: 'Batik',
    NAM: 'Nam Air',
    TRF: 'Trigana',
    XPR: 'Express',
    SKY: 'Sky',
};

@Component({
    templateUrl: './dashboard.component.html',
    providers: [MessageService, ConfirmationService],
})
export class DashboardComponent implements OnInit, OnDestroy {
    @ViewChild('dt1') table!: ElementRef;

    menuItems: MenuItem[] | undefined;

    items!: MenuItem[];

    summaryTotal: number = 0;

    globalFilter: string = ''; // Declare globalFilter property

    storageUsage: number = 60; // Contoh nilai, bisa diambil dari API
    cpuUsage: number = 45;     // Contoh nilai, bisa diambil dari API
    memoryUsage: number = 70;  // Contoh nilai, bisa diambil dari API

    plane: Plane[] = [];

    dataOperator: any = [];

    operator: Operator[] = [];

    selectedPlane: Plane | undefined;

    selectedOperator: Plane | undefined;

    selectedOperator2: Plane | undefined;

    exportDialog1: boolean = false;

    exportDialog2: boolean = false;

    checkBank: any = [];

    totalAvailable: number = 0;

    totalUnavailable: number = 0;

    totalDocuments: number = 0;

    totalGeneral: number = 0;

    totalNull: any = '0';

    totalMissing: any = '0';

    totalNeracaBank: number = 0;

    totalLabaRugi: number  = 0;

    totalScv: number  = 0;

    totalKredit: number  = 0;

    totalBank: number  = 0;

    products!: Product[];

    chartData: any;

    isAdmin: boolean = false;

    chartOptions: any;

    subscription!: Subscription;

    reportStatus: ReportStatus[] = [];

    reports1: Report[] = [];

    reports2: any[] = [];

    statuses: any[] = [];

    tempOperators: any[] = [];

    tempType: any[] = [];

    expandedRows: expandedRows = {};

    pagin: boolean = false;

    isExpanded: boolean = false;

    idFrozen: boolean = false;

    loading: boolean = true;

    loading2: boolean = true;

    loadingGraph: boolean = false;

    loadingChart: boolean = true;

    totalDataLaporan: number = 0;

    dataBankPeriode: any = [];

    selectedPeriode: any = [];

    @ViewChild('filter') filter!: ElementRef;


    constructor(
        public layoutService: LayoutService,
        private componentService: ComponentService,
        private scvService: ScvService,
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
    }

    ngOnInit() {
        const key = localStorage.getItem('key');
        this.isAdmin = key === 'admin';
        
        this.initChart();

        this.startAutoRefresh();

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' },
        ];

        this.operator = [
            { name: 'Garuda', code: 'GA' },
            { name: 'Citilink', code: 'CITI' },
            { name: 'Other', code: '' },
        ];
        this.getBankDataPeriode();
    }

    startAutoRefresh(): void {
        setInterval(() => {
          this.fetchServerStatus();
        }, 5000); // Adjust the interval (in milliseconds) as needed
      }

      
    fetchServerStatus(): void {
        this.componentService.getServerStatus().subscribe(
          (status: ServerStatus) => {
            this.storageUsage = status.storageUsage;
            this.cpuUsage = status.cpuUsage;
            this.memoryUsage = status.memoryUsage;
            console.log('Server status:', status);
          },
          (error: any) => {
            console.error('Error fetching server status:', error);
          }
        );
      }
    
      refreshStatus(): void {
        this.fetchServerStatus();
      }

    fetchData() {
        
        forkJoin({
          resultTotal: this.componentService.getNeracaBank(),
          reportMissingData: this.componentService.getMissingData(),
        }).subscribe({
          next: ({ resultTotal, reportMissingData }) => {
            console.log('reportNeraca:', resultTotal);
    
            // Pastikan array tidak kosong sebelum mengakses elemen
            if (resultTotal && resultTotal.length > 0) {
              this.totalNeracaBank = resultTotal[0].total_neraca_bank;
              this.totalLabaRugi = resultTotal[0].total_laba_rugi;
              this.totalKredit = resultTotal[0].total_kredit;
              this.totalScv = resultTotal[0].total_scv;
              this.totalBank = resultTotal[0].total_bank;
              
            } else {
              console.warn('Data reportNeraca kosong.');
            }

            if (reportMissingData && reportMissingData.length > 0) {
                this.totalMissing = reportMissingData[0].total;
            } else {
                console.warn('Data reportMissingData kosong.');
            }

            this.totalDataLaporan = this.totalNeracaBank + this.totalLabaRugi + this.totalKredit + this.totalScv;
          },
          error: (error) => {
            console.error('Error fetching data:', error);
          },
        });
        this.fetchCheckData();
      }

    async fecthDataTable1(keyword: string) {
        this.loadingGraph = true;
        try {
            const body = { keyword: keyword };
            const [reportStatus] = await Promise.all([
                this.componentService.getComponentsData(body),
            ]);

            this.reportStatus = reportStatus;

            this.initChart();
            this.loadingGraph = false;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async fetchCheckData(){
        try {
            const data = await this.componentService.getComponentsCheckBank();
            this.checkBank = data;
            console.log('Summary Check : ', this.checkBank);
        } catch (error) {
            console.error('Failed to fetch data.', error);
        }
    }

    async initChart() {

        this.fetchServerStatus();
        this.loadingChart = false;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        await this.fetchData();
        await this.getOperatorData();

        console.log('Report Status : ', this.reportStatus);

        const labels = [0, ...this.reportStatus.map((item) => item.formatted_month)];
        const neracaData = [0, ...this.reportStatus.map((item) => Number(item.total_neraca) || 0)];
        const labaData = [0, ...this.reportStatus.map((item) => Number(item.total_laba) || 0)];
        const total_laporan = [0, ...this.reportStatus.map((item) => 
            (Number(item.total_laba) || 0) + (Number(item.total_neraca) || 0)
        )];
        
        
        
        this.totalAvailable = neracaData.reduce(
            (a, b) => a + (Number(b) || 0),
            0
        );
        this.totalUnavailable = labaData.reduce(
            (a, b) => a + (Number(b) || 0),
            0
        );
        this.totalDocuments = total_laporan.reduce(
            (a, b) => a + (Number(b) || 0),
            0
        );
        
        this.totalGeneral = this.totalDocuments + this.totalNull[0].total_null;

        console.log('Label Data : ', labels);
        this.chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Laporan Neraca',
                    data: neracaData,
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: 0.4,
                },
                {
                    label: 'Laporan Laba Rugi',
                    data: labaData,
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--purple-600'),
                    borderColor: documentStyle.getPropertyValue('--purple-600'),
                    tension: 0.4,
                },
            ],
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
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
        this.loadingChart = true;
    }

    openExport(key: string) {
        if (key === 'report') {
            this.exportDialog1 = true;
        } else if (key === 'total') {
            this.exportDialog2 = true;
        }
    }

    selectedExportFormat: string = '';

    exportFormats: any[] = [
        { label: 'PDF', value: 'pdf' },
        { label: 'XLSX', value: 'xlsx' },
    ];


    expandAll() {
        if (!this.isExpanded) {
            this.products.forEach((product) =>
                product && product.name
                    ? (this.expandedRows[product.name] = true)
                    : ''
            );
        } else {
            this.expandedRows = {};
        }
        this.isExpanded = !this.isExpanded;
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    }

    async onGlobalFilter(table: Table, event: Event, dt: string) {
        if (dt === 'dt1') {
            this.loading = true;
            // await this.fecthDataTable1();
        }
        console.log('event', event);
        console.log('table', table);
        (event.target as HTMLInputElement).value = (
            event.target as HTMLInputElement
        ).value.trim();

        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
        setTimeout(() => {
            if (dt === 'dt1') {
                this.loading = true;
                this.reports1 = table.filteredValue || [];
                this.loading = false;
            } else if (dt === 'dt2') {
                this.loading2 = true;
                this.reports2 = table.filteredValue || [];
                this.loading2 = false;
            }
        }, 500);
    }

    cleardt(table: Table) {
        table.clear();
        this.globalFilter = ''
    }

    async onGlobalPlane(table: Table, event: any, key: string) {
        if (event.value.operator === 'Others') {
            event.value.operator = null;
        }
        console.log('event', event.value.operator);
        if (key === 'report') {
            this.loading = true;
            // await this.fecthDataTable1();
            table.filterGlobal(event.value.operator, 'startsWith');
            setTimeout(() => {
                this.reports1 = table.filteredValue || [];
                this.loading = false;
            }, 500);
        }
    }

    async clear(table: Table, dt: string) {
        console.log('report', this.reports2);
        table.clear();
        this.filter.nativeElement.value = '';
        if (dt === 'dt1') {
            // await this.fecthDataTable1();
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    formatNumberWithDots(number: number): string {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    async getOperatorData() {
        try {
            const data = await this.componentService.getBankData();
            this.dataOperator = data;
            this.dataOperator = this.dataOperator
            .filter((item: any) => item.id_pelapor_prefix !== '' && item.id_pelapor_prefix !== null)
            .map((item: any) => ({
                label: `${item.id_pelapor_prefix} - ${item.nama}`, // Concatenate prefix and name
                value: item.id_pelapor_prefix, // Use prefix as the value
                kategori: item.kategori,
            }));
            console.log('Data Operator:', this.dataOperator);
        } catch (error) {
            console.error('Failed to fetch component data.', error);
        }
    }

    async getBankDataPeriode() {
        try {
            // this.dataBankPeriode = await this.scvService.getBankPeriode({ keyword }) || [];
            // console.log('dataBankPeriode', this.dataBankPeriode);
            // this.dataBankPeriode.filter((item: any) => item.tahun !== null && item.bulan !== null)
            // .map((item: any) => ({
            //     periode: item.tahun + '-' + item.bulan,
            // }));
            // generate periode from 2024-01 to 2025-12
            let start = 2024;
            let end = 2025;
            let years: number[] = [];
            let months: number[] = [];
            let periode: { periode: string }[] = []; 
            
            for (let i = start; i <= end; i++) {
                years.push(i);
            }
            for (let i = 1; i <= 12; i++) {
                months.push(i);
            }
            
            years.forEach((year) => {
                months.forEach((month) => {
                    periode.push({ periode: `${year}-${month}` }); 
                });
            });
            
            this.dataBankPeriode = periode;
            
            console.log('Data Bank Periode:', this.dataBankPeriode);
        } catch (error) {
            console.error('Failed to fetch data.', error);
        }
    }

    async fecthDataTable2(period: string) {
        this.loading = true;
        console.log('Period:', period);
        try {
            const reportStatus = await this.componentService.getComponentsCheckPeriode(period);
            
            this.checkBank = reportStatus;
            this.loading = false;
        } catch (error) {
            console.error('Error fetching data:', error);
            this.loading = false;
        }
    }
    
    clearBank(){
        this.selectedPeriode = [];
        this.fetchCheckData();
    }


}
