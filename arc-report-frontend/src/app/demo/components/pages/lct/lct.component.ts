import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../../api/product';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Representative, Data } from 'src/app/demo/api/customer';
import { LocationService } from 'src/app/demo/service/location.service';
import { CrudService } from 'src/app/demo/service/crud.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface expandedRows {
    [key: string]: boolean;
}
type ReportDataType = {
    id_pelapor_prefix: string;
    deskripsi: string;
    id: string;
    nominal_rupiah: number;
    nominal_valas: number;
    nominal_total: number;
    total_nominal_rupiah: number;
    total_nominal_valas: number;
    total_nominal_total: number;
  };

  type DropdownOption = {
    label: string; // Teks yang akan ditampilkan di dropdown
    value: string; // Nilai yang akan dipilih dari dropdown
  };

@Component({
    templateUrl: './lct.component.html',
    providers: [MessageService, ConfirmationService],
})
export class LctComponent implements OnInit, OnDestroy {
    editData: any = [];

    reportDataLct: DropdownOption[] = []; // Perubahan tipe data untuk dropdown
    
    [key: string]: any;

    dataReportLct: any ;
      

    dataTable = [
        { id: 1, deskripsi_pos: 'P1001', nominal_rupiah: 1000000, nominal_valas: 500000, hasil: 'Setuju' },
        { id: 2, deskripsi_pos: 'P1002', nominal_rupiah: 2000000, nominal_valas: 1000000, hasil: 'Tinjau Ulang' },
        { id: 3, deskripsi_pos: 'P1003', nominal_rupiah: 1500000, nominal_valas: 750000, hasil: 'Setuju' },
        { id: 4, deskripsi_pos: 'P1004', nominal_rupiah: 500000, nominal_valas: 250000, hasil: 'Tolak' },
        { id: 5, deskripsi_pos: 'P1005', nominal_rupiah: 2500000, nominal_valas: 1250000, hasil: 'Setuju' }
      ];
      
    variabel1: number = 1; // Nilai default untuk Variabel 1
    variabel2: number = 1; // Nilai default untuk Variabel 2
    variabel3: number = 1; // Nilai default untuk Variabel 3
    variabel4: number = 1; // Nilai default untuk Variabel 4

    totalRecords: number = 100;

    findSearch: string = '';

    selectedSearch: string = '';

    selectedTable: string = '';

    selectedBase: string = '';

    selectedPos: string = '';

    database = [
        { label: 'Neraca Bank', value: 'neraca_bank' },
        { label: 'Laba Rugi', value: 'laba_rugi' },
      ];

    loading: boolean = true;

    items!: MenuItem[];

    modifiedDataTable: any[] = [];

    dataBank: any = [];

    recordDialog: boolean = false;

    editRecordDialog: boolean = false;

    exportDialog: boolean = false;

    selectedDataPop: ReportDataType | null = null;

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    components1: any[] = [];

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    submitted: boolean = false;

    selectedProducts!: Product[] | null;

    dataPopLct: ReportDataType[] = [];

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private locationService: LocationService,
        private crudService: CrudService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
    ) {
    }

    ngOnInit() {

        this.updateTableValues();

        this.getBankData();

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' },
        ];
    }

    onEdit(event: any) {
        console.log('Edit event:', event);
      }

    async loadDataTotal() {
        this.loading = true;
        try {
            const totalRecord: any =
                await this.locationService.getLocationAllCount();

            this.totalRecords = totalRecord;

            this.loading = false;
            console.log('totalRecord 1', this.totalRecords);
        } catch (error) {
            console.error('Failed to fetch component data:', error);
        }
    }

    async getBankData() {
        try {
            this.dataBank = await this.crudService.getBankData();
            this.dataBank = this.dataBank
            .filter((item: any) => item.id_pelapor_prefix !== null) // Filter out items with `id_pelapor` as null
            .map((item: any) => ({
                label: item.id_pelapor_prefix,  // Use `id_pelapor` as the label
                value: item.id_pelapor_prefix   // Set `id_pelapor` as the value
            }));
                        console.log('dataBank', this.dataBank);
        } catch (error) {
            console.error('Failed to fetch data.', error);
        }
    }

    buttonLct(event: any) {
        const keyword = event.value.value;
        this.getReportLct(this.selectedSearch, keyword);
    }

    findDataById(id: string): void {
        if (this.dataPopLct && Array.isArray(this.dataPopLct)) {
          this.selectedDataPop = this.dataPopLct.find((item) => item.id === id) || null;
        } else {
          console.warn('Data not found or dataPopLct is not an array.');
          this.selectedDataPop = null;
        }
      }
    
      onPosChange(): void {
        if (this.selectedPos) {
          this.findDataById(this.selectedPos);
          console.log('Selected Data:', this.selectedDataPop);
        } else {
          this.selectedDataPop = null;
        }
      }

    async getReportLct(tableName: string, keyword: string): Promise<void> {
        console.log('Table Name:', tableName);
        console.log('Keyword:', keyword);
      
        try {
          if (!tableName || !keyword) {
            throw new Error('Table name and keyword must be provided');
          }
      
          // Pastikan result selalu berupa array
          const result = (await this.crudService.getDataLct(tableName, keyword)) as ReportDataType[] | undefined;
      
          if (Array.isArray(result)) {
            this.dataPopLct = result;
            this.reportDataLct = result.map((item) => ({
              label: item.deskripsi,
              value: item.id,
            }));
            console.log('Report Data LCT:', this.dataPopLct);
          } else {
            console.warn('Result is not an array or is undefined:', result);
            this.dataPopLct = []; // Atur default data asli ke array kosong jika tidak valid
            this.reportDataLct = []; // Atur default data dropdown ke array kosong
          }
        } catch (error) {
          console.error('Failed to fetch report data:', error);
        }
      }
      
      
      
    async loadData(currentPage: number, perPage: number = 10) {
        this.loading = true;
        const params = {
            page: currentPage.toString(),
            perPage: perPage.toString(),
        };

        try {
            const components = await this.locationService.getLocationAll(
                params
            );
            this.components1 = components;

            this.loading = false;
        } catch (error) {
            console.error('Failed to fetch components data:', error);
        }
    }

    updateTableValues(): void {
        this.modifiedDataTable = this.modifiedDataTable.map(row => {
            const originalNominalRupiah = row.original_nominal_rupiah ?? row.nominal_rupiah;
            const originalNominalValas = row.original_nominal_valas ?? row.nominal_valas;
    
            const nominalRupiah = originalNominalRupiah * this.variabel1;
            const nominalValas = originalNominalValas * this.variabel2;
            const hasil = this.calculateHasil(nominalRupiah, nominalValas);
    
            return {
                ...row, 
                original_nominal_rupiah: originalNominalRupiah, 
                original_nominal_valas: originalNominalValas, 
                nominal_rupiah: nominalRupiah, 
                nominal_valas: nominalValas, 
                hasil: hasil
            };
        });
    }
    
      
      calculateHasil(nominalRupiah: number, nominalValas: number): string {
        const total = nominalRupiah + nominalValas;
        if (total > 5000000) {
          return 'Setuju';
        } else if (total > 3000000) {
          return 'Tinjau Ulang';
        } else {
          return 'Tolak';
        }
      }
    
      // Trigger saat variabel diubah
      onVariableChange(): void {
        this.updateTableValues();
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
                const search = await this.locationService.getLocationAllSearch(
                    body
                );

                console.log('hasil search post', search);

                this.components1 = search;

                this.loading = false;
                console.log('hasil search post', search);
            } catch (error) {
                console.error('Failed to fetch components data:', error);
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


    selectedExportFormat: string = '';

    exportFormats: any[] = [
        { label: 'PDF', value: 'pdf' },
        { label: 'XLSX', value: 'xlsx' },
    ];

    exportData() {
        if (this.selectedExportFormat === 'pdf') {
            this.exportAsPDF();
        } else if (this.selectedExportFormat === 'xlsx') {
            this.exportAsXLSX();
        }

        this.exportDialog = false;
    }

    exportAsPDF() {
        const doc = new jsPDF('portrait', 'px', 'a4');
        const imgWidth = 150;
        const imgHeight = 40;
        let pageCount = 1;

        const headerImgData = '/assets/layout/images/kop-bi.png';
        doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);

        const tableData = this.components1.map((report, index) => [
            report?.doc_box,
            report?.doc_locations,
        ]);

        (doc as any).autoTable({
            head: [
                [
                    {
                        content: 'Doc Box',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Doc Location',
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
                // Your column styles here
            },
            didDrawPage: function (data: any) {
                const headerStr = 'Location RMS Reports';
                const timestampStr = 'Date: ' + new Date().toLocaleString();
                doc.setFontSize(14);
                doc.text(headerStr, 250, 35);
                doc.setFontSize(10);
                doc.text(timestampStr, 250, 50);

                doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);

                const footerStr = 'Location RMS Report';
                const pageNr = 'Page ' + pageCount;
                const pageNrWidth =
                    doc.getStringUnitWidth(pageNr) * doc.internal.scaleFactor;
                const footerX = data.settings.margin.left;
                const footerY = doc.internal.pageSize.height - 10;
                doc.setFontSize(8);
                doc.text(footerStr, footerX + 20, footerY - 10);
                doc.text(pageNr, footerX + 350, footerY - 10);

                pageCount++;
            },
            margin: { top: 60 },
            tableWidth: 'auto',
            showHead: 'everyPage',
            tableLineColor: [189, 195, 199],
            tableLineWidth: 0.1,
        });

        doc.save('location_rms_report.pdf');
    }

    exportAsXLSX() {
        const workbook = XLSX.utils.book_new();
        const timestamp = new Date().toLocaleString();
        const worksheetData = [
            ['LPS'],
            ['Dokumen ini di-download pada waktu:'],
            [timestamp],
            [],
            ['Locations RMS Reports'],
            [],
            ['Doc Box', 'Doc Locations'],
        ];

        this.components1.forEach((report, index) => {
            const rowData: string[] = [
                report?.doc_box || '-',
                report?.doc_location || '-',
            ];
            worksheetData.push(rowData);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            'location_rms_report.xlsx'
        );
    }

    cancelDialog() {
        this.exportDialog = false;
        this.recordDialog = false;
        this.editRecordDialog = false;
        this.recordDialog = false; // Tutup dialog
        this.selectedBase = ''; // Reset pilihan jenis laporan
        this.selectedPos = ''; // Reset pilihan pos
        this.selectedDataPop = null; // Clear data yang ditampilkan
    }

    hideDialog() {
        this.editRecordDialog = false;
        this.recordDialog = false;
        this.submitted = false;
        this.exportDialog = false;
    }

    clear(table: Table) {
        this.findSearch = '';
        table.reset();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    // Fungsi untuk menambahkan data ke dalam tabel
    addData(): void {
        if (this.selectedBase && this.selectedPos && this.selectedDataPop) {
        const newData = {
            pos: this.selectedDataPop.deskripsi, // Pos yang dipilih
            nominal_rupiah: this.selectedDataPop.total_nominal_rupiah || 0, // Nominal Rupiah
            nominal_valas: this.selectedDataPop.total_nominal_valas || 0, // Nominal Valas
            nominal_total: this.selectedDataPop.total_nominal_total || 0, // Nominal Total
            hasil: 'Setuju', // Default hasil
        };
    
        // Tambahkan data ke tabel
        this.modifiedDataTable = [...this.modifiedDataTable, newData];
    
        // Reset popup data setelah menyimpan
        this.cancelDialog();
        } else {
        console.warn('Data is incomplete. Please fill in all fields before saving.');
        }
    }
      
}
