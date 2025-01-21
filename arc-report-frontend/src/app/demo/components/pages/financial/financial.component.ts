import { Component, Injectable, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../../api/product';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Customer, Data } from 'src/app/demo/api/customer';
import { CrudService } from 'src/app/demo/service/crud.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormsModule, NumberValueAccessor } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { report } from 'process';

interface expandedRows {
    [key: string]: boolean;
}
@Injectable()
@Component({
    templateUrl: './financial.component.html',
    providers: [MessageService, ConfirmationService],})
export class FinancialComponent implements OnInit, OnDestroy {
    components$: Customer[] = [];

    editData: any = [];

    countries: any = [] ;

    dataBank: any = [];

    dataLabaRugi: any = [];

    selectedCountry: string | undefined;

    data = {
        docfile: {
            doc_no: '',
            doc_posting_date: '',
            doc_type: '',
            doc_location: '',
            doc_status: '',
            doc_createddate: '',
            doc_createdby: '',
            doc_lastupdate: '',
            doc_lastuser: '',
            doc_category: '',
            doc_aircrafte: '',
            doc_work_packagee: '',
            doc_reason: '',
            doc_returndate: '',
            doc_retention_schedule: '',
            doc_last_received: '',
            doc_last_rejected: '',
            doc_filed: '',
        },
        arc_swift: {
            equipment: '',
            material_number: '',
            serial_number: '',
            material_description: '',
            material_group: '',
            functional_location: '',
            aircraft_reg: '',
            notif_w3: '',
            order_notif_w3: '',
            notif_w4: '',
            batch_notif_w4: '',
            title: '',
            po_number: '',
            timestamp_pi: '',
        },
        location: {
            doc_box: '',
            doc_locations: '',
        },
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
          }, 
          laba_rugi: {
            id_pelapor: '', // String
            periode_laporan: '', // String
            periode_data: '', // String
            id: '', // String
            pos_laba_rugi: '', // String
            deskripsi_pos_laba_rugi: '', // String
            cakupan_data: '', // String
            deskripsi_cakupan_data: '', // String
            nominal_penduduk_rupiah: null, // Float
            nominal_penduduk_valas: null, // Float
            nominal_penduduk_total: null, // Float
            nominal_bukan_penduduk_rupiah: null, // Float
            nominal_bukan_penduduk_valas: null, // Float
            nominal_bukan_penduduk_total: null, // Float
            nominal_rupiah: null, // Float
            nominal_valas: null, // Float
            nominal_total: null, // Float
            nominal_perusahaan_induk_penduduk_rupiah: null, // Float
            nominal_perusahaan_induk_penduduk_valas: null, // Float
            nominal_perusahaan_induk_bukan_penduduk_rupiah: null, // Float
            nominal_perusahaan_induk_bukan_penduduk_valas: null, // Float
            nominal_perusahaan_induk_total: null, // Float
            nominal_perusahaan_anak_sln_asuransi_penduduk_rupiah: null, // Float
            nominal_perusahaan_anak_sln_asuransi_penduduk_valas: null, // Float
            nominal_perusahaan_anak_sln_asuransi_bukan_penduduk_rupiah: null, // Float
            nominal_perusahaan_anak_sln_asuransi_bukan_penduduk_valas: null, // Float
            nominal_perusahaan_anak_asuransi_penduduk_rupiah: null, // Float
            nominal_perusahaan_anak_asuransi_penduduk_valas: null, // Float
            nominal_perusahaan_anak_asuransi_bukan_penduduk_rupiah: null, // Float
            nominal_perusahaan_anak_asuransi_bukan_penduduk_valas: null, // Float
            nominal_perusahaan_anak_total: null, // Float
            nominal_konsolidasi_penduduk_rupiah: null, // Float
            nominal_konsolidasi_penduduk_valas: null, // Float
            nominal_konsolidasi_bukan_penduduk_rupiah: null, // Float
            nominal_konsolidasi_bukan_penduduk_valas: null, // Float
            nominal_konsolidasi_total: null, // Float
            buk: '', // String
            bus: '', // String
            uus: '', // String
            kategori: '', // String
            uuid: '', // String  @id @default(dbgenerated("gen_random_uuid()"))
            head: '', // String
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

    perPage: number = 10;

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

    chartOptions: any;

    subscription!: Subscription;

    components1: Data[] = [];

    components2: Data[] = [];

    expandedRows: expandedRows = {};

    isExpanded: boolean = false;

    submitted: boolean = false;

    submitted2: boolean = false;

    selectedProducts!: Product[] | null;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private crudService: CrudService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.currentPage = 1;
    }

    ngOnInit() {
        const key = localStorage.getItem('key');
        this.isAdmin = key === 'admin'; // Check if the key is 'admin'

        console.log('isAdmin', this.isAdmin);

        this.loadDataTotal();

        this.loadDataTotalLaba();

        this.loadData(1, 20);

        this.loadDataLaba(1, 20);

        this.getBankData();

        this.getLabaRugiData();

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
    }

    async loadDataTotal() {
        this.loading = true;
        try {
            const totalRecord: any =
                await this.crudService.getComponentsReportTotal();

            this.totalRecords = totalRecord[0].total;

            this.loading = false;
            console.log('totalRecord 1', this.totalRecords);
        } catch (error) {
            console.error('Failed to fetch component data:', error);
        }
    }

    async loadDataTotalLaba() {
        this.loading2 = true;
        try {
            const totalRecord: any =
                await this.crudService.getLabaRugiReportTotal();

            this.totalLabaRugi = totalRecord[0].total;

            this.loading2 = false;
            console.log('totalRecord 1', this.totalLabaRugi);
        } catch (error) {
            console.error('Failed to fetch component data:', error);
        }
    }

    async loadData(currentPage: number, perPage: number = 10) {
        this.loading = true;
        const params = {
            page: currentPage.toString(),
            perPage: perPage.toString(),
        };

        try {
            const components = await this.crudService.getComponentsReport(
                params
            );
            this.components1 = components;

            this.loading = false;
        } catch (error) {
            console.error('Failed to fetch component data:', error);
        }
    }

    async loadDataLaba(currentPage: number, perPage: number = 10) {
        this.loading2 = true;
        const params = {
            page: currentPage.toString(),
            perPage: perPage.toString(),
        };

        try {
            const components = await this.crudService.getLabaRugiReport(
                params
            );
            this.components2 = components;

            this.loading2 = false;
        } catch (error) {
            console.error('Failed to fetch component data:', error);
        }
    }

    async findData(keyword: string) {
        this.loading = true;
        keyword = keyword.trim();

        if (keyword.length >= 4) {
            this.loading = true;

            console.log('keyword', keyword);
            const body = {
                keyword: keyword.toUpperCase(),
            };
            console.log('body', body);
            try {
                const search = await this.crudService.getComponentsReportSearch(
                    body
                );

                console.log('hasil search post', search);

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
                detail: 'Minimal 4 karakter keyword',
            });
        }
    }

    async findDataLaba(keyword: string) {
        this.loading2 = true;
        keyword = keyword.trim();

        console.log('keyword 1', keyword);

        if (keyword.length >= 4) {
            this.loading2 = true;

            console.log('keyword', keyword);
            const body = {
                keyword: keyword.toUpperCase(),
            };
            console.log('body', body);
            try {
                const search = await this.crudService.getLabaRugiReportSearch(
                    body
                );

                console.log('hasil search post', search);

                this.components2 = search;

                this.loading2 = false;
                console.log('hasil search post', search);
            } catch (error) {
                console.error('Failed to fetch component data:', error);
            }
        } else {
            this.loading2 = false;
            this.messageService.add({
                severity: 'warn',
                summary: 'Keyword tidak cukup',
                detail: 'Minimal 4 karakter keyword',
            });
        }
    }

    async selectedData(keyword: string) {
        this.loading = true;
        keyword = keyword.trim();

        console.log('keyword 1', keyword);

        if (keyword.length >= 4) {
            this.loading = true;

            console.log('keyword', keyword);
            const body = {
                keyword: keyword.toUpperCase(),
            };
            console.log('body', body);
            try {
                const search = await this.crudService.getComponentsReportSearch(
                    body
                );

                console.log('hasil search post', search);

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
                detail: 'Minimal 4 karakter keyword',
            });
        }
    }

    async selectedDataLaba(keyword: string) {
        this.loading2 = true;
        keyword = keyword.trim();

        console.log('keyword 1', keyword);

        if (keyword.length >= 4) {
            this.loading2 = true;

            console.log('keyword', keyword);
            const body = {
                keyword: keyword.toUpperCase(),
            };
            console.log('body', body);
            try {
                const search = await this.crudService.getLabaRugiReportSearch(
                    body
                );

                console.log('hasil search post', search);

                this.components2 = search;

                this.loading2 = false;
                console.log('hasil search post', search);
            } catch (error) {
                console.error('Failed to fetch component data:', error);
            }
        } else {
            this.loading2 = false;
            this.messageService.add({
                severity: 'warn',
                summary: 'Keyword tidak cukup',
                detail: 'Minimal 4 karakter keyword',
            });
        }
    }

    onLazyLoad(event: any) {
        console.log(event);
        this.pages = event.first / 10;
        this.currentPage = this.pages + 1;
        console.log('currentPage', this.currentPage);
        this.loadData(this.currentPage, event.rows);
    }

    onLazyLoadLaba(event: any) {
        console.log(event);
        this.pages = event.first / 10;
        this.currentPage = this.pages + 1;
        console.log('currentPage', this.currentPage);
        this.loadDataLaba(this.currentPage, event.rows);
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

    editProduct(product: Data) {
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
                this.data.arc_swift.equipment = data.equipment;
                this.data.docfile.doc_no = data.doc_no;
                this.data.location.doc_box = data.doc_box;

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

    formatCurrency(amount: number) {
        return amount.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
        });
    }

    exportAsPDF(type: string): void {
        if (type == 'neraca'){
        const idPelapor = this.components1.length > 0 ? this.components1[0].id_pelapor ?? 'N/A' : 'N/A';
        const doc = new jsPDF('landscape', 'px', 'a4');
        const imgWidth = 130;
        const imgHeight = 40;
        let pageCount = 1; // Initialize page count

        // Adding the header image
        const headerImgData = '/assets/layout/images/logo-white.png'; // Replace with the path to your header image
        doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);


        // Sample data for the table
        const tableData = this.components1.map((report, index) => [
            report?.deskripsi_pos_laporan_keuangan ?? '',  // Default to empty string if undefined
            this.formatCurrency(report?.nominal_rupiah ?? 0),  // Format nilai nominal_rupiah
            this.formatCurrency(report?.nominal_valas ?? 0),   // Format nilai nominal_valas
            this.formatCurrency(report?.nominal_total ?? 0),   // Format nilai nominal_total
        ]);
        

        // Adding the table
        (doc as any).autoTable({
            head: [
                [
                    {
                        content: 'Pos - Pos',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Nominal Rupiah',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Nominal Valas',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Nominal Total',
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
                1: { cellWidth: 100 },
                2: { cellWidth: 100 },
                3: { cellWidth: 100 },
            },
            didDrawPage: function (data: any) {
                const headerStr = 'Laporan Neraca Bank: ' + idPelapor ;
                const timestampStr = 'Date: ' + new Date().toLocaleString();
                doc.setFontSize(14);
                doc.text(headerStr, 250, 35);
                doc.setFontSize(10);
                doc.text(timestampStr, 250, 50);
                doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);

                const footerStr = 'Neraca Bank';
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
            margin: { top: 60 },
            tableWidth: 'auto',
            showHead: 'everyPage',
            tableLineColor: [189, 195, 199],
            tableLineWidth: 0.1,
        });

        doc.save('neraca_bank_app.pdf');
    }
    else{
        const idPelapor = this.components2.length > 0 ? this.components2[0].id_pelapor ?? 'N/A' : 'N/A';
        const doc = new jsPDF('landscape', 'px', 'a4');
        const imgWidth = 130;
        const imgHeight = 40;
        let pageCount = 1; // Initialize page count

        // Adding the header image
        const headerImgData = '/assets/layout/images/logo-white.png'; // Replace with the path to your header image
        doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);


        // Sample data for the table
        const tableData = this.components2.map((report, index) => [
            report?.deskripsi_pos_laba_rugi ?? '',  // Default to empty string if undefined
            this.formatCurrency(report?.nominal_rupiah ?? 0),  // Format nilai nominal_rupiah
            this.formatCurrency(report?.nominal_valas ?? 0),   // Format nilai nominal_valas
            this.formatCurrency(report?.nominal_total ?? 0),   // Format nilai nominal_total
        ]);
        

        // Adding the table
        (doc as any).autoTable({
            head: [
                [
                    {
                        content: 'Pos - Pos',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Nominal Rupiah',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Nominal Valas',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Nominal Total',
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
                1: { cellWidth: 100 },
                2: { cellWidth: 100 },
                3: { cellWidth: 100 },
            },
            didDrawPage: function (data: any) {
                const headerStr = 'Laba Rugi Bank: ' + idPelapor ;
                const timestampStr = 'Date: ' + new Date().toLocaleString();
                doc.setFontSize(14);
                doc.text(headerStr, 250, 35);
                doc.setFontSize(10);
                doc.text(timestampStr, 250, 50);
                doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);

                const footerStr = 'Laba Rugi';
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
            margin: { top: 60 },
            tableWidth: 'auto',
            showHead: 'everyPage',
            tableLineColor: [189, 195, 199],
            tableLineWidth: 0.1,
        });

        doc.save('laba_rugi_bank_app.pdf');
    }
    }

    exportData(type: string) {
        if (this.selectedExportFormat === 'pdf') {
            this.exportAsPDF(type);
        } else if (this.selectedExportFormat === 'xlsx') {
            this.exportAsXLSX(type);
        }
        this.exportDialog = false;
    }

    exportAsXLSX(type: string): void {
        if (type == 'neraca'){
        const workbook = XLSX.utils.book_new();
        const timestamp = new Date().toLocaleString();
        const idPelapor = this.components1.length > 0 ? this.components1[0].id_pelapor ?? 'N/A' : 'N/A';
    
        // Data awal
        const worksheetData: (string | number)[][] = [
            ['', 'LPS'],
            ['', 'Dokumen ini di-download pada waktu:'],
            ['', timestamp],
            [],
            ['', 'Laporan Neraca Bank: ' + idPelapor],
            [],
            [
                '',
                'Pos-Pos',
                'Nominal Rupiah',
                'Nominal Valas',
                'Nominal Total',
            ],
        ];
    
        const groupedData = this.groupByCategory(this.components1);
    
        Object.keys(groupedData).forEach((category) => {
            worksheetData.push(['', category, '', '', '']);
            
            groupedData[category].forEach((report: { deskripsi_pos_laporan_keuangan: any; nominal_rupiah: any; nominal_valas: any; nominal_total: any; }) => {
                const rowData: (string | number)[] = [
                    '',
                    report?.deskripsi_pos_laporan_keuangan ?? '',  // Deskripsi Pos
                    report?.nominal_rupiah ?? 0,                   // Nominal Rupiah
                    report?.nominal_valas ?? 0,                    // Nominal Valas
                    report?.nominal_total ?? 0,                    // Nominal Total
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
            'neraca_bank_app.xlsx'
        );
    }
    else{
        const workbook = XLSX.utils.book_new();
        const timestamp = new Date().toLocaleString();
        const idPelapor = this.components2.length > 0 ? this.components2[0].id_pelapor ?? 'N/A' : 'N/A';
    
        // Data awal
        const worksheetData: (string | number)[][] = [
            ['', 'LPS'],
            ['', 'Dokumen ini di-download pada waktu:'],
            ['', timestamp],
            [],
            ['', 'Laporan Laba Rugi Bank: ' + idPelapor],
            [],
            [
                '',
                'Pos-Pos',
                'Nominal Rupiah',
                'Nominal Valas',
                'Nominal Total',
            ],
        ];
    
        const groupedData = this.groupByCategory(this.components2);
    
        Object.keys(groupedData).forEach((category) => {
            worksheetData.push(['', category, '', '', '']);
            
            groupedData[category].forEach((report: { deskripsi_pos_laba_rugi : any; nominal_rupiah: any; nominal_valas: any; nominal_total: any; }) => {
                const rowData: (string | number)[] = [
                    '',
                    report?.deskripsi_pos_laba_rugi  ?? '',  // Deskripsi Pos
                    report?.nominal_rupiah ?? 0,                   // Nominal Rupiah
                    report?.nominal_valas ?? 0,                    // Nominal Valas
                    report?.nominal_total ?? 0,                    // Nominal Total
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
            'laba_rugi_bank_app.xlsx'
        );
    }
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
        this.findSearch = '';
        table.reset();
    }

    clear2(table: Table) {
        this.findSearchLaba = '';
        table.reset();
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

    async getBankData() {
        try {
            this.dataBank = await this.crudService.getBankData();
            this.dataBank = this.dataBank.map((item: any) => ({
                label: item.id_pelapor,  // Use `id_pelapor` as the label
                value: item.id_pelapor   // Set `id_pelapor` as the value
            }));
                        console.log('dataBank', this.dataBank);
        } catch (error) {
            console.error('Failed to fetch data.', error);
        }
    }

    async getLabaRugiData() {
        try {
            this.dataLabaRugi = await this.crudService.getLabaRugiData();
            this.dataLabaRugi = this.dataLabaRugi.map((item: any) => ({
                label: item.id_pelapor,  // Use `id_pelapor` as the label
                value: item.id_pelapor   // Set `id_pelapor` as the value
            }));
                        console.log('dataLabaRugi', this.dataLabaRugi);
        } catch (error) {
            console.error('Failed to fetch data.', error);
        }
    }

    async onGlobalChange(event: any) {
        console.log('event', event);
        const key = event.value;
        console.log('key', key);
    }

    async onGlobalChangeLaba(event: any) {
        console.log('event', event);
        const key = event.value;
        console.log('key', key);
    }


    addData(data: any, edit: string) {
        const dateObj = new Date();

        const user = localStorage.getItem('username');

        console.log('data1 1 1 1 ');
        console.log('data', data);
        console.log('data1 ', this.editData);
        console.log('edit', edit);

        if (edit === 'true') {
            data.neraca_bank.id = this.editData.id;
            data.neraca_bank.id_pelapor = this.editData.id_pelapor;
            data.neraca_bank.periode_laporan = this.editData.periode_laporan;
            data.neraca_bank.periode_data = this.editData.periode_data;
            data.neraca_bank.pos_laporan_keuangan = this.editData.pos_laporan_keuangan;
            data.neraca_bank.deskripsi_pos_laporan_keuangan = this.editData.deskripsi_pos_laporan_keuangan;
            data.neraca_bank.cakupan_data = this.editData.cakupan_data;
            data.neraca_bank.deskripsi_cakupan_data = this.editData.deskripsi_cakupan_data;
            data.neraca_bank.nominal_rupiah = this.editData.nominal_rupiah;
            data.neraca_bank.nominal_valas = this.editData.nominal_valas;
            data.neraca_bank.nominal_valas_usd = this.editData.nominal_valas_usd;
            data.neraca_bank.nominal_valas_non_usd = this.editData.nominal_valas_non_usd;
            data.neraca_bank.nominal_total = this.editData.nominal_total;
            data.neraca_bank.nominal_perusahaan_induk_rupiah = this.editData.nominal_perusahaan_induk_rupiah;
            data.neraca_bank.nominal_perusahaan_induk_valas = this.editData.nominal_perusahaan_induk_valas;
            data.neraca_bank.nominal_perusahaan_induk_total = this.editData.nominal_perusahaan_induk_total;
            data.neraca_bank.nominal_perusahaan_anak_selain_asuransi_rupiah = this.editData.nominal_perusahaan_anak_selain_asuransi_rupiah;
            data.neraca_bank.nominal_perusahaan_anak_selain_asuransi_valas = this.editData.nominal_perusahaan_anak_selain_asuransi_valas;
            data.neraca_bank.nominal_perusahaan_anak_selain_asuransi_total = this.editData.nominal_perusahaan_anak_selain_asuransi_total;
            data.neraca_bank.nominal_perusahaan_anak_asuransi_rupiah = this.editData.nominal_perusahaan_anak_asuransi_rupiah;
            data.neraca_bank.nominal_perusahaan_anak_asuransi_valas = this.editData.nominal_perusahaan_anak_asuransi_valas;
            data.neraca_bank.nominal_perusahaan_anak_asuransi_total = this.editData.nominal_perusahaan_anak_asuransi_total;
            data.neraca_bank.nominal_konsolidasi_rupiah = this.editData.nominal_konsolidasi_rupiah;
            data.neraca_bank.nominal_konsolidasi_valas = this.editData.nominal_konsolidasi_valas;
            data.neraca_bank.nominal_konsolidasi_total = this.editData.nominal_konsolidasi_total;
            data.neraca_bank.buk = this.editData.buk;
            data.neraca_bank.bus = this.editData.bus;
            data.neraca_bank.uus = this.editData.uus;
            data.neraca_bank.kategori = this.editData.kategori;

            this.crudService
                .updateReport(data)
                .then((responseData) => {
                    console.log('Response from backend:', responseData);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Error sending data to backend:', error);
                });
        } else {
            console.log('data2', data);
            this.crudService
                .createReport(data)
                .then((responseData) => {
                    console.log('Response from backend:', responseData);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Error sending data to backend:', error);
                });
        }
    }
    async onBankSelect(event: any) {
        console.log(event);
    }
}
