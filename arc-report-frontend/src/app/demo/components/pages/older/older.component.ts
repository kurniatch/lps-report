import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../../api/product';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ViewChild, ElementRef } from '@angular/core';
import {
    Report,
    Representative,
    ReportStatus,
} from 'src/app/demo/api/customer';
import { OlderService } from 'src/app/demo/service/older.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';

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

const token = localStorage.getItem('token');
console.log('Token : ', token);

@Component({
    templateUrl: './older.component.html',
    providers: [MessageService, ConfirmationService],
})
export class OlderComponent implements OnInit, OnDestroy {
    @ViewChild('dt1') table!: ElementRef;

    items!: MenuItem[];

    llpTotal: any = {
        linked: 0,
        baseline: 0,
        percentage: 0,
    };

    tcTotal: any = {
        linked: 0,
        baseline: 0,
        percentage: 0,
    };

    nonTcTotal: any = {
        linked: 0,
        baseline: 0,
        percentage: 0,
    };

    dataDeleted: any = {
        key: '',
    };

    summaryTotal: number = 0;

    plane: Plane[] = [];

    dataOperator: any = [];

    operator: Operator[] = [];

    selectedPlane: Plane | undefined;

    selectedOperator: Plane | undefined;

    selectedOperator2: Plane | undefined;

    exportDialog1: boolean = false;

    exportDialog2: boolean = false;

    totalAvailable: number = 0;

    totalUnavailable: number = 0;

    totalDocuments: number = 0;

    totalGeneral: number = 0;

    totalNull: any = '0';

    totalGeneralStatus: any = '0';

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

    loadingChart: boolean = true;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private olderService: OlderService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
    }

    ngOnInit() {
        const key = localStorage.getItem('key');
        this.isAdmin = key === 'admin';

        this.initChart();

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' },
        ];

        this.operator = [
            { name: 'Garuda', code: 'GA' },
            { name: 'Citilink', code: 'CITI' },
            { name: 'Other', code: '' },
        ];
    }

    async fecthDataTable2() {
        try {
            const [report] = await Promise.all([
                this.olderService.getOlderTotal(),
            ]);

            this.reports2 = report;
            this.loading2 = false;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async fecthDataTable1() {
        try {
            const [report] = await Promise.all([this.olderService.getOlder()]);

            this.reports1 = report;
            this.loading = false;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async initChart() {
        this.loadingChart = false;

        await this.getOperatorData();

        this.fecthDataTable2();

        this.fecthDataTable1();

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

    exportData(key: string) {
        if (this.selectedExportFormat === 'pdf') {
            this.exportAsPDF1(key);
        } else if (this.selectedExportFormat === 'xlsx') {
            this.exportAsXLSX1(key);
        }
        this.exportDialog1 = false;
    }

    exportAsPDF1(key: string) {
        const doc = new jsPDF('landscape', 'px', 'a4');
        const imgWidth = 150;
        const imgHeight = 40;
        let pageCount = 1;
        let headerStr = '';
        let footerStr = '';
        let headerContent;
        let tableData: (string | number)[][] = [];
        const headerImgData = '/assets/layout/images/kop-bi.png';

        if (key === 'report') {
            headerStr = 'ARC Reports';
            footerStr = 'ARC Reports';
            const initialAcc: (string | number)[][] = [];
            tableData = this.reports1.reduce((acc, report, index) => {
                const rowData: (string | number)[] = [
                    index + 1,
                    report?.aircraft_reg || 'Others',
                    report?.llp_linked || '0',
                    report?.llp_baseline || '0',
                    parseFloat(report?.llp_percentage || '0').toFixed(2) + '%',
                    report?.tc_linked || '0',
                    report?.tc_baseline || '0',
                    parseFloat(report?.tc_percentage || '0').toFixed(2) + '%',
                    report?.non_tc_linked || '0',
                    report?.non_tc_baseline || '0',
                    parseFloat(report?.non_tc_percentage || '0').toFixed(2) +
                        '%',
                    report?.total_count || '0',
                ];

                this.tempOperators[index + 1] = report?.ac_type;
                if (report?.ac_type !== this.tempOperators[index]) {
                    const headerRow: any[] = [
                        {
                            content: report?.ac_type || 'Others',
                            colSpan: 12,
                            styles: { fontStyle: 'bold' },
                        },
                    ];
                    acc.push(
                        headerRow.concat(Array(rowData.length - 2).fill(''))
                    );
                }

                acc.push(rowData);

                return acc;
            }, initialAcc);
            headerContent = 'Registrasi';
        } else {
            console.log('selectedOperator', this.selectedOperator2?.operator);
            let operatorName = this.selectedOperator2?.operator || 'General';

            switch (operatorName) {
                case 'GA':
                    operatorName = 'Garuda';
                    break;
                case 'CITI':
                    operatorName = 'Citilink';
                    break;
                case 'NAM':
                    operatorName = 'NAM Air';
                    break;
                case 'SJY':
                    operatorName = 'Sriwijaya Air';
                    break;
                case 'XPR':
                    operatorName = 'Xpress Air';
                    break;
                case 'LNI':
                    operatorName = 'Lion Air';
                    break;
                case 'WON':
                    operatorName = 'Wings Air';
                    break;
                default:
                    operatorName = '';
                    break;
            }

            headerStr = `ARC Report Total ${operatorName}`;

            footerStr = 'ARC Report Total';
            console.log('total', this.llpTotal.linked);
            const initialAcc: (string | number)[][] = [];
            tableData = this.reports2.reduce((acc, report, index) => {
                const rowData: (string | number)[] = [
                    index + 1,
                    report?.ac_type || 'Others',
                    report?.llp_linked || '0',
                    report?.llp_baseline || '0',
                    parseFloat(report?.llp_percentage || '0').toFixed(2) + '%',
                    report?.tc_linked || '0',
                    report?.tc_baseline || '0',
                    parseFloat(report?.tc_percentage || '0').toFixed(2) + '%',
                    report?.non_tc_linked || '0',
                    report?.non_tc_baseline || '0',
                    parseFloat(report?.non_tc_percentage || '0').toFixed(2) +
                        '%',
                    report?.total_count || '0',
                ];

                this.llpTotal.linked += report?.llp_linked || 0;
                this.llpTotal.baseline += report?.llp_baseline || 0;
                this.llpTotal.percentage += parseFloat(
                    report?.llp_percentage || '0'
                );
                this.tcTotal.linked += report?.tc_linked || 0;
                this.tcTotal.baseline += report?.tc_baseline || 0;
                this.tcTotal.percentage += parseFloat(
                    report?.tc_percentage || '0'
                );
                this.nonTcTotal.linked += report?.non_tc_linked || 0;
                this.nonTcTotal.baseline += report?.non_tc_baseline || 0;
                this.nonTcTotal.percentage += parseFloat(
                    report?.non_tc_percentage || '0'
                );

                this.summaryTotal += report?.total_count || 0;

                this.tempType[index + 1] = report?.operator;
                if (report?.operator !== this.tempType[index]) {
                    console.log('report', report?.operator);
                    console.log('tempType', this.tempType[index]);
                    console.log('index', index);
                    const headerRow: any[] = [
                        {
                            content: report?.operator || 'Others',
                            colSpan: 12,
                            styles: { fontStyle: 'bold' },
                        },
                    ];
                    acc.push(
                        headerRow.concat(Array(rowData.length - 2).fill(''))
                    );
                }
                console.log('rowData', rowData);
                acc.push(rowData);

                return acc;
            }, initialAcc);
            console.log('tableData', tableData);
            const totalRow: (string | number)[] = [
                '',
                'Total',
                this.llpTotal.linked,
                this.llpTotal.baseline,
                (this.llpTotal.percentage / this.reports2.length).toFixed(2) +
                    '%',
                this.tcTotal.linked,
                this.tcTotal.baseline,
                (this.tcTotal.percentage / this.reports2.length).toFixed(2) +
                    '%',
                this.nonTcTotal.linked,
                this.nonTcTotal.baseline,
                (this.nonTcTotal.percentage / this.reports2.length).toFixed(2) +
                    '%',
                this.summaryTotal,
            ];
            tableData.push(['', '', '', '', '', '', '', '', '', '', '', '']);
            tableData.push(totalRow);
            headerContent = 'AC Type';
        }

        const timestampStr = 'Date: ' + new Date().toLocaleString();
        doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);
        doc.setFontSize(14);
        doc.text(headerStr, 250, 35);
        doc.setFontSize(10);
        doc.text(timestampStr, 250, 50);

        (doc as any).autoTable({
            head: [
                [
                    {
                        content: 'No',
                        rowSpan: 2,
                    },
                    {
                        content: headerContent,
                        rowSpan: 2,
                    },
                    {
                        content: 'LLP',
                        colSpan: 3,
                    },
                    {
                        content: 'TC',
                        colSpan: 3,
                    },
                    {
                        content: 'NON-TC',
                        colSpan: 3,
                    },
                    {
                        content: 'Total Data',
                        rowSpan: 2,
                    },
                ],
                [
                    'Linked',
                    'Baseline',
                    'Percent',
                    'Linked',
                    'Baseline',
                    'Percent',
                    'Linked',
                    'Baseline',
                    'Percent',
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
                0: { cellWidth: 20 },
                1: { cellWidth: 70 },
            },
            didDrawPage: function (data: any) {
                const pageNr = 'Page ' + pageCount;
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
        if (key === 'report') {
            doc.save('arc_report.pdf');
        } else {
            doc.save('arc_total_report.pdf');
        }
    }

    exportAsXLSX1(key: string) {
        const XLSX = require('xlsx');
        const { saveAs } = require('file-saver');

        const regType = key === 'report' ? 'Registrasi' : 'AC Type';

        const workbook = XLSX.utils.book_new();
        const timestamp = new Date().toLocaleString();
        const headerStr =
            key === 'report' ? 'ARC Reports' : 'ARC Reports Total';
        const worksheetData = [
            ['', 'LPS'],
            ['', 'Dokumen ini di-download pada waktu:'],
            ['', timestamp],
            [],
            ['', headerStr],
            [],
            [
                'No',
                regType,
                'LLP',
                '',
                '',
                'TC',
                '',
                '',
                'NON-TC',
                '',
                '',
                'Total Data',
            ],
            [
                '',
                '',
                'Linked',
                'Baseline',
                'Percent',
                'Linked',
                'Baseline',
                'Percent',
                'Linked',
                'Baseline',
                'Percent',
                '',
            ],
        ];

        const tableData = key === 'report' ? this.reports1 : this.reports2;
        let prevACType = '';
        let prevOperator = '';
        let totalLlpLinked = 0;
        let totalLlpBaseline = 0;
        let totalLlpPercentage = 0;

        let totalTcLinked = 0;
        let totalTcBaseline = 0;
        let totalTcPercentage = 0;

        let totalNonTcLinked = 0;
        let totalNonTcBaseline = 0;
        let totalNonTcPercentage = 0;

        let totalRowCount = 0;
        tableData.forEach((report, index) => {
            const regOrType =
                key === 'report'
                    ? report?.aircraft_reg || 'Others'
                    : report?.ac_type || 'Others';
            const regOrOp =
                key === 'report'
                    ? report?.ac_type || 'Others'
                    : report?.operator || 'Others';

            if (key === 'report') {
                if (report.ac_type !== prevACType) {
                    const subheaderRow: any[] = [
                        {
                            value: regOrType,
                            headerStyle: {
                                alignment: {
                                    horizontal: 'center',
                                    vertical: 'center',
                                },
                            },
                            colSpan: 3,
                        },
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                    ];
                    worksheetData.push([
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                    ]);
                    worksheetData.push(subheaderRow.map((item) => item.value));
                    prevACType = report.ac_type;
                }
            } else {
                if (report.operator !== prevOperator) {
                    const subheaderRow: any[] = [
                        {
                            value: regOrOp,
                            style: {
                                cell: {
                                    alignment: {
                                        horizontal: 'center',
                                        vertical: 'center',
                                    },
                                    bold: true,
                                },
                            },
                            colSpan: 3,
                        },
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                    ];
                    worksheetData.push([
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                    ]);
                    worksheetData.push(subheaderRow.map((item) => item.value));
                    prevOperator = report.operator;
                }
            }

            const rowData = [
                index + 1,
                regOrType,
                report?.llp_linked || '0',
                report?.llp_baseline || '0',
                parseFloat(report?.llp_percentage || '0').toFixed(2) + '%',
                report?.tc_linked || '0',
                report?.tc_baseline || '0',
                parseFloat(report?.tc_percentage || '0').toFixed(2) + '%',
                report?.non_tc_linked || '0',
                report?.non_tc_baseline || '0',
                parseFloat(report?.non_tc_percentage || '0').toFixed(2) + '%',
                report?.total_count || '0',
            ];
            worksheetData.push(rowData);

            totalLlpLinked += report?.llp_linked || 0;
            totalLlpBaseline += report?.llp_baseline || 0;
            totalLlpPercentage += parseFloat(report?.llp_percentage || '0');

            totalTcLinked += report?.tc_linked || 0;
            totalTcBaseline += report?.tc_baseline || 0;
            totalTcPercentage += parseFloat(report?.tc_percentage || '0');

            totalNonTcLinked += report?.non_tc_linked || 0;
            totalNonTcBaseline += report?.non_tc_baseline || 0;
            totalNonTcPercentage += parseFloat(
                report?.non_tc_percentage || '0'
            );

            totalRowCount += report?.total_count || 0;
        });
        worksheetData.push([]);

        if (key === 'total') {
            worksheetData.push([
                '',
                'Total',
                totalLlpLinked.toString(),
                totalLlpBaseline.toString(),
                (totalLlpPercentage / tableData.length).toFixed(2) + '%',
                totalTcLinked.toString(),
                totalTcBaseline.toString(),
                (totalTcPercentage / tableData.length).toFixed(2) + '%',
                totalNonTcLinked.toString(),
                totalNonTcBaseline.toString(),
                (totalNonTcPercentage / tableData.length).toFixed(2) + '%',
                totalRowCount.toString(),
            ]);
        }

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        const centerStyle = {
            alignment: {
                horizontal: 'center',
                vertical: 'center',
                wrapText: true,
            },
        };

        for (const cellAddress in worksheet) {
            if (worksheet.hasOwnProperty(cellAddress)) {
                const cell = worksheet[cellAddress];
                if (cell && cell.t === 's') {
                    Object.assign(cell, centerStyle);
                }
            }
        }

        const merges = [
            { s: { r: 6, c: 2 }, e: { r: 6, c: 4 } },
            { s: { r: 6, c: 5 }, e: { r: 6, c: 7 } },
            { s: { r: 6, c: 8 }, e: { r: 6, c: 10 } },
            { s: { r: 6, c: 0 }, e: { r: 7, c: 0 } },
            { s: { r: 6, c: 1 }, e: { r: 7, c: 1 } },
            { s: { r: 6, c: 11 }, e: { r: 7, c: 11 } },
        ];

        worksheet['!merges'] = merges;

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            'arc_report.xlsx'
        );
    }

    cancelExport() {
        this.exportDialog1 = false;
        this.exportDialog2 = false;
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

    async onGlobalFilter(table: Table, event: Event, dt: string) {
        if (dt === 'dt1') {
            await this.fecthDataTable1();
            this.loading = true;
        } else if (dt === 'dt2') {
            await this.fecthDataTable2();
            this.loading2 = true;
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

    async onGlobalPlane(table: Table, event: any, key: string) {
        if (event.value.operator === 'Others') {
            event.value.operator = null;
        }
        console.log('event', event.value.operator);
        if (key === 'report') {
            this.loading = true;
            await this.fecthDataTable1();
            table.filterGlobal(event.value.operator, 'startsWith');
            setTimeout(() => {
                this.reports1 = table.filteredValue || [];
                this.loading = false;
            }, 500);
        } else {
            this.loading2 = true;
            await this.fecthDataTable2();
            table.filterGlobal(event.value.operator, 'startsWith');
            setTimeout(() => {
                this.reports2 = table.filteredValue || [];
                this.loading2 = false;
            }, 500);
        }
    }

    async clear(table: Table, dt: string) {
        console.log('report', this.reports2);
        table.clear();
        this.filter.nativeElement.value = '';
        if (dt === 'dt1') {
            await this.fecthDataTable1();
        } else if (dt === 'dt2') {
            await this.fecthDataTable2();
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
            const data = await this.olderService.getOperatorData();
            this.dataOperator = data;
            this.dataOperator = this.dataOperator.map((item: any) => ({
                ...item,
                operator: item.operator || 'Others',
            }));
        } catch (error) {
            console.error('Failed to fetch component data.', error);
        }
    }

    async addComponent(data: any, keyword: string) {
        let message = '';
        let fieldKey = '';

        console.log('data1', data);

        if (keyword === 'report') {
            message = `
                <div class="p-d-flex p-ai-center">
                <h5>Are you sure you want to add component?</h5>
                <p><strong>AC Type:</strong> ${data.ac_type}</p>
                <p><strong>Aircraft Registration:</strong> ${data.aircraft_reg}</p>
                </div>
              `;
            fieldKey = 'aircraft_reg';
            this.dataDeleted.key = data.aircraft_reg;
            this.confirmationService.confirm({
                message,
                header: 'Confirmation Dialog',
                icon: 'pi pi-exclamation-triangle ml-4 w-16',
                accept: async () => {
                    console.log('data', this.dataDeleted);
                    try {
                        const responseData =
                            await this.olderService.removeOlder(
                                this.dataDeleted
                            );
                        console.log('Response from backend:', responseData);
                        window.location.reload();
                    } catch (error) {
                        console.error('Error sending data to backend:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Failed Delete Data',
                            detail: 'Delete data must from Report Old Total',
                        });
                    }
                },
            });
        } else {
            message = `
                <div class="p-d-flex p-ai-center">
                <h5>Are you sure you want to add component?</h5>
                <p><strong>Operator:</strong> ${data.operator}</p>
                <p><strong>AC Type:</strong> ${data.ac_type}</p>
                </div>
              `;
            fieldKey = 'ac_type';
            this.dataDeleted.key = data.ac_type;
            this.confirmationService.confirm({
                message,
                header: 'Confirmation Dialog',
                icon: 'pi pi-exclamation-triangle ml-4 w-16',
                accept: async () => {
                    console.log('data', this.dataDeleted);
                    try {
                        const responseData =
                            await this.olderService.removeOlder2(
                                this.dataDeleted
                            );
                        console.log('Response from backend:', responseData);
                        window.location.reload();
                    } catch (error) {
                        console.error('Error sending data to backend:', error);
                    }
                },
            });
        }
    }
}
