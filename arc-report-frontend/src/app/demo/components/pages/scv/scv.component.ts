import { Component, Injectable, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../../api/product';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Customer, Data2 } from 'src/app/demo/api/customer';
import { CrudService } from 'src/app/demo/service/crud.service';
import { ScvService } from 'src/app/demo/service/scv.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Papa } from 'ngx-papaparse'; // Untuk parsing CSV

interface expandedRows {
    [key: string]: boolean;
}
@Injectable()
@Component({
    templateUrl: './scv.component.html',
    providers: [MessageService, ConfirmationService],})
export class ScvComponent implements OnInit, OnDestroy {
    components$: Customer[] = [];

    @ViewChild('dt1') dt1: Table | undefined; // Referensi untuk p-table

    editData: any = [];

    csvData: any[] = [];

    csvHeaders: string[] = [];

    private currentRequestId = 0;

    importDialog: boolean = false; // Kontrol visibilitas dialog

    selectedFile: File | null = null; // File yang dipilih untuk diunggah

    countries: any = [] ;

    dataBank: any = [];

    dataLabaRugi: any = [];

    selectedBank: boolean = false;

    dataBankPeriode: any = [];

    dataPeriode: any = [];

    kategori: string = '';

    selectedCountry: string | undefined;

    selectedPeriode: string | undefined;

    data = {
        neraca_bank : {
            id_pelapor: '', // String
            periode_laporan: '', // String
            periode_data: '', // String
            id: '', // String
            pos_laporan_keuangan: '', // String
            deskripsi_pos_laporan_keuangan: '', // String
            cakupan_data: '', // String
            deskripsi_cakupan_data: '', // String
            nominal_rupiah: null, // Float
            nominal_valas: null, // Float
            nominal_valas_usd: null, // Float
            nominal_valas_non_usd: null, // Float
            nominal_total: null, // Float
            nominal_perusahaan_induk_rupiah: null, // Float
            nominal_perusahaan_induk_valas: null, // Float
            nominal_perusahaan_induk_total: null, // Float
            nominal_perusahaan_anak_selain_asuransi_rupiah: null, // Float
            nominal_perusahaan_anak_selain_asuransi_valas: null, // Float
            nominal_perusahaan_anak_selain_asuransi_total: null, // Float
            nominal_perusahaan_anak_asuransi_rupiah: null, // Float
            nominal_perusahaan_anak_asuransi_valas: null, // Float
            nominal_perusahaan_anak_asuransi_total: null, // Float
            nominal_konsolidasi_rupiah: null, // Float
            nominal_konsolidasi_valas: null, // Float
            nominal_konsolidasi_total: null, // Float
            buk: '', // String
            bus: '', // String
            uus: '', // String
            kategori: '', // String
            uuid: '', // String
            id_pelapor_prefix: '', // String
            total_nominal_rupiah: null,
            total_nominal_valas: null,
            total_nominal_total: null,
          },
          data_scv: {
            tahun: null, // Integer
            bulan: null, // Integer
            kode_kepesertaan: '', // String
            nama_bank: '', // String
            deskripsi: '', // String
            jumlah_nasabah_penyimpan: null, // Integer
            jumlah_rekening_simpanan: null, // Integer
            jumlah_saldo_simpanan: null, // Float
            jumlah_saldo_simpanan_dijamin: null, // Float
            uninsured: null, // Float
            insured: null, // Float
            check: false, // Boolean
        }

    };
    totalRecords: number = 100;

    totalLabaRugi: number = 100;

    findSearch: string = '';

    findSearchLaba: string = '';

    selectedSearch: string = '';

    selectedSearchLaba: string = '';

    loading: boolean = true;

    loading2: boolean = true;

    currentPage: number = 1;

    perPage: number = 30;

    totalData: number = 100;

    pages: number = 0;

    items!: MenuItem[];

    recordDialog: boolean = false;

    recordDialog2: boolean = false;

    editRecordDialog: boolean = false;

    editRecordDialog2: boolean = false;

    exportDialog: boolean = false;

    exportDialog2: boolean = false;

    isAdmin: boolean = false;

    products!: Product[];

    chartData: any;

    barData: any;
    
    barOptions: any;

    chartOptions: any;

    subscription!: Subscription;

    components1: Data2[] = [];

    components2: Data2[] = [];

    expandedRows: expandedRows = {};

    isExpanded: boolean = false;

    submitted: boolean = false;

    submitted2: boolean = false;

    selectedProducts!: Product[] | null;

    options: any ;

    optionsLine: any ;

    dataLine: any = [];

    dataNasabah: any = [];

    dataRekening: any = [];

    dataSaldo: any = [];

    dataSaldoDijamin: any = [];

    showDataChart: boolean = false;

    showDataPie: boolean = false;


    @ViewChild('filter') filter!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private crudService: CrudService,
        private scvService: ScvService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private papa: Papa
    ) {
        this.currentPage = 1;
    }

    ngOnInit() {
        const key = localStorage.getItem('key');
        this.isAdmin = key === 'admin'; // Check if the key is 'admin'

        this.loadDataTotal();
        this.loadData(1, 20);
        this.getBankData();
        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' },
        ];
        this.countries = [
            { name: 'Bank Mandiri', code: 'BMRI' },
            { name: 'Bank Rakyat Indonesia (BRI)', code: 'BRI' },
            { name: 'Bank Negara Indonesia (BNI)', code: 'BNI' },
            { name: 'Bank Central Asia (BCA)', code: 'BCA' },
            { name: 'Bank Tabungan Negara (BTN)', code: 'BTN' },
            { name: 'Bank Syariah Indonesia (BSI)', code: 'BSI' },
            { name: 'Bank CIMB Niaga', code: 'CIMB' },
            { name: 'Bank Danamon', code: 'BDMN' },
            { name: 'Bank Mega', code: 'MEGA' },
            { name: 'Bank Bukopin', code: 'BUKO' },
            { name: 'Bank Permata', code: 'PERM' },
            { name: 'Bank Maybank Indonesia', code: 'MAYB' }
        ];

        const documentStyle = getComputedStyle(document.documentElement);

        const textColor = documentStyle.getPropertyValue('--text-color');

        this.options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }

    async loadDataTotal() {
        this.loading = true;
        try {
            const totalRecord: any =
                await this.scvService.getComponentsReportTotal();

            this.totalRecords = totalRecord[0].total;

            this.loading = false;
            console.log('totalRecord 1', this.totalRecords);
        } catch (error) {
            console.error('Failed to fetch component data:', error);
        }
    }

    async loadData(currentPage: number, perPage: number = 30) {
        this.loading = true;
        const params = {
            page: currentPage.toString(),
            perPage: perPage.toString(),
        };

        try {
            const components = await this.scvService.getComponentsReport(
                params
            );
            this.components1 = components;

            console.log('components1 :', this.components1);

            this.loading = false;
        } catch (error) {
            console.error('Failed to fetch component data:', error);
        }
    }

    onTableFilter(event: any): void {
        console.log('Filter applied:', event.filters);
      }
    
      
    async findData(keyword: string) {
        this.loading = true;
        keyword = keyword.trim();
        this.components1 = [];

        if (keyword.length >= 3) {
            this.loading = true;

            console.log('kategori', this.kategori);

            console.log('keyword', keyword);
            const body = {
                keyword: keyword.toUpperCase(),
            };
            console.log('body', body);
            try {
                const search = await this.scvService.getComponentsReportSearch(
                    body
                );

                console.log('hasil search post Neraca', search);

                this.components1 = search;

                this.loading = false;
                console.log('hasil search post', search);
            } catch (error) {
                console.error('Failed to fetch component data:', error);
            }
        } else {
            this.loading = false;
            this.messageService.add({
                severity: 'warn',
                summary: 'Keyword tidak cukup',
                detail: 'Minimal 3 karakter keyword',
            });
        }
    }

    async selectedData(keyword: string) {
        this.loading = true;
        this.selectedBank = true;
        keyword = keyword.trim();
        console.log('keyword 1', keyword);

        try {
            const search = await this.scvService.getDataReport({ keyword });
            console.log('Hasil Report', search);
        
            if (!search || search.length === 0) {
                console.warn("No data available for chart.");
                this.showDataChart = false;
                return;
            }
        
            // Urutkan data berdasarkan tahun dan bulan secara ASCENDING
            search.sort((a, b) => (a.tahun - b.tahun) || (a.bulan - b.bulan));
        
            // Ambil daftar periode dalam format "YYYY-MM"
            const labels = search.map(item => `${item.tahun}-${String(item.bulan).padStart(2, '0')}`);
        
            // Ambil nilai untuk setiap kategori
            const totalNasabah = search.map(item => item.total_nasabah);
            const totalRekening = search.map(item => item.total_rekening);
            const totalSaldo = search.map(item => item.total_saldo);
            const totalSaldoDijamin = search.map(item => item.total_saldo_dijamin);
        
            // 🔹 Data untuk 4 Line Chart
            this.dataNasabah = {
                labels: labels,
                datasets: [{
                    label: 'Total Nasabah',
                    borderColor: '#42A5F5',
                    backgroundColor: '#42A5F5',
                    data: totalNasabah,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            };
        
            this.dataRekening = {
                labels: labels,
                datasets: [{
                    label: 'Total Rekening',
                    borderColor: '#FFA726',
                    backgroundColor: '#FFA726',
                    data: totalRekening,
                    fill: false,
                    tension: 0,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            };
        
            this.dataSaldo = {
                labels: labels,
                datasets: [{
                    label: 'Total Saldo',
                    borderColor: '#66BB6A',
                    backgroundColor: '#66BB6A',
                    data: totalSaldo,
                    fill: false,
                    tension: 0,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            };
        
            this.dataSaldoDijamin = {
                labels: labels,
                datasets: [{
                    label: 'Total Saldo Dijamin',
                    borderColor: '#AB47BC',
                    backgroundColor: '#AB47BC',
                    data: totalSaldoDijamin,
                    fill: false,
                    tension: 0,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            };
        
            // 🔹 Opsi untuk 4 Line Chart
            this.optionsLine = {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 0.6,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Nilai'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Periode (Tahun-Bulan)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem: any) {
                                return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toLocaleString()}`;
                            }
                        }
                    },
                    datalabels: {
                        anchor: 'start', // Menempatkan teks di atas batang
                        align: 'top', // Mengatur agar angka tetap di atas
                        formatter: function(value: { toLocaleString: () => any; }) {
                            return value.toLocaleString(); // Format angka dengan pemisah ribuan
                        },
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        color: '#000' // Warna teks angka di atas batang
                    }
                }
            };
        
            this.showDataChart = true;
            this.showDataPie = false;
        
        } catch (error) {
            console.error('Failed to fetch component data:', error);
            this.showDataChart = false;
        }
        
        
        
        
    
        if (keyword.length >= 3) {
            this.loading = true;

            console.log('keyword', keyword);
            console.log('kategori', this.kategori);
    
            const body = { keyword: keyword.toUpperCase()};
            console.log('body', body);
    
            const requestId = ++this.currentRequestId;
    
            try {
                const search = await this.scvService.getComponentsReportSearch(body);
                console.log('hasil search post Neraca', search);
    
                if (requestId === this.currentRequestId) {
                    this.components1 = search;
                }
    
                this.loading = false;
                this.getBankDataPeriode(keyword);
                console.log('hasil search post', search);
            } catch (error) {
                console.error('Failed to fetch component data:', error);
            }
        } else {
            this.loading = false;
            this.messageService.add({
                severity: 'warn',
                summary: 'Keyword tidak cukup',
                detail: 'Minimal 4 karakter keyword',
            });
        }
    }


    onLazyLoad(event: any) {
        console.log(event);
        this.pages = event.first / 30;
        this.currentPage = this.pages + 1;
        console.log('currentPage', this.currentPage);
        // this.loadData(this.currentPage, event.rows);
    }

    onLazyLoadLaba(event: any) {
        console.log(event);
        this.pages = event.first / 30;
        this.currentPage = this.pages + 1;
        console.log('currentPage', this.currentPage);
        // this.loadDataLaba(this.currentPage, event.rows);
    }

    onEditProduct(component: any) {
        if (this.isAdmin) {
            this.editProduct(component);
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Akses Ditolak',
                detail: 'Harap hubungi administrator jika ingin mengedit.'
            });
        }
    }

    onDeleteProduct(component: any) {
        if (this.isAdmin) {
            this.deleteProduct(component);
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Akses Ditolak',
                detail: 'Harap hubungi administrator jika ingin menghapus.'
            });
        }
    }

    async applyPeriodeFilter(keyword: string, event: any) {
        console.log('event', event);

        await this.selectedData(keyword);

        this.loading = true;
        if (this.components1.length > 0) {
            const split = event.value.split('-');
            const tahun = Number(split[0]); // Convert to number
            const bulan = Number(split[1]); // Convert to number
            this.components1 = this.components1.filter(
                (item) => item.tahun === tahun && item.bulan === bulan
            );
            this.loading = false;
        }
        
        try {
            this.loading = true;
            const search = await this.scvService.getDataReportPeriod({ keyword, period: event.value });
        
            if (!search || search.length === 0) {
                console.warn("Data kosong atau undefined");
                this.barData = null;
                this.loading = false;
                return;
            }
        
            const dataItem = search[0]; 
        
            this.barData = {
                labels: [        `Total Nasabah`,
                    `Total Rekening`,
                    `Total Saldo`,
                    `Total Saldo Dijamin`], // Label di sumbu X untuk setiap batang
                datasets: [
                    {
                        label: "Jumlah",
                        data: [
                            dataItem.total_nasabah,
                            dataItem.total_rekening,
                            dataItem.total_saldo,
                            dataItem.total_saldo_dijamin
                        ],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            };
            
            this.barOptions = {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 0.6,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Jumlah"
                        },
                        ticks: {
                            callback: function(value: { toLocaleString: () => any; }) {
                                return value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Kategori Data Bank", // Caption umum untuk sumbu X
                            font: {
                                size: 14,
                                weight: "bold"
                            },
                            padding: { top: 10 }
                        },
                        ticks: {
                            autoSkip: false, // Pastikan semua label terlihat
                            maxRotation: 0, // Tetap horizontal
                            minRotation: 0,
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                        labels: {
                            generateLabels: function(chart: { data: { labels: any[]; datasets: {
                                backgroundColor: any; borderColor: { [x: string]: any; }; 
}[]; }; }) {
                                return chart.data.labels.map((label: any, index: string | number) => ({
                                    text: label,
                                    fillStyle: chart.data.datasets[0].backgroundColor[index],
                                    strokeStyle: chart.data.datasets[0].borderColor[index],
                                    lineWidth: 1
                                }));
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context: { raw: { toLocaleString: () => any; }; }) {
                                return context.raw.toLocaleString();
                            }
                        }
                    },
                    datalabels: {
                        anchor: 'end', // Menempatkan teks di atas batang
                        align: 'top', // Mengatur agar angka tetap di atas
                        formatter: function(value: { toLocaleString: () => any; }) {
                            return value.toLocaleString(); // Format angka dengan pemisah ribuan
                        },
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        color: '#000' // Warna teks angka di atas batang
                    }
                }
            };
            
            
            
            
            
            this.showDataPie = true;
            this.showDataChart = false;
            this.loading = false;
        } catch (error) {
            console.error('Failed to fetch report period:', error);
            this.loading = false;
        }
        
        


        // if (this.dt1) {
        //   this.dt1.filter(event.value, 'periode_data', 'contains');  // Correct number of arguments
        // }
      }
      
      

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
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    openNew() {
        this.submitted = false;
        this.recordDialog = true;
        this.exportDialog = false;
        this.editRecordDialog = false;
    }

    openExport() {
        this.submitted = false;
        this.recordDialog = false;
        this.exportDialog = true;
        this.editRecordDialog = false;
    }

    
    openExport2() {
        this.submitted2 = false;
        this.recordDialog2 = false;
        this.exportDialog2 = true;
        this.editRecordDialog2 = false;
    }

    editProduct(product: Data2) {
        console.log(product);
        this.editData = { ...product };
        this.editRecordDialog = true;
        console.log('Edit data', this.editData?.equipment);
    }

    deleteProduct(data: any) {
        console.log(data);
        this.confirmationService.confirm({
            message: `
            <div class="p-d-flex p-ai-center">
            <h5>Are you sure you want to delete?</h5>
            <p><strong>Equipment:</strong> ${data.equipment}</p>
            <p><strong>Material Description:</strong> ${data.material_description}</p>
            </div>
          `,
            header: 'Confirmation Dialog',
            icon: 'pi pi-exclamation-triangle ml-4 w-16',
            accept: async () => {

                console.log('data', this.data);
                try {
                    const responseData = await this.crudService.removeReport(
                        this.data
                    );
                    console.log('Response from backend:', responseData);
                    window.location.reload();
                } catch (error) {
                    console.error('Error sending data to backend:', error);
                }
            },
        });
    }

    selectedExportFormat: string = ''; // Selected export format (PDF or XLSX)

    exportFormats: any[] = [
        { label: 'PDF', value: 'pdf' },
        { label: 'XLSX', value: 'xlsx' },
    ];

    formatCurrency(amount: number): string {
        return amount.toLocaleString('id-ID', {
            style: 'decimal', 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0 
        });
    }

    exportAsPDF(): void {
        const idPelapor = this.components1.length > 0 ? this.components1[0].nama_bank ?? 'N/A' : 'N/A';
        const doc = new jsPDF('landscape', 'px', 'a4');
        const imgWidth = 130;
        const imgHeight = 40;
        let pageCount = 1; // Initialize page count

        // Adding the header image
        const headerImgData = '/assets/layout/images/logo-white.png'; // Replace with the path to your header image
        doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);


        // Sample data for the table
        const tableData = this.components1.map((report, index) => [
            `${report?.tahun ?? ''}/${report?.bulan ?? ''}`, // Menambahkan / sebagai pemisah antara tahun dan bulan
            report?.deskripsi ?? '', // Default ke string kosong jika undefined
            this.formatCurrency(report?.jumlah_nasabah_penyimpan ?? 0), // Format nilai jumlah nasabah penyimpan
            this.formatCurrency(report?.jumlah_rekening_simpanan ?? 0), // Format nilai jumlah rekening simpanan
            this.formatCurrency(report?.jumlah_saldo_simpanan ?? 0), // Format nilai jumlah saldo simpanan
            this.formatCurrency(report?.jumlah_saldo_simpanan_dijamin ?? 0), // Format nilai jumlah saldo simpanan dijamin
          ]);
          
        

        // Adding the table
        (doc as any).autoTable({
            head: [
                [
                    {
                        content: 'Periode',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Deskripsi',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Jumlah Nasabah Penyimpan',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Jumlah Rekening Simpanan',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Jumlah Saldo Simpanan',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Jumlah Saldo Simpanan Dijamin',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                ],
            ],
            body: tableData,
            theme: 'grid',
            startY: imgHeight + 20,
            styles: {
                fontSize: 10,
                cellPadding: 4,
                overflow: 'linebreak',
                valign: 'middle',
                halign: 'center',
            },
            headStyles: {
                fillColor: [79, 129, 189],
                textColor: 255,
                halign: 'center',
                lineWidth: 0.1,
                lineColor: [255, 255, 255],
            },
            columnStyles: {
                0: { halign: 'left' },
                1: { halign: 'left' },
                2: { cellWidth: 80, halign: 'right' },
                3: { cellWidth: 80, halign: 'right' },
                4: { cellWidth: 80, halign: 'right' },
                5: { cellWidth: 100, halign: 'right' },
            },
            didDrawPage: function (data: any) {
                const headerStr = 'Laporan SCV: ' + idPelapor ;
                const timestampStr = 'Date: ' + new Date().toLocaleString();
                doc.setFontSize(14);
                doc.text(headerStr, 250, 35);
                doc.setFontSize(10);
                doc.text(timestampStr, 250, 50);
                doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);

                const footerStr = 'SCV';
                const pageNr = 'Page ' + pageCount;
                const pageNrWidth =
                    doc.getStringUnitWidth(pageNr) * doc.internal.scaleFactor;
                const footerX = data.settings.margin.left;
                const footerY = doc.internal.pageSize.height - 10;
                doc.setFontSize(8);
                doc.text(footerStr, footerX + 20, footerY - 10);
                doc.text(pageNr, footerX + 530, footerY - 10);

                pageCount++;
            },
            didParseCell: (data: any) => {
                if (data.section === 'body' && data.column.index === 0) { // Kolom Deskripsi
                  const cellText: string = data.cell.raw;
                  if (cellText.toLowerCase().includes('total')) {
                    data.cell.styles.fontStyle = 'bold'; // Membuat teks menjadi bold
                  }
                }
            },
            margin: { top: 60 },
            tableWidth: 'auto',
            showHead: 'everyPage',
            tableLineColor: [189, 195, 199],
            tableLineWidth: 0.1,
        });

        doc.save('scv_bank_app.pdf');
    
    }

    showImportDialog() {
        if (this.isAdmin) {
            this.importDialog = true;
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Akses Ditolak',
                detail: 'Harap hubungi administrator jika ingin menambahkan data.'
            });
        }
      }

    exportData() {
        if (this.selectedExportFormat === 'pdf') {
            this.exportAsPDF();
        } else if (this.selectedExportFormat === 'xlsx') {
            this.exportAsXLSX();
        }
        this.exportDialog = false;
    }

    exportAsXLSX(): void {
        const workbook = XLSX.utils.book_new();
        const timestamp = new Date().toLocaleString();
        const idPelapor = this.components1.length > 0 ? this.components1[0].nama_bank ?? 'N/A' : 'N/A';
    
        // Data awal
        const worksheetData: (string | number)[][] = [
            ['', 'LPS'],
            ['', 'Dokumen ini di-download pada waktu:'],
            ['', timestamp],
            [],
            ['', 'Laporan SCV: ' + idPelapor],
            [],
            [
                '',
                'Periode',
                'Deskripsi',
                'Jumlah Nasabah Penyimpan',
                'Jumlah Rekening Simpanan',
                'Jumlah Saldo Simpanan',
                'Jumlah Saldo Simpanan Dijamin',
            ],
        ];
    
        const groupedData = this.groupByCategory(this.components1);
    
        Object.keys(groupedData).forEach((category) => {            
            groupedData[category].forEach((report: { tahun: any; bulan: any; deskripsi: any; jumlah_nasabah_penyimpan: any; jumlah_rekening_simpanan: any; jumlah_saldo_simpanan: any; jumlah_saldo_simpanan_dijamin: any; }) => {
                const rowData: (string | number)[] = [
                    '',
                    `${report?.tahun ?? ''}/${report?.bulan ?? ''}`, // Menambahkan '/' sebagai pemisah dengan prioritas operator yang benar
                    report?.deskripsi ?? '',  
                    report?.jumlah_nasabah_penyimpan ?? 0,                 
                    report?.jumlah_rekening_simpanan ?? 0,                 
                    report?.jumlah_saldo_simpanan ?? 0,                
                    report?.jumlah_saldo_simpanan_dijamin ?? 0,              
                  ];
                  
                worksheetData.push(rowData);
            });
            
            worksheetData.push([]);
        });
    
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            'scv_bank_app.xlsx'
        );
    }
    
    groupByCategory(data: any[]) {
        return data.reduce((groups, report) => {
            const category = report?.kategori ?? 'Unknown';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(report);
            return groups;
        }, {});
    }
    

    cancelDialog() {
        this.exportDialog = false;
        this.exportDialog2 = false;
        this.recordDialog = false;
        this.editRecordDialog = false;
    }

    hideDialog() {
        this.editRecordDialog = false;
        this.recordDialog = false;
        this.submitted = false;
        this.exportDialog = false;
        this.exportDialog2 = false;
    }

    clear(table: Table) {
        // reset the table state
        table.clear();

    }

    clear2(table: Table) {
        this.selectedBank = true
        window.location.reload();

    }


    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getSeverity(status: string): string {
        return status === 'available'
            ? 'pi-check-circle'
            : 'pi-times-circle    ';
    }



  // Fungsi saat file dipilih
  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
      const reader: FileReader = new FileReader();
      reader.readAsText(event.files[0]);
      reader.onload = () => {
        const csv = reader.result as string;
        this.papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          preview: 5,
          complete: (result: { meta: { fields: string[]; }; data: any[]; }) => {
            this.csvHeaders = result.meta.fields ? result.meta.fields : [];
            this.csvData = result.data;
          },
          error: (error: { message: any; }) => {
            this.messageService.add({severity:'error', summary: 'Parsing Error', detail: error.message});
          }
        });
      };
    }
  }

  // Fungsi saat file dihapus dari uploader
  onClearFile() {
    this.selectedFile = null;
    this.csvData = [];
    this.csvHeaders = [];
  }

    cancelUpload() {
        this.selectedFile = null;  // Menghapus file yang dipilih
        this.importDialog = false;  // Menutup dialog
        this.onClearFile();  // Menghapus file yang sudah dipilih
    }

    uploadFile() {
        if (this.selectedFile) {
        const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase();
        
        if (fileExtension !== 'csv') {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Format file tidak didukung. Silakan unggah file CSV.'});
            return;
        }
    
        if (this.selectedFile.size > 50000000) {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Ukuran file melebihi batas maksimal (50MB)'}); 
            return;
        }
    
        this.sendFileToBackend(this.selectedFile);  
        } else {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Tidak ada file yang dipilih'});
        }
    }
  
    sendFileToBackend(file: File) {
        const formData = new FormData();
        formData.append('file', file, file.name); 

        console.log("nama file", file.name);
    
        this.scvService.importDataCsv(file)
        .then(response => {
            this.messageService.add({severity:'success', summary: 'Success', detail: 'Data berhasil diimpor'});
            this.importDialog = false;
            this.loadData(this.currentPage, this.perPage);
        })
        .catch(error => {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Gagal mengimpor data'});
        });
    }

    async getBankData() {
        try {
            this.dataBank = await this.crudService.getBankData();
            this.dataBank = this.dataBank
                .filter((item: any) => item.id_pelapor_prefix !== null && item.id_pelapor_prefix !== undefined)
                .map((item: any) => ({
                    label: `${item.id_pelapor_prefix} - ${item.nama}`, // Concatenate prefix and name
                    value: item.id_pelapor_prefix, // Use prefix as the value
                    kategori: item.kategori,
                }));
                
            console.log('dataBank', this.dataBank);
        } catch (error) {
            console.error('Failed to fetch data.', error);
        }
    }


    async getBankDataPeriode(keyword: string) {
        try {
            this.dataBankPeriode = await this.scvService.getBankPeriode({ keyword });
            console.log('dataBankPeriode', this.dataBankPeriode);
            this.dataBankPeriode = this.dataBankPeriode
            .filter((item: any) => item.tahun !== null && item.bulan !== null)
            .map((item: any) => ({
                periode: item.tahun + '-' + item.bulan,
            }));
                        console.log('dataBankPeriode', this.dataBankPeriode);
        } catch (error) {
            console.error('Failed to fetch data.', error);
        }
    }

    async onGlobalChange(event: any) {
        console.log('event', event);
        const key = event.value;
        console.log('key', key);
    }


    addData(data: any, edit: string) {
        const dateObj = new Date();

        const user = localStorage.getItem('username');

        console.log('data', data);
        console.log('data1 ', this.editData);

        console.log('data2', data);
        this.scvService
            .createReport(data)
            .then((responseData) => {
                console.log('Response from backend:', responseData);
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error sending data to backend:', error);
            });
    }
    async onBankSelect(event: any) {
        console.log(event);
    }
}
