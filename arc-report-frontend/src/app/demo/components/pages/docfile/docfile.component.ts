import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../../api/product';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Customer, Representative, Data } from 'src/app/demo/api/customer';
import { DocfileService } from 'src/app/demo/service/docfile.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './docfile.component.html',
    providers: [MessageService, ConfirmationService],
})
export class DocfileComponent implements OnInit, OnDestroy {
    editData: any = [];

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
    };
    totalRecords: number = 100;

    findSearch: string = '';

    loading: boolean = true;

    currentPage: number = 1;

    perPage: number = 10;

    totalData: number = 100;

    pages: number = 0;

    items!: MenuItem[];

    recordDialog: boolean = false;

    editRecordDialog: boolean = false;

    exportDialog: boolean = false;

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    components1: any[] = [];

    representatives: Representative[] = [];

    statuses: any[] = [];

    rowGroupMetadata: any;

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    idFrozen: boolean = false;

    submitted: boolean = false;

    selectedProducts!: Product[] | null;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private docfileService: DocfileService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.currentPage = 1;
    }

    ngOnInit() {
        this.loadDataTotal();

        this.loadData(1, 20);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' },
        ];
    }

    async loadDataTotal() {
        this.loading = true;
        try {
            const totalRecord: any =
                await this.docfileService.getDocfileAllCount();

            this.totalRecords = totalRecord;

            this.loading = false;
            console.log('totalRecord 1', this.totalRecords);
        } catch (error) {
            console.error('Failed to fetch customer data:', error);
        }
    }

    async loadData(currentPage: number, perPage: number = 10) {
        this.loading = true;
        const params = {
            page: currentPage.toString(),
            perPage: perPage.toString(),
        };

        try {
            const component = await this.docfileService.getDocfileAll(params);
            this.components1 = component;

            this.loading = false;
        } catch (error) {
            console.error('Failed to fetch customer data:', error);
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
                const search = await this.docfileService.getDocfileAllSearch(
                    body
                );

                console.log('hasil search post', search);

                this.components1 = search;

                this.loading = false;
                console.log('hasil search post', search);
            } catch (error) {
                console.error('Failed to fetch customer data:', error);
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
        this.pages = event.first / 10;
        this.currentPage = this.pages + 1;
        console.log('currentPage', this.currentPage);
        this.loadData(this.currentPage, event.rows);
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

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
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

    editProduct(product: Data) {
        console.log(product);
        this.editData = { ...product };
        this.editRecordDialog = true;
        console.log('Edit data', this.editData?.doc_no);
    }

    deleteProduct(data: any) {
        console.log(data);
        this.confirmationService.confirm({
            message: `
            <div class="p-d-flex p-ai-center">
            <h5>Are you sure you want to delete?</h5>
            <p><strong>Doc No:</strong> ${data.doc_no}</p>
            <p><strong>Doc Location:</strong> ${data.doc_location}</p>
            </div>
          `,
            header: 'Confirmation Dialog',
            icon: 'pi pi-exclamation-triangle ml-4 w-16',
            accept: async () => {
                console.log('data', data.doc_no);
                try {
                    const responseData =
                        await this.docfileService.removeDocfile(data);
                    console.log('Response from backend:', responseData);
                    window.location.reload();
                } catch (error) {
                    console.error('Error sending data to backend:', error);
                }
            },
        });
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
        const doc = new jsPDF('landscape', 'px', 'a4');
        const imgWidth = 150;
        const imgHeight = 40;
        let pageCount = 1;

        const headerImgData = '/assets/layout/images/kop-bi.png';
        doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);

        const tableData = this.components1.map((report, index) => [
            report?.doc_no,
            report?.doc_posting_date,
            report?.doc_type,
            report?.doc_location,
            report?.doc_status,
            report?.doc_createddate,
            report?.doc_createdby,
            report?.doc_lastupdate,
            report?.doc_lastuser,
            report?.doc_category,
            report?.doc_aircrafte,
            report?.doc_work_packagee,
            report?.doc_reason,
            report?.doc_returndate,
            report?.doc_retention_schedule,
            report?.doc_last_received,
            report?.doc_last_rejected,
            report?.doc_filed,
        ]);

        (doc as any).autoTable({
            head: [
                [
                    {
                        content: 'No',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Posting Date',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Type',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Location',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Status',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Created Date',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Created By',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Last Update',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Last User',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Category',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Aircraft',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Work Package',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Reason',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Return Date',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Retention Schedule',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Last Received',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Last Rejected',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Filed',
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
                const headerStr = 'Docfile RMS Reports';
                const timestampStr = 'Date: ' + new Date().toLocaleString();
                doc.setFontSize(14);
                doc.text(headerStr, 250, 35);
                doc.setFontSize(10);
                doc.text(timestampStr, 250, 50);

                doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);

                const footerStr = 'Docfile RMS Report';
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

        doc.save('docfile_rms_report.pdf');
    }

    exportAsXLSX() {
        const workbook = XLSX.utils.book_new();
        const timestamp = new Date().toLocaleString();
        const worksheetData = [
            ['', 'LPS'],
            ['', 'Dokumen ini di-download pada waktu:'],
            ['', timestamp],
            [],
            ['', 'Docfile RMS Reports'],
            [],
            [
                'No',
                'Posting Date',
                'Type',
                'Location',
                'Status',
                'Created Date',
                'Created By',
                'Last Update',
                'Last User',
                'Category',
                'Aircraft',
                'Work Package',
                'Reason',
                'Return Date',
                'Retention Schedule',
                'Last Received',
                'Last Rejected',
                'Filed',
            ],
        ];

        this.components1.forEach((report, index) => {
            const rowData: string[] = [
                report?.doc_no || '-',
                report?.doc_posting_date || '-',
                report?.doc_type || '-',
                report?.doc_location || '-',
                report?.doc_status || '-',
                report?.doc_createddate || '-',
                report?.doc_createdby || '-',
                report?.doc_lastupdate || '-',
                report?.doc_lastuser || '-',
                report?.doc_category || '-',
                report?.doc_aircrafte || '-',
                report?.doc_workpackagee || '-',
                report?.doc_reason || '-',
                report?.doc_retentionschedule || '-',
                report?.doc_last_received || '-',
                report?.doc_last_rejected || '-',
                report?.doc_filed || '-',
            ];
            worksheetData.push(rowData);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            'docfile_rms_report.xlsx'
        );
    }

    cancelDialog() {
        this.exportDialog = false;
        this.recordDialog = false;
        this.editRecordDialog = false;
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

    addData(data: any, edit: string) {
        const dateObj = new Date();
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const seconds = dateObj.getSeconds().toString().padStart(2, '0');
        const milliseconds = dateObj
            .getMilliseconds()
            .toString()
            .padStart(2, '0');

        data.docfile.doc_createddate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        data.docfile.doc_lastupdate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        data.docfile.doc_posting_date = `${year}-${month}-${day}`;

        const user = localStorage.getItem('username');

        data.docfile.doc_createdby = user;
        data.docfile.doc_lastuser = user;

        console.log('data1 1 1 1 ');
        console.log('data', data);
        console.log('data1 ', this.editData);
        console.log('edit', edit);

        if (edit === 'true') {
            data.docfile.doc_no = this.editData?.doc_no;
            data.docfile.doc_type = this.editData?.doc_type;
            data.docfile.doc_location = this.editData?.doc_location;
            data.docfile.doc_status = this.editData?.doc_status;
            data.docfile.doc_lastupdate = this.editData?.doc_lastupdate;
            data.docfile.doc_category = this.editData?.doc_category;
            data.docfile.doc_aircrafte = this.editData?.doc_aircrafte;
            data.docfile.doc_work_packagee = this.editData?.doc_work_packagee;
            data.docfile.doc_reason = this.editData?.doc_reason;
            data.docfile.doc_returndate = this.editData?.doc_returndate;
            data.docfile.doc_retention_schedule =
                this.editData?.doc_retention_schedule;
            data.docfile.doc_last_received = this.editData?.doc_last_received;
            data.docfile.doc_last_rejected = this.editData?.doc_last_rejected;
            data.docfile.doc_filed = this.editData?.doc_filed;

            this.docfileService
                .updateDocfile(data)
                .then((responseData) => {
                    console.log('Response from backend:', responseData);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Error sending data to backend:', error);
                });
        } else {
            console.log('data2', data);
            this.docfileService
                .createDocfile(data)
                .then((responseData) => {
                    console.log('Response from backend:', responseData);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Error sending data to backend:', error);
                });
        }
    }
}
