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
import { Papa } from 'ngx-papaparse'; // Untuk parsing CSV
import { SkeletonModule } from 'primeng/skeleton';

import { FormsModule, NumberValueAccessor } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { report } from 'process';

interface expandedRows {
    [key: string]: boolean;
}
@Injectable()
@Component({
    templateUrl: './laba.component.html',
    providers: [MessageService, ConfirmationService],})
export class LabaComponent implements OnInit, OnDestroy {
    components$: Customer[] = [];

    editData: any = [];

    csvData: any[] = [];

    selectedPeriode: string = '';

    csvHeaders: string[] = [];

    importDialog: boolean = false; // Kontrol visibilitas dialog

    selectedFile: File | null = null; // File yang dipilih untuk diunggah

    countries: any = [] ;

    dataLabaRugi: any = [];

    dataBank: any = [];

    dataLabaRugiPeriode: any = [];

    dataPeriode: any = [];

    kategori: string = '';

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
            id_pelapor_prefix: '', // String
            total_nominal_rupiah: null,
            total_nominal_valas: null,
            total_nominal_total: null,
        }

    };
    totalRecords: number = 100;

    totalLabaRugi: number = 100;

    findSearch: string = '';

    findSearchLaba: string = '';

    selectedBank: boolean = false;

    selectedSearch: string = '';

    selectedSearchLaba: string = '';

    loading: boolean = true;

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
        private messageService: MessageService,
        private papa: Papa
    ) {
        this.currentPage = 1;
    }

    ngOnInit() {
        const key = localStorage.getItem('key');
        this.isAdmin = key === 'admin'; // Check if the key is 'admin'

        this.loadDataTotalLaba();
        this.loadDataLaba(1, 20);
        this.getLabaRugiData();
        this.getLabaRugiDataPeriode();

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' },
        ];
    }

    async loadDataTotalLaba() {
        try {
            const totalRecord: any =
                await this.crudService.getLabaRugiReportTotal();

            this.totalLabaRugi = totalRecord[0].total;

            console.log('totalRecord 1', this.totalLabaRugi);
        } catch (error) {
            console.error('Failed to fetch component data:', error);
        }
    }

    async loadDataLaba(currentPage: number, perPage: number = 30) {
        this.loading = true;
        const params = {
            page: currentPage.toString(),
            perPage: perPage.toString(),
        };

        try {
            const components = await this.crudService.getLabaRugiReport(
                params
            );
            this.components2 = components;
            this.loading = false;
        } catch (error) {
            console.error('Failed to fetch component data:', error);
        }
    }

    async findDataLaba(keyword: string) {
        this.loading = true;
        keyword = keyword.trim();
        if (keyword.length >= 3) {
            this.loading = true;
            this.kategori = this.dataLabaRugi.find(
                (item: any) => item.value === keyword
            )?.kategori;

            console.log('keyword', keyword);
            const body = {
                keyword: keyword.toUpperCase(),
                kategori: this.kategori.toLowerCase(),
            };
            console.log('body', body);
            try {
                const search = await this.crudService.getLabaRugiReportSearch(
                    body
                );

                this.components2 = search;
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
        this.loading = true;
        this.selectedBank = true;
        keyword = keyword.trim();

        console.log('keyword 1', keyword);

        if (keyword.length >= 3) {
            this.loading = true;

            this.kategori = this.dataLabaRugi.find(
                (item: any) => item.value === keyword
            )?.kategori;

            console.log('keyword', keyword);
            const body = {
                keyword: keyword.toUpperCase(),
                kategori: this.kategori.toLowerCase(),
            };
            console.log('body', body);
            try {
                const search = await this.crudService.getLabaRugiReportSearch(
                    body
                );

                console.log('hasil search post', search);

                this.components2 = search;

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

    onLazyLoad(event: any) {
        this.pages = event.first / 30;
        this.currentPage = this.pages + 1;
        // this.loadData(this.currentPage, event.rows);
    }

    onLazyLoadLaba(event: any) {
        this.loading = true;
        this.pages = event.first / 30;
        this.currentPage = this.pages + 1;
        this.loadDataLaba(this.currentPage, event.rows);
        this.loading = false;
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
    }

    deleteProduct(data: any) {
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

    formatCurrency(amount: number): string {
        return amount.toLocaleString('id-ID', {
            style: 'decimal', 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0 
        });
    }

    exportAsPDF(type: string): void {
        const idPelapor = this.components2.length > 0 ? this.components2[0].id_pelapor_prefix ?? 'N/A' : 'N/A';
        const doc = new jsPDF('landscape', 'px', 'a4');
        const imgWidth = 130;
        const imgHeight = 40;
        let pageCount = 1; 

        const headerImgData = '/assets/layout/images/logo-white.png'; 
        doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);

        const tableData = this.components2.map((report, index) => [
            report?.deskripsi_pos_laba_rugi ?? '',  
            this.formatCurrency(report?.total_nominal_rupiah ?? 0), 
            this.formatCurrency(report?.total_nominal_valas ?? 0),  
            this.formatCurrency(report?.total_nominal_total ?? 0),  
        ]);
        
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
                1: { cellWidth: 100, halign: 'right' },
                2: { cellWidth: 100, halign: 'right' },
                3: { cellWidth: 100, halign: 'right' },
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
            didParseCell: (data: any) => {
                if (data.section === 'body' && data.column.index === 0) { 
                  const cellText: string = data.cell.raw;
                  if (cellText.toLowerCase().includes('total')) {
                    data.cell.styles.fontStyle = 'bold'; 
                  }
                }
            },
            margin: { top: 60 },
            tableWidth: 'auto',
            showHead: 'everyPage',
            tableLineColor: [189, 195, 199],
            tableLineWidth: 0.1,
        });

        doc.save('laba_rugi_bank_app.pdf');
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

  onClearFile() {
    this.selectedFile = null;
    this.csvData = [];
    this.csvHeaders = [];
  }

  cancelUpload() {
    this.selectedFile = null;  
    this.importDialog = false; 
    this.onClearFile();  
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
      this.importDialog = false;  
      this.sendFileToBackend(this.selectedFile);  
      this.onClearFile();

    } else {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Tidak ada file yang dipilih'});
    }
  }
  
  sendFileToBackend(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name); 

    console.log("nama file", file.name);
  
    this.crudService.importDataCsv(file)
      .then(response => {
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Data berhasil diimpor'});
        this.importDialog = false;
      })
      .catch(error => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Gagal mengimpor data'});
      });
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
        const workbook = XLSX.utils.book_new();
        const timestamp = new Date().toLocaleString();
        const idPelapor = this.components2.length > 0 ? this.components2[0].id_pelapor_prefix ?? 'N/A' : 'N/A';
    
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
            groupedData[category].forEach((report: { deskripsi_pos_laba_rugi : any; total_nominal_rupiah: any; total_nominal_valas: any; total_nominal_total: any; }) => {
                const rowData: (string | number)[] = [
                    '',
                    report?.deskripsi_pos_laba_rugi  ?? '',  
                    report?.total_nominal_rupiah ?? 0,                   
                    report?.total_nominal_valas ?? 0,                    
                    report?.total_nominal_total ?? 0,                    
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
        this.selectedBank = true
        window.location.reload();

    }

    clear2(table: Table) {
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

    async getLabaRugiData() {
        try {
            this.dataLabaRugi = await this.crudService.getLabaRugiData();
            this.dataLabaRugi = this.dataLabaRugi            
            .filter((item: any) => item.id_pelapor_prefix !== null && item.id_pelapor_prefix !== undefined)
            .map((item: any) => ({
                label: `${item.id_pelapor_prefix} - ${item.nama}`, // Concatenate prefix and name
                value: item.id_pelapor_prefix, // Use prefix as the value
                kategori: item.kategori,
            }));
            console.log('dataLabaRugi', this.dataLabaRugi);
        } catch (error) {
            console.error('Failed to fetch data.', error);
        }
    }

    async getLabaRugiDataPeriode() {
        try {
            this.dataLabaRugiPeriode = await this.crudService.getLabaRugiPeriode();
            this.dataLabaRugiPeriode = this.dataLabaRugiPeriode
            .filter((item: any) => item.periode_data !== null && item.periode_data !== '')
            .map((item: any) => ({
                periode: new Date(item.periode_data).toISOString().slice(0, 7), // "YYYY-MM"
            }));
                        console.log('dataLabaRugiPeriode', this.dataLabaRugiPeriode);
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

    async applyPeriodeFilter(keyword: string, event: any) {
        console.log('event', event);

        await this.selectedDataLaba(keyword);
        this.loading = true;
        if (this.components2.length > 0) {
                // const split = event.value.split('/');
                // const tahun = Number(split[0]); // Convert to number
                // const bulan = Number(split[1]); // Convert to number
            this.components2 = this.components2.filter(
                (item) => item.periode_data?.slice(0, 7) === event.value
            );
            this.loading = false;
        }
        // if (this.dt1) {
        //   this.dt1.filter(event.value, 'periode_data', 'contains');  // Correct number of arguments
        // }
      }
      


    addData(data: any, edit: string) {
        const dateObj = new Date();

        const user = localStorage.getItem('username');

        console.log('data1 1 1 1 ');
        console.log('data', data);
        console.log('data1 ', this.editData);
        console.log('edit', edit);

        if (edit === 'true') {
            data.laba_rugi.id = this.editData.id;
            data.laba_rugi.id_pelapor = this.editData.id_pelapor;
            data.laba_rugi.periode_laporan = this.editData.periode_laporan;
            data.laba_rugi.periode_data = this.editData.periode_data;
            data.laba_rugi.pos_laporan_keuangan = this.editData.pos_laporan_keuangan;
            data.laba_rugi.deskripsi_pos_laporan_keuangan = this.editData.deskripsi_pos_laporan_keuangan;
            data.laba_rugi.cakupan_data = this.editData.cakupan_data;
            data.laba_rugi.deskripsi_cakupan_data = this.editData.deskripsi_cakupan_data;
            data.laba_rugi.nominal_rupiah = this.editData.nominal_rupiah;
            data.laba_rugi.nominal_valas = this.editData.nominal_valas;
            data.laba_rugi.nominal_valas_usd = this.editData.nominal_valas_usd;
            data.laba_rugi.nominal_valas_non_usd = this.editData.nominal_valas_non_usd;
            data.laba_rugi.nominal_total = this.editData.nominal_total;
            data.laba_rugi.nominal_perusahaan_induk_rupiah = this.editData.nominal_perusahaan_induk_rupiah;
            data.laba_rugi.nominal_perusahaan_induk_valas = this.editData.nominal_perusahaan_induk_valas;
            data.laba_rugi.nominal_perusahaan_induk_total = this.editData.nominal_perusahaan_induk_total;
            data.laba_rugi.nominal_perusahaan_anak_selain_asuransi_rupiah = this.editData.nominal_perusahaan_anak_selain_asuransi_rupiah;
            data.laba_rugi.nominal_perusahaan_anak_selain_asuransi_valas = this.editData.nominal_perusahaan_anak_selain_asuransi_valas;
            data.laba_rugi.nominal_perusahaan_anak_selain_asuransi_total = this.editData.nominal_perusahaan_anak_selain_asuransi_total;
            data.laba_rugi.nominal_perusahaan_anak_asuransi_rupiah = this.editData.nominal_perusahaan_anak_asuransi_rupiah;
            data.laba_rugi.nominal_perusahaan_anak_asuransi_valas = this.editData.nominal_perusahaan_anak_asuransi_valas;
            data.laba_rugi.nominal_perusahaan_anak_asuransi_total = this.editData.nominal_perusahaan_anak_asuransi_total;
            data.laba_rugi.nominal_konsolidasi_rupiah = this.editData.nominal_konsolidasi_rupiah;
            data.laba_rugi.nominal_konsolidasi_valas = this.editData.nominal_konsolidasi_valas;
            data.laba_rugi.nominal_konsolidasi_total = this.editData.nominal_konsolidasi_total;
            data.laba_rugi.buk = this.editData.buk;
            data.laba_rugi.bus = this.editData.bus;
            data.laba_rugi.uus = this.editData.uus;
            data.laba_rugi.kategori = this.editData.kategori;

            this.crudService
                .updateReportLaba(data)
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
                .createReportLaba(data)
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

    async deleteDuplicate() {
        try {
            const responseData = await this.crudService.deleteDuplicateDataLaba();
            console.log('Response from backend:', responseData);
            window.location.reload();
        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    }

    async resetData() {
        let nama_bank: string = ""
        if (this.selectedSearch){
            nama_bank = this.selectedSearch;
        }
        else{
            nama_bank = "all"
        }
        try {
            const responseData = await this.crudService.deleteDataLaba(nama_bank);
            console.log('Response from backend:', responseData);
            window.location.reload();
        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    }
}
