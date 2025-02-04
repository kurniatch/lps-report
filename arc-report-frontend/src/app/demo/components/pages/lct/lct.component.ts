import { Component, OnInit, OnDestroy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Product } from '../../../api/product';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Representative, Data } from 'src/app/demo/api/customer';
import { LocationService } from 'src/app/demo/service/location.service';
import { ScvService } from 'src/app/demo/service/scv.service';
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

interface DataTableNeracaBank {
    kas: number;
    penempatanPadaBI: number;
    penempatanPadaBankLain: number;
    tagihanSpotDanDerivatif: number;
    suratBerharga: number;
    ckpnSuratBerharga: number;
    suratBerhargaRepo: number;
    reverseRepo: number;
    tagihanAkseptasi: number;
    kredit: number;
    ckpnKredit: number;
    asetKeuanganLain: number;
    ckpnAsetKeuanganLain: number;
    asetTetapDanInventaris: number;
    akumulasiPenyusutan: number;
    asetTidakBerwujud: number;
    akumulasiAmortisasi: number;
    propertiTerbengkalai: number;
    ayda: number;
    asetLainnya: number;
    totalAset: number;
    penyertaanModal: number;
    rekeningTunda: number;
  
    giro: number;
    tabungan: number;
    simpananBerjangka: number;
    uangElektronik: number;
    kewajibanPadaBankIndonesia: number;
    kewajibanPadaBankLain: number;
    kewajibanSpotDanDerivatif: number;
    kewajibanRepo: number;
    kewajibanAkseptasi: number;
    suratBerhargaYangDiterbitkan: number;
    pinjaman: number;
    setoranJaminan: number;
    kewajibanLainnya: number;
    totalKewajiban: number;
  
    modalDasar: number;
    modalYangBelumDisetor: number;
    agio: number;
    penghasilanKomprehensifLain: number;
    danaSetoranModal: number;
    cadanganUmum: number;
    labaTahunLalu: number;
    labaTahunBerjalan: number;
    dividenYangDiBayarkan: number;
    totalEkuitas: number;
  
    totalKewajibanDanEkuitas: number;
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
    
    dataTableNeracaBank: DataTableNeracaBank = {
        kas: 355946679462,
        penempatanPadaBI: 13008172313408,
        penempatanPadaBankLain: 1458451807258,
        tagihanSpotDanDerivatif: 69311274,
        suratBerharga: 8896715838433,
        ckpnSuratBerharga: 0,
        suratBerhargaRepo: 0,
        reverseRepo: 983443463645,
        tagihanAkseptasi: 295023898276,
        kredit: 105718143720092,
        ckpnKredit: 1330279622151,
        penyertaanModal: 1251142161,
        asetKeuanganLain: 4563053374405,
        ckpnAsetKeuanganLain: 1109657144,
        asetTetapDanInventaris: 5473012302104,
        akumulasiPenyusutan: 1164168141068,
        asetTidakBerwujud: 0,
        akumulasiAmortisasi: 0,
        propertiTerbengkalai: 32545208000,
        ayda: 298912742024,
        asetLainnya: 10165519352243,
        rekeningTunda: 1514262718,
        totalAset: 148753452590261,
      
        giro: 5119950312333,
        tabungan: 10894237572343,
        simpananBerjangka: 109094117683246,
        uangElektronik: 1020293201,
        kewajibanPadaBankIndonesia: 2130130360182,
        kewajibanPadaBankLain: 2130130360182,
        kewajibanSpotDanDerivatif: 193846954,
        kewajibanRepo: 0,
        kewajibanAkseptasi: 295023898276,
        suratBerhargaYangDiterbitkan: 801481118334,
        pinjaman: 880000000000,
        setoranJaminan: 4253228836,
        kewajibanLainnya: 2525005545193,
        totalKewajiban: 131744393565697,
      
        modalDasar: 5300000000000,
        modalYangBelumDisetor: 3961460515000,
        agio: 8364828457816,
        penghasilanKomprehensifLain: 1595626189836,
        danaSetoranModal: 2144516116500,
        cadanganUmum: 131600000000,
        labaTahunLalu: 3361336312523,
        labaTahunBerjalan: 72612462889,
        dividenYangDiBayarkan: 262725372,
        totalEkuitas: 17009059024564,
        
        totalKewajibanDanEkuitas: 148753452590261,
      };
      
    results : any ;

    baseAssets = [
        { label: 'ASET', value: null, isSubheader: true },
        { label: 'Kas', value: 355946679462 },
        { label: 'Penempatan pada BI', value: 13008172313408 },
        { label: 'Penempatan pada Bank Lain', value: 1458451807258 },
        { label: 'Tagihan Spot dan Derivatif', value: 69311274 },
        { label: 'Surat Berharga', value: 8896715838433 },
        { label: 'CKPN Surat Berharga (-)', value: 0, indent: 1 },
        { label: 'Surat Berharga (Repo)', value: 0 },
        { label: 'Reverse Repo', value: 983443463645 },
        { label: 'Tagihan Akseptasi', value: 295023898276 },
        { label: 'Kredit', value: 105718143720092 },
        { label: 'CKPN Kredit (-)', value: 1330279622151, indent: 1 },
        { label: 'Aset Keuangan Lain', value: 4563053374405 },
        { label: 'CKPN Aset Keuangan Lain (-)', value: 1109657144, indent: 1 },
        { label: 'Aset Tetap dan Inventaris', value: 5473012302104 },
        { label: 'Akumulasi Penyusutan (-)', value: 1164168141068, indent: 1 },
        { label: 'Aset Tidak Berwujud', value: 0 },
        { label: 'Akumulasi Amortisasi', value: 0 },
        { label: 'Properti Terbengkalai', value: 32545208000 },
        { label: 'AYDA', value: 298912742024 },
        { label: 'Aset Lainnya', value: 10165519352243 },
        { label: 'TOTAL ASET', value: 148753452590261, isTotal: true }
      ];
      
      assets = [...this.baseAssets];
      assetsBankAsal = [...this.baseAssets];
      assetsBankAsalPemburukan = [...this.baseAssets];
      assetsBankAsalPemburukanC = [...this.baseAssets];

      baseLiabilitiesEquity = [
        { label: 'LIABILITAS', value: null, isSubheader: true },
        { label: 'Giro', value: 5119950312333 },
        { label: 'Tabungan', value: 10894237572343 },
        { label: 'Simpanan Berjangka', value: 109094117683246 },
        { label: 'Kewajiban pada Bank Lain', value: 2130130360182 },
        { label: 'Kewajiban Spot dan Derivatif', value: 193846954 },
        { label: 'Kewajiban Repo', value: 0 },
        { label: 'Kewajiban Akseptasi', value: 295023898276 },
        { label: 'Surat Berharga yang Diterbitkan', value: 801481118334 },
        { label: 'Pinjaman', value: 880000000000 },
        { label: 'Setoran Jaminan', value: 4253228836 },
        { label: 'Kewajiban Lainnya', value: 2525005545193 },
        { label: 'Total Kewajiban', value: 131744393565697, isTotal: true },
        { label: 'EKUITAS', value: null, isSubheader: true },
        { label: 'Modal Disetor', value: null },
        { label: 'Modal Dasar', value: 5300000000000, indent: 1 },
        { label: 'Modal yg Belum Disetor (-)', value: 3961460515000, indent: 1 },
        { label: 'Tambahan Modal Disetor', value: null },
        { label: 'Agio', value: 8364828457816, indent: 1 },
        { label: 'Penghasilan Komprehensif Lain', value: 1595626189836 },
        { label: 'Dana Setoran Modal', value: 2144516116500 },
        { label: 'Cadangan Umum', value: 131600000000 },
        { label: 'Laba (Rugi)', value: null },
        { label: 'Laba Tahun Lalu', value: 3361336312523, indent: 1 },
        { label: 'Laba Tahun Berjalan', value: 72612462889, indent: 1 },
        { label: 'Total Ekuitas', value: 17009059024564, isTotal: true },
        { label: 'TOTAL KEWAJIBAN DAN EKUITAS', value: 148753452590261, isTotal: true }
      ];

      liabilitiesEquity = [...this.baseLiabilitiesEquity];
      liabilitiesEquityBankAsal = [...this.baseLiabilitiesEquity];
      liabilitiesEquityBankAsalPemburukan = [...this.baseLiabilitiesEquity];
      liabilitiesEquityBankAsalPemburukanC = [...this.baseLiabilitiesEquity];
  

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

    selectedPeriode: string | undefined;

    selectedBank: boolean = false;

    dataBankPeriode: any = [];

    database = [
        { label: 'Neraca Bank', value: 'neraca_bank' },
        { label: 'Laba Rugi', value: 'laba_rugi' },
      ];

    loading: boolean = true;

    items!: MenuItem[];

    modifiedDataTable: any[] = [];

    modifiedDataTable1: any[] = [];

    modifiedDataTable2: any[] = [];

    modifiedDataTable3  : any[] = [];


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

    kategori: string = '';

    submitted: boolean = false;

    selectedProducts!: Product[] | null;

    dataPopLct: ReportDataType[] = [];

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private locationService: LocationService,
        private crudService: CrudService,
        private scvService: ScvService,
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
                label: `${item.id_pelapor_prefix} - ${item.nama}`, // Concatenate prefix and name
                value: item.id_pelapor_prefix, // Use prefix as the value
                kategori: item.kategori,
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
    
    async getTableData(tableName: string): Promise<void> {
        this.selectedData(tableName);
        const result = (await this.crudService.getDataLct(tableName, "neraca_bank")) as ReportDataType[] | undefined;
        console.log('result: ', result);
    
        if (!result) return;
    
        const getValueFromId = (data: ReportDataType[], id: string): number => {
            const found = data.find(item => item.id === id);
            if (!found) return 0;
    
            console.log("deskripsi", found.deskripsi);
            const value = found.total_nominal_total ?? 0;
            return found.deskripsi.includes("-") ? -Math.abs(value) : value;
        };
    
        const getValueFromIdWithRange = (data: ReportDataType[], primaryId: string, rangeStart: number, rangeEnd: number): number => {
            let value = getValueFromId(data, primaryId);
    
            console.log("value", value);
    
            if (value === 0) {
                // Reset agar bisa menjumlahkan semua nilai dalam rentang
                value = 0;
                for (let id = rangeStart; id <= rangeEnd; id++) {
                    const val = getValueFromId(data, id.toString() + ".0");
                    console.log("valu2", val);
                    value += val < 0 ? -Math.abs(val) : val; // Simplified logic for both negative and positive values
                }
            }
    
            return value;
        };
        
        this.dataTableNeracaBank = {
            kas: getValueFromId(result, "1.0"),
            penempatanPadaBI: getValueFromId(result, "2.0"),
            penempatanPadaBankLain: getValueFromIdWithRange(result, "3.0", 4, 7),
            tagihanSpotDanDerivatif: getValueFromIdWithRange(result, "8.0", 9, 10),
            suratBerharga: getValueFromIdWithRange(result, "11.0", 12, 17),
            ckpnSuratBerharga: -Math.abs(getValueFromId(result, "50.0")),
            suratBerhargaRepo: getValueFromId(result, "18.0"),
            reverseRepo: getValueFromId(result, "19.0"),
            tagihanAkseptasi: getValueFromId(result, "20.0"),
            kredit: getValueFromIdWithRange(result, "21.0", 22, 23),
            ckpnKredit: -Math.abs(getValueFromIdWithRange(result, "51.0", 52, 61)),
            asetKeuanganLain: getValueFromId(result, "48.0"),
            ckpnAsetKeuanganLain: -Math.abs(getValueFromId(result, "62.0")),
            asetTetapDanInventaris: getValueFromId(result, "65.0"),
            akumulasiPenyusutan: -Math.abs(getValueFromId(result, "66.0")),
            asetTidakBerwujud: getValueFromId(result, "63.0"),
            akumulasiAmortisasi: -Math.abs(getValueFromId(result, "64.0")),
            propertiTerbengkalai: getValueFromId(result, "67.0"),
            ayda: getValueFromId(result, "68.0"),
            asetLainnya: getValueFromId(result, "77.0"),
            penyertaanModal: getValueFromId(result, "47.0"),
            rekeningTunda: getValueFromId(result, "69.0"),
        
            // Total Aset dihitung dari penjumlahan semua aset
            totalAset: 0,
        
            giro: getValueFromIdWithRange(result, "80.0", 81, 85),
            tabungan: getValueFromIdWithRange(result, "86.0", 87, 91),
            simpananBerjangka: getValueFromIdWithRange(result, "92.0", 93, 96),
            uangElektronik: getValueFromId(result, "97.0"),
            kewajibanPadaBankIndonesia: getValueFromId(result, "98.0"),
            kewajibanPadaBankLain: getValueFromIdWithRange(result, "99.0", 100, 107),
            kewajibanSpotDanDerivatif: getValueFromIdWithRange(result, "108.0", 109, 110),
            kewajibanRepo: getValueFromId(result, "111.0"),
            kewajibanAkseptasi: getValueFromId(result, "112.0"),
            suratBerhargaYangDiterbitkan: getValueFromIdWithRange(result, "113.0", 114, 117),
            pinjaman: getValueFromIdWithRange(result, "118.0", 118, 122),
            setoranJaminan: getValueFromId(result, "123.0"),
            kewajibanLainnya: getValueFromId(result, "127.0"),
        
            // Total Kewajiban dihitung dari semua kewajiban
            totalKewajiban: 0,
        
            modalDasar: getValueFromId(result, "130.0"),
            modalYangBelumDisetor: -Math.abs(getValueFromId(result, "131.0")),
            agio: getValueFromId(result, "134.0"),
            penghasilanKomprehensifLain: getValueFromIdWithRange(result, "143.0", 144, 145),
            danaSetoranModal: getValueFromId(result, "139.0"),
            cadanganUmum: getValueFromIdWithRange(result, "146.0", 147, 148),
            labaTahunLalu: getValueFromIdWithRange(result, "150.0", 151, 152),
            labaTahunBerjalan: getValueFromIdWithRange(result, "153.0", 154, 155),
            dividenYangDiBayarkan: getValueFromId(result, "156.0"),
        
            // Total Ekuitas dihitung dari semua ekuitas
            totalEkuitas:0,
        
            // Total Kewajiban dan Ekuitas = Total Kewajiban + Total Ekuitas
            totalKewajibanDanEkuitas:0,
        };

        this.dataTableNeracaBank.totalAset =
        Number(this.dataTableNeracaBank.kas) +
        Number(this.dataTableNeracaBank.penempatanPadaBI) +
        Number(this.dataTableNeracaBank.penempatanPadaBankLain) +
        Number(this.dataTableNeracaBank.tagihanSpotDanDerivatif) +
        Number(this.dataTableNeracaBank.suratBerharga) +
        Number(this.dataTableNeracaBank.ckpnSuratBerharga) +
        Number(this.dataTableNeracaBank.suratBerhargaRepo) +
        Number(this.dataTableNeracaBank.reverseRepo) +
        Number(this.dataTableNeracaBank.tagihanAkseptasi) +
        Number(this.dataTableNeracaBank.kredit) +
        Number(this.dataTableNeracaBank.ckpnKredit) +
        Number(this.dataTableNeracaBank.asetKeuanganLain) +
        Number(this.dataTableNeracaBank.ckpnAsetKeuanganLain) +
        Number(this.dataTableNeracaBank.asetTetapDanInventaris) +
        Number(this.dataTableNeracaBank.akumulasiPenyusutan) +
        Number(this.dataTableNeracaBank.asetTidakBerwujud) +
        Number(this.dataTableNeracaBank.akumulasiAmortisasi) +
        Number(this.dataTableNeracaBank.propertiTerbengkalai) +
        Number(this.dataTableNeracaBank.ayda) +
        Number(this.dataTableNeracaBank.asetLainnya) +
        Number(this.dataTableNeracaBank.penyertaanModal) +
        Number(this.dataTableNeracaBank.rekeningTunda);

        console.log("Akumulasi Penyusutan (-)", this.dataTableNeracaBank.akumulasiPenyusutan);
        console.log("ckpn asset (-)", this.dataTableNeracaBank.ckpnAsetKeuanganLain);
        console.log("ckpn surat (-)", this.dataTableNeracaBank.ckpnSuratBerharga);
        console.log("ckpn kredit (-)", this.dataTableNeracaBank.ckpnKredit);
        console.log("akumulasi (-)", this.dataTableNeracaBank.akumulasiAmortisasi);



    

        this.dataTableNeracaBank.totalKewajiban =
            this.dataTableNeracaBank.giro +
            this.dataTableNeracaBank.tabungan +
            this.dataTableNeracaBank.simpananBerjangka +
            this.dataTableNeracaBank.uangElektronik +
            this.dataTableNeracaBank.kewajibanPadaBankIndonesia +
            this.dataTableNeracaBank.kewajibanPadaBankLain +
            this.dataTableNeracaBank.kewajibanSpotDanDerivatif +
            this.dataTableNeracaBank.kewajibanRepo +
            this.dataTableNeracaBank.kewajibanAkseptasi +
            this.dataTableNeracaBank.suratBerhargaYangDiterbitkan +
            this.dataTableNeracaBank.pinjaman +
            this.dataTableNeracaBank.setoranJaminan +
            this.dataTableNeracaBank.kewajibanLainnya;

        this.dataTableNeracaBank.totalEkuitas =
            this.dataTableNeracaBank.modalDasar +
            this.dataTableNeracaBank.modalYangBelumDisetor +
            this.dataTableNeracaBank.agio +
            this.dataTableNeracaBank.penghasilanKomprehensifLain +
            this.dataTableNeracaBank.danaSetoranModal +
            this.dataTableNeracaBank.cadanganUmum +
            this.dataTableNeracaBank.labaTahunLalu +
            this.dataTableNeracaBank.labaTahunBerjalan +
            this.dataTableNeracaBank.dividenYangDiBayarkan;

        this.dataTableNeracaBank.totalKewajibanDanEkuitas =
            this.dataTableNeracaBank.totalKewajiban +
            this.dataTableNeracaBank.totalEkuitas;

        
            this.assets = [
                { label: 'ASET', value: null, isSubheader: true },
                { label: 'Kas', value: this.dataTableNeracaBank.kas },
                { label: 'Penempatan pada BI', value: this.dataTableNeracaBank.penempatanPadaBI },
                { label: 'Penempatan pada Bank Lain', value: this.dataTableNeracaBank.penempatanPadaBankLain },
                { label: 'Tagihan Spot dan Derivatif', value: this.dataTableNeracaBank.tagihanSpotDanDerivatif },
                { label: 'Surat Berharga', value: this.dataTableNeracaBank.suratBerharga },
                { label: 'CKPN Surat Berharga (-)', value: this.dataTableNeracaBank.ckpnSuratBerharga, indent: 1 },
                { label: 'Surat Berharga (Repo)', value: this.dataTableNeracaBank.suratBerhargaRepo },
                { label: 'Reverse Repo', value: this.dataTableNeracaBank.reverseRepo },
                { label: 'Tagihan Akseptasi', value: this.dataTableNeracaBank.tagihanAkseptasi },
                { label: 'Kredit', value: this.dataTableNeracaBank.kredit },
                { label: 'Penyertaan Modal', value: this.dataTableNeracaBank.penyertaanModal},
                { label: 'CKPN Kredit (-)', value: this.dataTableNeracaBank.ckpnKredit, indent: 1 },
                { label: 'Aset Keuangan Lain', value: this.dataTableNeracaBank.asetKeuanganLain },
                { label: 'CKPN Aset Keuangan Lain (-)', value: this.dataTableNeracaBank.ckpnAsetKeuanganLain, indent: 1 },
                { label: 'Aset Tetap dan Inventaris', value: this.dataTableNeracaBank.asetTetapDanInventaris },
                { label: 'Akumulasi Penyusutan (-)', value: this.dataTableNeracaBank.akumulasiPenyusutan, indent: 1 },
                { label: 'Aset Tidak Berwujud', value: this.dataTableNeracaBank.asetTidakBerwujud },
                { label: 'Akumulasi Amortisasi', value: this.dataTableNeracaBank.akumulasiAmortisasi },
                { label: 'Properti Terbengkalai', value: this.dataTableNeracaBank.propertiTerbengkalai },
                { label: 'AYDA', value: this.dataTableNeracaBank.ayda },
                { label: 'Rekening Tunda', value: this.dataTableNeracaBank.rekeningTunda },
                { label: 'Aset Lainnya', value: this.dataTableNeracaBank.asetLainnya },
                { label: 'TOTAL ASET', value: this.dataTableNeracaBank.totalAset, isTotal: true }
            ];
        
            this.liabilitiesEquity = [
                { label: 'LIABILITAS', value: null, isSubheader: true },
                { label: 'Giro', value: this.dataTableNeracaBank.giro },
                { label: 'Tabungan', value: this.dataTableNeracaBank.tabungan },
                { label: 'Simpanan Berjangka', value: this.dataTableNeracaBank.simpananBerjangka },
                { label: 'Uang Elektronik', value: this.dataTableNeracaBank.uangElektronik },
                { label: 'Kewajiban pada Bank Indonesia', value: this.dataTableNeracaBank.kewajibanPadaBankIndonesia },
                { label: 'Kewajiban pada Bank Lain', value: this.dataTableNeracaBank.kewajibanPadaBankLain },
                { label: 'Kewajiban Spot dan Derivatif', value: this.dataTableNeracaBank.kewajibanSpotDanDerivatif },
                { label: 'Kewajiban Repo', value: this.dataTableNeracaBank.kewajibanRepo },
                { label: 'Kewajiban Akseptasi', value: this.dataTableNeracaBank.kewajibanAkseptasi },
                { label: 'Surat Berharga yang Diterbitkan', value: this.dataTableNeracaBank.suratBerhargaYangDiterbitkan },
                { label: 'Pinjaman', value: this.dataTableNeracaBank.pinjaman },
                { label: 'Setoran Jaminan', value: this.dataTableNeracaBank.setoranJaminan },
                { label: 'Kewajiban Lainnya', value: this.dataTableNeracaBank.kewajibanLainnya },
                { label: 'Total Kewajiban', value: this.dataTableNeracaBank.totalKewajiban, isTotal: true },
                { label: 'EKUITAS', value: null, isSubheader: true },
                { label: 'Modal Dasar', value: this.dataTableNeracaBank.modalDasar, indent: 1 },
                { label: 'Modal yg Belum Disetor (-)', value: this.dataTableNeracaBank.modalYangBelumDisetor, indent: 1 },
                { label: 'Agio', value: this.dataTableNeracaBank.agio, indent: 1 },
                { label: 'Penghasilan Komprehensif Lain', value: this.dataTableNeracaBank.penghasilanKomprehensifLain },
                { label: 'Dana Setoran Modal', value: this.dataTableNeracaBank.danaSetoranModal },
                { label: 'Cadangan Umum', value: this.dataTableNeracaBank.cadanganUmum },
                { label: 'Laba Tahun Lalu', value: this.dataTableNeracaBank.labaTahunLalu, indent: 1 },
                { label: 'Laba Tahun Berjalan', value: this.dataTableNeracaBank.labaTahunBerjalan, indent: 1 },
                { label: 'Dividen Dibayarkan', value: this.dataTableNeracaBank.dividenYangDiBayarkan, indent: 1 },
                { label: 'Total Ekuitas', value: this.dataTableNeracaBank.totalEkuitas, isTotal: true },
                { label: 'TOTAL KEWAJIBAN DAN EKUITAS', value: this.dataTableNeracaBank.totalKewajibanDanEkuitas, isTotal: true }
            ];
        
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
        const doc = new jsPDF('landscape', 'px', 'a4');
        const imgWidth = 120;
        const imgHeight = 40;
        let pageCount = 1;
    
        const headerImgData = '/assets/layout/images/logo-white.png';
        doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);
    
        const formatNumber = (value: number) =>
            new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    
        const variableRow = [
            ['Variabel 1', this.variabel1],
            ['Variabel 2', this.variabel2],
        ];
    
        const tableData = this.modifiedDataTable.map((report, index) => [
            report?.pos,
            report?.nominal_rupiah != null ? formatNumber(report.nominal_rupiah) : null,
            report?.nominal_valas != null ? formatNumber(report.nominal_valas) : null,
            report?.nominal_total != null ? formatNumber(report.nominal_total) : null,
            report?.hasil,
        ]);
    
        const tableHeader = [
            [
                {
                    content: 'Deskripsi',
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
                {
                    content: 'Hasil',
                    styles: { fillColor: [79, 129, 189], textColor: 255 },
                },
            ],
        ];
    
        (doc as any).autoTable({
            head: [
                ['Variabel', 'Nilai'], 
            ],
            body: variableRow,
            theme: 'plain',
            startY: imgHeight + 20, 
            styles: {
                fontSize: 10,
                cellPadding: 4,
                valign: 'middle',
                halign: 'left',
            },
        });
    
        const tableStartY = (doc as any).lastAutoTable.finalY + 10;
    
        (doc as any).autoTable({
            head: tableHeader,
            body: tableData,
            theme: 'grid',
            startY: tableStartY,
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
                0: { cellWidth: 200 },
                4: { cellWidth: 50 },
            },
            didDrawPage: function (data: any) {
                const headerStr = 'Hasil Analisis LCT';
                const timestampStr = 'Date: ' + new Date().toLocaleString();
                doc.setFontSize(14);
                doc.text(headerStr, 250, 35);
                doc.setFontSize(10);
                doc.text(timestampStr, 250, 50);
    
                doc.addImage(headerImgData, 'PNG', 50, 10, imgWidth, imgHeight);
    
                const footerStr = 'Analisis LCT';
                const pageNr = 'Page ' + pageCount;
                const footerX = data.settings.margin.left;
                const footerY = doc.internal.pageSize.height - 10;
                doc.setFontSize(8);
                doc.text(footerStr, footerX + 20, footerY - 10);
                doc.text(pageNr, footerX + 350, footerY - 10);
    
                pageCount++;
            },
            margin: { top: 80 },
            tableWidth: 'auto',
            showHead: 'everyPage',
            tableLineColor: [189, 195, 199],
            tableLineWidth: 0.1,
        });
    
        doc.save('lct_report.pdf');
    }
    

    exportAsXLSX() {
        const workbook = XLSX.utils.book_new();
        const timestamp = new Date().toLocaleString();
        const worksheetData = [
            ['','LPS'],
            ['','Dokumen ini di-download pada waktu:'],
            ['',timestamp],
            [],
            ['','Hasil Analisis LCT'],
            [],
            ['','Deskripsi', 'Nominal Rupiah', 'Nominal Valas', 'Nominal Total', 'Hasil'],
        ];

        this.modifiedDataTable.forEach((report, index) => {
            const rowData: string[] = [
                '',
                report?.pos|| '-',
                report?.nominal_rupiah || '0',
                report?.nominal_valas || '0',
                report?.nominal_total || '0',
                report?.hasil || '-',
            ];
            worksheetData.push(rowData);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            'lct_report.xlsx'
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

    
    clear2(table: Table) {
        this.selectedBank = true
        table.reset();
        this.components1 = [];
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
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
        // if (this.dt1) {
        //   this.dt1.filter(event.value, 'periode_data', 'contains');  // Correct number of arguments
        // }
      }

    addData(): void {
        if (this.selectedBase && this.selectedPos && this.selectedDataPop) {
        const newData = {
            pos: this.selectedDataPop.deskripsi, // Pos yang dipilih
            nominal_rupiah: this.selectedDataPop.total_nominal_rupiah || 0, // Nominal Rupiah
            nominal_valas: this.selectedDataPop.total_nominal_valas || 0, // Nominal Valas
            nominal_total: this.selectedDataPop.total_nominal_total || 0, // Nominal Total
            hasil: 'Setuju', // Default hasil
        };
    
        this.modifiedDataTable = [...this.modifiedDataTable, newData];
    
        this.cancelDialog();
        } else {
        console.warn('Data is incomplete. Please fill in all fields before saving.');
        }
    }

    async selectedData(keyword: string) {
        this.loading = true;
        keyword = keyword.trim();
        console.log('keyword 1', keyword);
    
        if (keyword.length >= 3) {
            this.loading = true;

            console.log('keyword', keyword);
            console.log('kategori', this.kategori);
    
            const body = { keyword: keyword.toUpperCase()};
            console.log('body', body);
    
            // const requestId = ++this.currentRequestId;
    
            try {
                const search = await this.scvService.getComponentsReportSearch(body);
                console.log('hasil search post Neraca', search);
                this.components1 = search;
    
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
}
