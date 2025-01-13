import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Member } from '../../../api/member';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Customer } from 'src/app/demo/api/customer';
import { ComponentService } from 'src/app/demo/service/component.service';
import { AuthService } from 'src/app/demo/service/auth.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const backendUrl = environment.backendUrl;

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './administration.component.html',
    providers: [MessageService, ConfirmationService],
})
export class AdministrationComponent implements OnInit, OnDestroy {
    items!: MenuItem[];

    newAccount: any = {
        fullname: '',
        email: '',
        password: '',
        admin: '',
    };

    accountDialog: boolean = false;

    exportDialog: boolean = false;

    products!: Member[];

    users2: Member[] = [];

    subscription!: Subscription;

    users1: Customer[] = [];

    customers3: any[] = [];

    rowGroupMetadata: any;

    expandedRows: expandedRows = {};

    isExpanded: boolean = false;

    loading: boolean = true;

    submitted: boolean = false;

    selectedProducts!: Member[] | null;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private memberService: AuthService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private http: HttpClient
    ) {}

    async ngOnInit() {
        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' },
        ];
        await this.memberService.getAllUsers().then((response) => {
            this.users2 = response;
            this.loading = false;
        });
        console.log('user 2', this.users2);
        console.log(this.memberService.getAllUsers());
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    openNew() {
        this.submitted = false;
        this.accountDialog = true;
        this.exportDialog = false;
    }

    openExport() {
        this.submitted = false;
        this.accountDialog = false;
        this.exportDialog = true;
    }

    editProduct(member: Customer) {
        this.accountDialog = true;
    }

    deleteProduct(member: Member) {
        console.log('Delete Member : ', member);
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + member.fullname + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await this.memberService.deleteMember(`${member.id}`);
                    console.log('Member deleted successfully');
                    window.location.reload();
                } catch (error) {
                    console.error('Error deleting member:', error);
                }
            },
        });
    }

    selectedExportFormat: string = ''; // Selected export format (PDF or XLSX)

    exportFormats: any[] = [
        { label: 'PDF', value: 'pdf' },
        { label: 'XLSX', value: 'xlsx' },
    ];

    exportData() {
        // Handle export functionality based on selectedExportFormat
        if (this.selectedExportFormat === 'pdf') {
            // Export as PDF
            this.exportAsPDF();
        } else if (this.selectedExportFormat === 'xlsx') {
            // Export as XLSX
            this.exportAsXLSX();
        }

        // Close the export dialog
        this.exportDialog = false;
    }

    exportAsPDF() {
        const doc = new jsPDF('landscape', 'px', 'a4');
        const imgWidth = 150;
        const imgHeight = 40;
        let pageCount = 1; // Initialize page count

        // Adding the header image
        const headerImgData = '/assets/layout/images/kop-bi.png'; // Replace with the path to your header image
        doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);

        // Sample data for the table
        const tableData = this.users2.map((member, index) => [
            index + 1,
            member.id,
            member.fullname,
            member.email,
            member.admin,
            member.createdAt,
        ]);

        // Adding the table
        (doc as any).autoTable({
            head: [
                [
                    {
                        content: 'No',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Id',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Name',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Email',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Admin',
                        styles: { fillColor: [79, 129, 189], textColor: 255 },
                    },
                    {
                        content: 'Created At',
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
                headStyles: {
                    fillColor: [79, 129, 189],
                    textColor: 255,
                    halign: 'center',
                    lineWidth: 0.1,
                    lineColor: [255, 255, 255],
                },
            },
            columnStyles: {
                // Your column styles here
            },
            didDrawPage: function (data: any) {
                // Custom header on each page
                const headerStr = 'User Reports';
                const timestampStr = 'Date: ' + new Date().toLocaleString();
                doc.setFontSize(14);
                doc.text(headerStr, 250, 35);
                doc.setFontSize(10);
                doc.text(timestampStr, 250, 50);

                // Add header image on each page
                doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);

                // Footer
                const footerStr = 'User Report';
                const pageNr = 'Page ' + pageCount;
                const pageNrWidth =
                    doc.getStringUnitWidth(pageNr) * doc.internal.scaleFactor;
                const footerX = data.settings.margin.left;
                const footerY = doc.internal.pageSize.height - 10;
                doc.setFontSize(8);
                doc.text(footerStr, footerX + 20, footerY - 10);
                doc.text(pageNr, footerX + 530, footerY - 10);

                pageCount++; // Increment page count for the next page
            },
            margin: { top: 60 },
            tableWidth: 'auto',
            showHead: 'everyPage',
            tableLineColor: [189, 195, 199],
            tableLineWidth: 0.1,
        });

        doc.save('user_report.pdf');
    }

    exportAsXLSX() {
        const workbook = XLSX.utils.book_new();
        const timestamp = new Date().toLocaleString();
        const worksheetData = [
            ['LPS'],
            ['Dokumen ini di-download pada waktu:'],
            [timestamp],
            [],
            ['User Reports'],
            [],
            ['ID', 'Name', 'Email', 'Admin', 'Created At'],
        ];

        this.users2.forEach((member, index) => {
            const rowData: string[] = [
                member?.id || '-',
                member?.fullname || '-',
                member?.email || '-',
                member?.admin || '-',
                member?.createdAt || '-',
            ];
            worksheetData.push(rowData);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            'user_report.xlsx'
        );
    }

    cancelExport() {
        // Close the export dialog without performing any export action
        this.exportDialog = false;
    }

    hideDialog() {
        this.accountDialog = false;
        this.submitted = false;
        this.exportDialog = false;
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
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

    // Open the dialog
    showDialog() {
        this.accountDialog = true;
    }

    // Close the dialog and reset the form fields
    cancelAddAccount() {
        this.accountDialog = false;
        this.newAccount = {
            fullname: '',
            email: '',
            password: '',
            admin: '',
        };
    }

    async addAccount() {
        this.newAccount.admin = this.newAccount.admin == 'yes' ? 'yes' : 'no';

        console.log('New Account 1 : ', this.newAccount);
        try {
            const data = await this.memberService.registerAccount(
                this.newAccount
            );
            if (data) {
                console.log('New Account : ', this.newAccount);
                console.log('Data : ', data);
                console.log('Buat akun berhasil');
                window.location.reload();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Login Success',
                    detail: 'Have a Nice Day!',
                });
            } else {
                console.log('Buat akun gagal');
                this.messageService.add({
                    severity: 'error',
                    summary: 'Login Failed',
                    detail: 'Please check your credentials',
                });
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }

        this.cancelAddAccount();
    }

    isFormValid() {
        return (
            this.newAccount.fullname &&
            this.newAccount.email &&
            this.newAccount.password
        );
    }
}
