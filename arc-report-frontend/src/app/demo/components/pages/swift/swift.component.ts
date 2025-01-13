import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../../api/product';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Representative, Data } from 'src/app/demo/api/customer';
import { SwiftService } from 'src/app/demo/service/swift.service';
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
    templateUrl: './swift.component.html',
    providers: [MessageService, ConfirmationService],
})
export class SwiftComponent implements OnInit, OnDestroy {
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
        private swiftService: SwiftService,
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
            const totalRecord: any = await this.swiftService.getSwiftAllCount();

            this.totalRecords = totalRecord;

            this.loading = false;
            console.log('totalRecord 1', this.totalRecords);
        } catch (error) {
            console.error('Failed to fetch components data:', error);
        }
    }

    async loadData(currentPage: number, perPage: number = 10) {
        this.loading = true;
        const params = {
            page: currentPage.toString(),
            perPage: perPage.toString(),
        };

        try {
            const components = await this.swiftService.getSwiftAll(params);
            this.components1 = components;

            this.loading = false;
        } catch (error) {
            console.error('Failed to fetch components data:', error);
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
                const search = await this.swiftService.getSwiftAllSearch(body);

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
                try {
                    const responseData = await this.swiftService.removeSwift(
                        data
                    );
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
            report?.equipment,
            report?.material_number,
            report?.serial_number,
            report?.material_description,
            report?.material_group,
            report?.functional_location,
            report?.aircraft_reg,
            report?.notif_w3,
            report?.order_notif_w3,
            report?.order_w4,
            report?.batch_notif_w4,
            report?.title,
            report?.po_number,
            report?.timestamp_pi,
        ]);

        (doc as any).autoTable({
            head: [
                [
                    {
                        content: 'Equipment',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Material Number',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Serial Number',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Description',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Ext. Matl Group',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Funct. Loc.',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'A/C Reg',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Notif W3',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Order Notif W3',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Order W4',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Batch Notif W4',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Title',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'PO Number',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Timestamp',
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
                const headerStr = 'Swift ARC Reports';
                const timestampStr = 'Date: ' + new Date().toLocaleString();
                doc.setFontSize(14);
                doc.text(headerStr, 250, 35);
                doc.setFontSize(10);
                doc.text(timestampStr, 250, 50);

                doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);

                const footerStr = 'Swift ARC Report';
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

        doc.save('swift_arc_report.pdf');
    }

    exportAsXLSX() {
        const workbook = XLSX.utils.book_new();
        const timestamp = new Date().toLocaleString();
        const worksheetData = [
            ['LPS'],
            ['Dokumen ini di-download pada waktu:'],
            [timestamp],
            [],
            ['Swift Reports'],
            [],
            [
                'Equipment',
                'Material Number',
                'Serial Number',
                'Description',
                'Ext. Matl Group',
                'Funct. Loc.',
                'A/C Reg',
                'Notif W3',
                'Order Notif W3',
                'Order W4',
                'Batch Notif W4',
                'Title',
                'PO Number',
                'Timestamp',
            ],
        ];

        this.components1.forEach((report, index) => {
            const rowData: string[] = [
                report?.equipment || '-',
                report?.material_number || '-',
                report?.serial_number || '-',
                report?.material_description || '-',
                report?.material_group || '-',
                report?.funct_location || '-',
                report?.aircraft_reg || '-',
                report?.notif_w3 || '-',
                report?.order_notif_w3 || '-',
                report?.order_w4 || '-',
                report?.batch_notif_w4 || '-',
                report?.title || '-',
                report?.po_number || '-',
                report?.timestamp || '-',
            ];
            worksheetData.push(rowData);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            'swift_report.xlsx'
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
        data.arc_swift.timestamp_pi = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
        console.log('data1 1 1 1 ');
        console.log('data', data);
        console.log('data1 ', this.editData);
        console.log('edit', edit);

        if (edit === 'true') {
            data.arc_swift.equipment = this.editData?.equipment;
            data.arc_swift.material_number = this.editData?.material_number;
            data.arc_swift.serial_number = this.editData?.serial_number;
            data.arc_swift.material_description =
                this.editData?.material_description;
            data.arc_swift.material_group = this.editData?.material_group;
            data.arc_swift.functional_location =
                this.editData?.functional_location;
            data.arc_swift.aircraft_reg = this.editData?.aircraft_reg;
            data.arc_swift.notif_w3 = this.editData?.notif_w3;
            data.arc_swift.order_notif_w3 = this.editData?.order_notif_w3;
            data.arc_swift.notif_w4 = this.editData?.notif_w4;
            data.arc_swift.batch_notif_w4 = this.editData?.batch_notif_w4;
            data.arc_swift.title = this.editData?.title;
            data.arc_swift.po_number = this.editData?.po_number;

            this.swiftService
                .updateSwift(data)
                .then((responseData) => {
                    console.log('Response from backend:', responseData);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Error sending data to backend:', error);
                });
        } else {
            console.log('data2', data);
            this.swiftService
                .createSwift(data)
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
