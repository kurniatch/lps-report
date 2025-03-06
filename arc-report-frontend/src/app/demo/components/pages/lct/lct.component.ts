import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../../api/product';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ViewChild, ElementRef } from '@angular/core';
import { LocationService } from 'src/app/demo/service/location.service';
import { ScvService } from 'src/app/demo/service/scv.service';
import { CrudService } from 'src/app/demo/service/crud.service';
import { KreditService } from 'src/app/demo/service/kredit.service';
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

interface GwmData {
    giroBi : number;
    dpkPdbl : number;
    total : number;
    parameter1 : number;
    parameter2 : number;
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

  interface KewajibanItem {
    label: string;
    nominal: number;
    fv: number;
}

interface AsetBP {
    label: string;
    value: number;
}

@Component({
    templateUrl: './lct.component.html',
    providers: [MessageService, ConfirmationService],
})
export class LctComponent implements OnInit, OnDestroy {
    editData: any = [];

    reportDataLct: DropdownOption[] = []; 
    
    [key: string]: any;

    dataReportLct: any ;

    gwmData: GwmData = {
        giroBi: 0,
        dpkPdbl: 0,
        total: 0,
        parameter1: 0,
        parameter2: 0,
    };

    gwmDataHasilBi: number = 0;

    gwmDataHasilPdbl: number = 0;

    nilai_ekuitas_atmr: number = 0;

    nilai_total_PA: number = 0;

    cekDataBb = [
        {label: 'BB + BDL', aset: 0, kewajiban: 0, modal: 0, kew_modal: 0},
        {label: 'BA', aset: 0, kewajiban: 0, modal: 0, kew_modal: 0},
    ];

    ati_ke_properti_terbengkalai: number = 0;

    aset_lainnya: number = 0;

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
        { label: 'Kas', value: 0 },
        { label: 'Penempatan pada BI', value: 0 },
        { label: 'Penempatan pada Bank Lain', value: 0 },
        { label: 'Tagihan Spot dan Derivatif', value: 0 },
        { label: 'Surat Berharga', value: 0 },
        { label: 'CKPN Surat Berharga (-)', value: 0, indent: 1 },
        { label: 'Surat Berharga (Repo)', value: 0 },
        { label: 'Reverse Repo', value: 0 },
        { label: 'Tagihan Akseptasi', value: 0 },
        { label: 'Kredit', value: 0 },
        { label: 'CKPN Kredit (-)', value: 0, indent: 1 },
        { label: 'Aset Keuangan Lain', value: 0 },
        { label: 'CKPN Aset Keuangan Lain (-)', value: 0, indent: 1 },
        { label: 'Aset Tetap dan Inventaris', value: 0 },
        { label: 'Akumulasi Penyusutan (-)', value: 0, indent: 1 },
        { label: 'Aset Tidak Berwujud', value: 0 },
        { label: 'Akumulasi Amortisasi', value: 0 },
        { label: 'Properti Terbengkalai', value: 0 },
        { label: 'AYDA', value: 0 },
        { label: 'Aset Lainnya', value: 0 },
        { label: 'TOTAL ASET', value: 0, isTotal: true }
      ];
      
      assets = [...this.baseAssets];
      assetsBankAsal = [
        ...this.baseAssets.slice(0, 11),
        { label: 'Kol Lancar', value: 0, indent: 1 },
        { label: 'Kol Dalam Perhatian Khusus', value: 0, indent: 1 },
        { label: 'Kol Kurang Lancar', value: 0, indent: 1 },
        { label: 'Kol Diragukan', value: 0, indent: 1 },
        { label: 'Kol Macet', value: 0, indent: 1 },
        ...this.baseAssets.slice(11)
    ];
    assetsBankAsalPemburukan = [
        ...this.baseAssets.slice(0, 10),
        { label: 'Kredit-Net', value: 0 },
        { label: 'Kredit Kol 1', value: 0 },
        { label: 'CKPN Kredit Kol 1 (-)', value: 0 ,indent: 1 },
        { label: 'Kredit Kol 2', value: 0 },
        { label: 'CKPN Kredit Kol 2 (-)', value: 0, indent: 1 },
        { label: 'Kredit Kol 3', value: 0 },
        { label: 'CKPN Kredit Kol 3 (-)', value: 0, indent: 1 },
        { label: 'Kredit Kol 4', value: 0 },
        { label: 'CKPN Kredit Kol 4 (-)', value: 0, indent: 1 },
        { label: 'Kredit Kol 5', value: 0 },
        { label: 'CKPN Kredit Kol 5 (-)', value: 0, indent: 1 },
        ...this.baseAssets.slice(11, 18),
    ];

    // assign data to kas assets pemburukan
      assetsBankAsalPemburukanC = [...this.assetsBankAsalPemburukan];
      assetsBankAsalPemburukanP = [...this.assetsBankAsalPemburukan];
      assetsBankAsalPemburukanPA = [...this.assetsBankAsalPemburukanP];

      baseLiabilitiesEquity = [
        { label: 'LIABILITAS', value: null, isSubheader: true },
        { label: 'Giro', value: 0 },
        { label: 'Tabungan', value: 0 },
        { label: 'Simpanan Berjangka', value: 0 },
        { label: 'Kewajiban pada Bank Lain', value: 0 },
        { label: 'Kewajiban Spot dan Derivatif', value: 0 },
        { label: 'Kewajiban Repo', value: 0 },
        { label: 'Kewajiban Akseptasi', value: 0 },
        { label: 'Surat Berharga yang Diterbitkan', value: 0 },
        { label: 'Pinjaman', value: 0 },
        { label: 'Setoran Jaminan', value: 0 },
        { label: 'Kewajiban Lainnya', value: 0 },
        { label: 'Total Kewajiban', value: 0, isTotal: true },
        { label: 'EKUITAS', value: null, isSubheader: true },
        { label: 'Modal Disetor', value: null },
        { label: 'Modal Dasar', value: 0, indent: 1 },
        { label: 'Modal yg Belum Disetor (-)', value: 0, indent: 1 },
        { label: 'Tambahan Modal Disetor', value: null },
        { label: 'Agio', value: 0, indent: 1 },
        { label: 'Penghasilan Komprehensif Lain', value: 0 },
        { label: 'Dana Setoran Modal', value: 0},
        { label: 'Cadangan Umum', value: 0 },
        { label: 'Laba (Rugi)', value: null },
        { label: 'Laba Tahun Lalu', value: 0, indent: 1 },
        { label: 'Laba Tahun Berjalan', value: 0, indent: 1 },
        { label: 'Total Ekuitas', value: 0, isTotal: true },
        { label: 'TOTAL KEWAJIBAN DAN EKUITAS', value: 0, isTotal: true }
      ];

      liabilitiesEquity = [...this.baseLiabilitiesEquity];
      liabilitiesEquityBankAsal = [ ...this.baseLiabilitiesEquity];
      liabilitiesEquityBankAsalPemburukan = [ 
        ...this.baseLiabilitiesEquity.slice(0, 25),
        { label: 'Estimasi Kerugian (-)', value: 0},
        ...this.baseLiabilitiesEquity.slice(25),
    ];
      liabilitiesEquityBankAsalPemburukanC = [...this.liabilitiesEquityBankAsalPemburukan];
      liabilitiesEquityBankAsalPemburukanPA = [...this.liabilitiesEquityBankAsalPemburukan];

      liabilitiesEquityBankBp = [ ...this.liabilitiesEquityBankAsalPemburukanC];
  

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

    selectedPeriode: string = '';

    selectedPeriode2: string = '';


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

    modifiedDataTableGwm= [{}];

    modifiedDataTable3: any[] = [{
    }];
          

    dataBank: any = [];

    atmr: number = 0;

    modalAtmr: number = 0;

    totalAsetB: number = 0;

    totalAsetP: number = 0;

    totalAsetPA: number = 0;

    calTotalModal: number = 0;

    calTotalAtmr: number = 0;

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

    selisishBp: number = 0;

    financialTerms = [
        { label: "Kas", nominal: 0, fv: 0 },
        { label: "Penempatan Pada Bank Indonesia", nominal: 0, fv: 0 },
        { label: "Penempatan Pada Bank Lain", nominal: 0, fv: 0 },
        { label: "Surat Berharga yang Dimiliki", nominal: 0, fv: 0 },
        { label: "Surat Berharga (REPO)", nominal: 0, fv: 0 },
        { label: "Reverse Repo", nominal: 0, fv: 0 },
        { label: "Kredit Yang Diberikan (Nilai Nominal/Baki debet)", nominal: 0, fv: 0 },
        { label: "CKPN Kredit yang Diberikan", nominal: 0, fv: 0 },
        { label: "Aset tetap dan Inventaris", nominal: 0, fv: 0 },
        { label: "Akumulasi Penyusutan Aset Tetap dan Inventaris", nominal: 0, fv: 0 },
        { label: "Aset Tetap dan dan Inventaris Neto", nominal: 0, fv: 0 },
        { label: "Aset Tidak Berwujud", nominal: 0, fv: 0 },
        { label: "Akumulasi Amortisasi Aset Tidak berwujud", nominal: 0, fv: 0 },
        { label: "Aset Tak Berwujud Neto", nominal: 0, fv: 0 },
        { label: "Total Aset", nominal: 0, fv: 0 }
    ];

    datalik = [
        { label: 'ASUMSI BIAYA LIKUIDASI', value: 0, isSubheader: true },
        { label: 'Perkiraan Biaya Likuidasi', value: 0, noInput: true },  // added noInput property
        { label: 'Perkiraan biaya talangan pesangon pegawai', value: 0, noInput: true },  // added noInput property
        { label: 'Estimasi Biaya Klaim Penjaminan', value: 0, noInput: true },  // added noInput property
        { label: 'Total Biaya', value: 0, noInput: false },
        { label: 'Estimasi Hasil Likuidasi', value: 0, noInput: true },  // added noInput property
        { label: 'Surplus (Defisit)', value: 0, noInput: false },
        { label: 'ASUMSI BIAYA TENAGA KERJA', value: 0, isSubheader: true },
        { label: 'Per bulan', value: 0, noInput: true },  // added noInput property
        { label: 'Pesangon (50% * 9 x gaji)', value: 0, noInput: false },
        { label: 'Talangan gaji (3x)', value: 0, noInput: true },  // added noInput property
        { label: 'Total', value: 0, noInput: false }
    ];
    

    kewajibanAlih : KewajibanItem[] = [
        { label: "Insured Deposits", nominal: 0, fv: 0 },
        { label: "Kewajiban Repo", nominal: 0, fv: 0 }
    ];

    posPengalihan = [
        { label: "Aset yang dialihkan", nominal: 0 },
        { label: "Kewajiban yang dialihkan", nominal: 0 },
        { label: "Selisih", nominal: 0 }
    ];
    
    asetBp = [
        { label: 'ASET', value: 0, isSubheader: true },
        { label: 'Kas', value: 0 },
        { label: 'Penempatan pada BI', value: 0 },
        { label: 'Penempatan pada Bank Lain', value: 0 },
        { label: 'Surat Berharga', value: 0 },
        { label: 'Surat Berharga (REPO)', value: 0 },
        { label: 'Reverse Repo', value: 0 },
        { label: 'Kredit (Net)', value: 0 },
        { label: 'Lancar', value: 0 },
        { label: 'Dalam Perhatian Khusus', value: 0 },
        { label: 'Aset tetap dan inventaris - Net', value: 0 },
        { label: 'Aset tak berwujud - Net', value: 0 },
        { label: 'Total Aset', value: 0 }
    ];
    
    kewajibanBp = [
        { label: 'LIABILITAS', value: 0, isSubheader: true },
        { label: 'Insured Deposits', value: 0 },
        { label: 'Kewajiban Repo', value: 0 },
        { label: 'Kewajiban kepada BDL', value: 0 },
        { label: 'Total Kewajiban', value: 0 },
        { label: 'EKUITAS', value: 0, isSubheader: true },
        { label: 'Modal KPMM', value: 0 },
        { label: 'Total Ekuitas', value: 0 },
        { label: 'Total Kewajiban dan Ekuitas', value: 0 }
    ];

    asetBdl = [
        { label: 'ASET', value: 0, isSubheader: true },
        { label: 'Kas', value: 355947 },
        { label: 'Penempatan pada BI', value: 0 },
        { label: 'Penempatan pada Bank Lain', value: 0 },
        { label: 'Tagihan Spot dan Derivatif', value: 0 },
        { label: 'Surat Berharga', value: 0 },
        { label: 'Surat Berharga (REPO)', value: 0 },
        { label: 'Reverse Repo', value: 0 },
        { label: 'Tagihan Akseptasi', value: 0 },
        { label: 'Tagihan kepada BB', value: 37125248 },
        { label: 'Total Kredit (Net)', value: 53596 },
        { label: 'Kredit Lancar', value: 0 },
        { label: 'Kredit Dalam Perhatian Khusus', value: 0 },
        { label: 'Kredit Kurang Lancar', value: 41412 },
        { label: 'Kredit Diragukan', value: 12184 },
        { label: 'Kredit Macet', value: 0 },
        { label: 'Aset Keuangan Lain', value: 4561944 },
        { label: 'CKPN Aset Keuangan Lainnya', value: 0 },
        { label: 'Aset Tetap dan Inventaris-Net', value: 0 },
        { label: 'Aset Tidak Berwujud-Net', value: 0 },
        { label: 'Properti Terbengkalai-Net', value: 0 },
        { label: 'AYDA-Net', value: 298913 },
        { label: 'Aset Lainnya', value: 0 },
        { label: 'Total Aset', value: 0 } // To be calculated
      ];
    
      // Kewajiban BDL data
      kewajibanBdl = [
        { label: 'LIABILITAS', value: 0, isSubheader: true },
        { label: 'Uninsured Deposits', value: 110980981 },
        { label: 'Kewajiban pada Bank Lain', value: 0 },
        { label: 'Kewajiban Spot dan Derivatif', value: 0 },
        { label: 'Kewajiban Repo', value: 0 },
        { label: 'Kewajiban Akseptasi', value: 0 },
        { label: 'Surat Berharga yang Diterbitkan', value: 801481 },
        { label: 'Pinjaman', value: 880000 },
        { label: 'Setoran Jaminan', value: 4253 },
        { label: 'Kewajiban Lainnya', value: 2525006 },
        { label: 'Total Kewajiban', value: 0 },  // To be calculated
        { label: 'EKUITAS', value: 0, isSubheader: true },
        { label: 'Modal Disetor', value: 0 },
        { label: 'Modal Dasar', value: 5300000 },
        { label: 'Modal yg Belum Disetor', value: -3961461 },
        { label: 'Tambahan Modal Disetor', value: 0 },
        { label: 'Agio', value: 8364828 },
        { label: 'Penghasilan Komprehensif Lain', value: 1595626 },
        { label: 'Dana Setoran Modal', value: 2144516 },
        { label: 'Cadangan Umum', value: 131600 },
        { label: 'Laba (Rugi)', value: 0 },
        { label: 'Laba Tahun Lalu', value: 3361336 },
        { label: 'Laba Tahun Berjalan', value: 72612 },
        { label: 'Estimasi Kerugian', value: -90161081 },
        { label: 'Total Ekuitas', value: 0 },  // To be calculated
        { label: 'Total Kewajiban dan Ekuitas', value: 0 }  // To be calculated
      ];

      dataBiayaResolusi = [
        { label: 'REKAPITULASI', bankPerantara: 0, bankPenerima: 0, pms: 0, likuidasi: 0, isSubheader: true },
        { label: 'Modal KPMM', bankPerantara: 0, bankPenerima: 0, pms: 0, likuidasi: 0 },
        { label: 'Top-Up LPS', bankPerantara: 0, bankPenerima: 0, pms: 0, likuidasi: 0 },
        { label: 'Biaya Likuidasi', bankPerantara: 0, bankPenerima: 0, pms: 0, likuidasi: 0 },
        { label: 'Biaya Klaim Penjaminan', bankPerantara: 0, bankPenerima: 0, pms: 0, likuidasi: 0 },
        { label: 'TOTAL ESTIMASI BIAYA (A)', bankPerantara: 0, bankPenerima: 0, pms: 0, likuidasi: 0 },
        { label: 'Hasil Divestasi', bankPerantara: 0, bankPenerima: 0, pms: 0, likuidasi: 0 },
        { label: 'Estimasi Hasil Recovery BDL', bankPerantara: 0, bankPenerima: 0, pms: 0, likuidasi: 0 },
        { label: 'TOTAL ESTIMASI PENERIMAAN (B)', bankPerantara: 0, bankPenerima: 0, pms: 0, likuidasi: 0 },
        { label: 'TOTAL ESTIMASI BIAYA BERSIH (A)-(B)', bankPerantara: 0, bankPenerima: 0, pms: 0, likuidasi: 0 },
        { label: 'PEMBEBANAN', bankPerantara: 0, bankPenerima: 0, pms: 0, likuidasi: 0, isSubheader: true },
        { label: 'Surplus (Defisit) LPS', bankPerantara: 0, bankPenerima: 0, pms: 0, likuidasi: 0 },
        { label: 'Surplus (Defisit) Non LPS', bankPerantara: 0, bankPenerima: 0, pms: 0, likuidasi: 0 }
      ];

    jumlahModal: number = 14737776;
    koreksiNeraca: number = -88452809;
    jumlahModalKPMM: number = -73715033;
    atmrAwal: number = 127236145;
    atmrPemburukan: number = 42367828;
    modalPMS: number = 5931496;
    jumlahPMSLPS: number = 79646529;

    estimasiKerugian: number = 0;
    
    

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private locationService: LocationService,
        private crudService: CrudService,
        private scvService: ScvService,
        private kreditService: KreditService,
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

        this.gwmData = {
            giroBi: 13008172313408,
            dpkPdbl: 127238629775058,
            total: 140246802088466,
            parameter1: 0,
            parameter2: 0
          };

          this.modifiedDataTable1 = Array.from({ length: 5 }, (_, i) => ({
            pos: i + 1,
            ckpn_aset_baik: 0,
            ckpn_aset_kurang_baik: 0,
            ckpn_aset_tidak_baik: 0,
            ckpn: 0,
            jumlah_rekening: 0,
            baki_debet: 0,
            baki_debet_pemeriksa: null,
            hasil_hitung: 0,
            children: ['Normal', 'Restrukturisasi']
        }));
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

    addRow() {
        console.log("add table");
        const newRow = {
          pos: this.modifiedDataTable1.length + 1,
          ckpn_aset_baik: 0,
          ckpn_aset_kurang_baik: 0,
          ckpn_aset_tidak_baik: 0,
          ckpn: 0,
          jumlah_rekening: 0,
          baki_debet: 0,
          baki_debet_pemeriksa: null,
          hasil_hitung: 0,
          children: ['Normal', 'Restrukturisasi']
        };
    
        this.modifiedDataTable1 = [...this.modifiedDataTable1, newRow];
      }

      getTotal(tableName: string, field: string): number {
        const table = (this as any)[tableName]; // Ambil tabel berdasarkan nama
        if (!Array.isArray(table)) {
            console.error(`Table ${tableName} not found or is not an array`);
            return 0;
        }
    
        return table.reduce((sum: number, item: { [key: string]: any }) => {
            const value = Number(item[field]); // Konversi ke number
            if (isNaN(value)) {
                console.warn(`Invalid number detected in field '${field}':`, item[field]);
                return sum; // Lewati nilai yang tidak valid
            }
            return sum + value;
        }, 0);
    }
    
    
    
      onRowToggle(event : any) {
        // Handle row toggle event, to update expanded rows
        if (event.type === 'expand') {
          this.expandedRows[event.index] = true;
        } else {
          this.expandedRows[event.index] = false;
        }
      }
    
      deleteRow(index: number) {
        console.log("Deleting row at index", index);
        this.modifiedDataTable1.splice(index, 1);
        this.modifiedDataTable1 = [...this.modifiedDataTable1];
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

        let result: ReportDataType[] | undefined;  // Mendeklarasikan result sebagai ReportDataType[] | undefined
        
        // Jika ada selectedPeriode, ambil data dengan periode yang sesuai
        if (this.selectedPeriode) {
            result = await this.crudService.getDataLctPeriode(tableName, "neraca_bank", this.selectedPeriode) as ReportDataType[];
            console.log('result: ', result);
        } else {
            // Jika tidak ada selectedPeriode, ambil data tanpa periode
            result = await this.crudService.getDataLct(tableName, "neraca_bank") as ReportDataType[];
            console.log('result: ', result);
        }
        

        console.log('selectedSearch: ', this.selectedSearch);

        const resultSummary = await this.kreditService.getSummaryKredit({ table: this.selectedSearch, period: this.selectedPeriode }) as any;

        console.log('resultSummary: ', resultSummary);

        const getValue = resultSummary.find((item: any) => item.id_unik === '1-Normal')?.total_baki_debet ?? 0;

        // Fungsi addRow dihapus karena tidak perlu
        // Fungsi deleteRow juga tidak perlu karena baris harus tetap 5

        
        if (resultSummary) {
            for (let i = 0; i < 5; i++) {
                const normalKey = `${i + 1}-Normal`;
                const restruKey = `${i + 1}-Restru`;
        
                this.modifiedDataTable1[i].baki_debet_normal = resultSummary.find((item: any) => item.id_unik === normalKey)?.total_baki_debet ?? 0;
                this.modifiedDataTable1[i].baki_debet_restrukturisasi = resultSummary.find((item: any) => item.id_unik === restruKey)?.total_baki_debet ?? 0;
                this.modifiedDataTable1[i].baki_debet = this.modifiedDataTable1[i].baki_debet_normal + this.modifiedDataTable1[i].baki_debet_restrukturisasi;
            }
        }

        console.log("getValue", getValue);

        // TODO : Implement logic to calculate Summary Kredit
        
        // if(resultSummary){
        //     this.modifiedDataTable1[0].baki_debet_normal = resultSummary.find((item: any) => item.id_unik === '1-Normal')?.total_baki_debet ?? 0;
        //     this.modifiedDataTable1[0].baki_debet_restrukturisasi = resultSummary.find((item: any) => item.id_unik === '1-Normal')?.total_baki_debet ?? 0;
        // }
            
        if (!result) return;
    
        const getValueFromId = (data: ReportDataType[], id: string): number => {
            const found = data.find(item => item.id === id);
            if (!found) return 0;
    
            console.log("deskripsi", found.deskripsi);
            const value = found.total_nominal_total ?? 0;
            return found.deskripsi.includes("-/-") ? -Math.abs(value) : value;
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
            kredit: getValueFromIdWithRange(result, "21.0", 22, 46),
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

        // console.log("Akumulasi Penyusutan (-)", this.dataTableNeracaBank.akumulasiPenyusutan);
        // console.log("ckpn asset (-)", this.dataTableNeracaBank.ckpnAsetKeuanganLain);
        // console.log("ckpn surat (-)", this.dataTableNeracaBank.ckpnSuratBerharga);
        // console.log("ckpn kredit (-)", this.dataTableNeracaBank.ckpnKredit);
        // console.log("akumulasi (-)", this.dataTableNeracaBank.akumulasiAmortisasi);


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

        if(this.dataTableNeracaBank.totalAset < this.dataTableNeracaBank.totalKewajibanDanEkuitas){
            this.dataTableNeracaBank.asetLainnya += this.dataTableNeracaBank.totalKewajibanDanEkuitas - this.dataTableNeracaBank.totalAset;
        }

        if(this.dataTableNeracaBank.totalAset > this.dataTableNeracaBank.totalKewajibanDanEkuitas){
            this.dataTableNeracaBank.kewajibanLainnya += this.dataTableNeracaBank.totalAset - this.dataTableNeracaBank.totalKewajibanDanEkuitas;
        }

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

            // Mapping dengan .map()
            this.assetsBankAsal = this.assets.map(item => ({ ...item }));
            this.assetsBankAsalPemburukan = this.assets.map(item => ({ ...item }));
            this.assetsBankAsalPemburukanC = this.assets.map(item => ({ ...item }));


            console.log("modifed data table", this.modifiedDataTable1);

            // Contoh penambahan atau modifikasi data khusus untuk assetsBankAsal
            this.assetsBankAsal.splice(11, 0, 
                { label: 'Kol Lancar', value: this.modifiedDataTable1[0]?.baki_debet ?? 0, indent: 1 },
                { label: 'Kol Dalam Perhatian Khusus', value: this.modifiedDataTable1[1]?.baki_debet ?? 0, indent: 1 },
                { label: 'Kol Kurang Lancar', value: this.modifiedDataTable1[2]?.baki_debet ?? 0, indent: 1 },
                { label: 'Kol Diragukan', value: this.modifiedDataTable1[3]?.baki_debet ?? 0, indent: 1 },
                { label: 'Kol Macet', value: this.modifiedDataTable1[4]?.baki_debet ?? 0, indent: 1 }
            );


        
            // Menghitung total Kredit-Net dan CKPN
            const totalKredit = (
                (this.modifiedDataTable1[0]?.baki_debet_res ?? 0) + 
                -(this.modifiedDataTable1[0]?.baki_debet_res ?? 0) * 1/100 + 
                (this.modifiedDataTable1[1]?.baki_debet_res ?? 0) + 
                -(this.modifiedDataTable1[1]?.baki_debet_res ?? 0) * 5/100 + 
                (this.modifiedDataTable1[2]?.baki_debet_res ?? 0) + 
                -(this.modifiedDataTable1[2]?.baki_debet_res ?? 0) * 15/100 + 
                (this.modifiedDataTable1[3]?.baki_debet_res ?? 0) + 
                -(this.modifiedDataTable1[3]?.baki_debet_res ?? 0) * 50/100 + 
                (this.modifiedDataTable1[4]?.baki_debet_res ?? 0) + 
                -(this.modifiedDataTable1[4]?.baki_debet_res ?? 0) * 100/100
            );
            
            // Menambahkan objek ke dalam assetsBankAsalPemburukan
            this.assetsBankAsalPemburukan.splice(10, 0, 
                { label: 'Kredit-Net', value: totalKredit },
                { label: 'Kredit Kol 1', value: this.modifiedDataTable1[0]?.baki_debet_res ?? 0 },
                { label: 'CKPN Kredit Kol 1 (-)', value: -(this.modifiedDataTable1[0]?.baki_debet_res ?? 0) * 1/100 , indent: 1 },
                { label: 'Kredit Kol 2', value: this.modifiedDataTable1[1]?.baki_debet_res ?? 0 },
                { label: 'CKPN Kredit Kol 2 (-)', value: -(this.modifiedDataTable1[1]?.baki_debet_res ?? 0) * 5/100, indent: 1 },
                { label: 'Kredit Kol 3', value: this.modifiedDataTable1[2]?.baki_debet_res ?? 0 },
                { label: 'CKPN Kredit Kol 3 (-)', value: -(this.modifiedDataTable1[2]?.baki_debet_res ?? 0) * 15/100, indent: 1 },
                { label: 'Kredit Kol 4', value: this.modifiedDataTable1[3]?.baki_debet_res ?? 0 },
                { label: 'CKPN Kredit Kol 4 (-)', value: -(this.modifiedDataTable1[3]?.baki_debet_res ?? 0) * 50/100, indent: 1 },
                { label: 'Kredit Kol 5', value: this.modifiedDataTable1[4]?.baki_debet_res ?? 0 },
                { label: 'CKPN Kredit Kol 5 (-)', value: -(this.modifiedDataTable1[4]?.baki_debet_res ?? 0) * 100/100, indent: 1 }
            );

            this.assetsBankAsalPemburukan[2].value = this.gwmDataHasilBi || 0;

            this.assetsBankAsalPemburukan.filter(item => item.label === 'Surat Berharga')[0].value = 0;

            const item2 = this.assetsBankAsalPemburukan.find(item => item.label === 'Aset Tetap dan Inventaris');

            if (item2) {

                console.log("Item value before addition:", item2.value);

                if (typeof item2.value !== null ) {
                    item2.value = (item2.value || 0) - (this.ati_ke_properti_terbengkalai || 0);
                    console.log("Item value after addition:", item2.value);  
                } else {
                    console.warn("item.value is not a valid number:", item2.value);
                }
            } else {
                console.warn("Item with label 'Properti Terbengkalai' not found.");
            }
            
            const item = this.assetsBankAsalPemburukan.find(item => item.label === 'Properti Terbengkalai');

            if (item) {
                if (typeof item.value !== null ) {
                    item.value = (item.value || 0) + (this.ati_ke_properti_terbengkalai || 0);
                    console.log("Item value after addition:", item.value);  
                } else {
                    console.warn("item.value is not a valid number:", item.value);
                }
            } else {
                console.warn("Item with label 'Properti Terbengkalai' not found.");
            }
            

            this.assetsBankAsalPemburukan.splice(31, 0, 
                { 
                  label: 'CKPN Prop Terbengkalai (-)', 
                  value: this.assetsBankAsalPemburukan.find(item => item.label === 'Properti Terbengkalai')?.value || 0 
                }
              );
              
            
            this.assetsBankAsalPemburukan.splice(33, 0, 
                { label: 'CKPN AYDA (-)', value: 0 }
            );

            this.assetsBankAsalPemburukan[21].value = 0;
            this.assetsBankAsalPemburukan[22].value = 0;
            this.assetsBankAsalPemburukan[23].value = 0;

            this.assetsBankAsalPemburukan[35].value = 1708396000000;

            let totalAsset = this.assetsBankAsalPemburukan
            .reduce((sum, item) => 
              (item.label !== "Kredit-Net" && item.label !== "TOTAL ASET" && item.label !== "Properti Terbengkalai" && item.label !== "CKPN Prop Terbengkalai (-)") ? sum + (item.value ?? 0) : sum
            , 0);

            this.assetsBankAsalPemburukan.filter(item => item.label === 'TOTAL ASET')[0].value = totalAsset;

            this.assetsBankAsalPemburukanC = this.assetsBankAsalPemburukan.map(item => ({ ...item }));

            this.assetsBankAsalPemburukanC
            .filter(item1 => item1.label === 'Tagihan Akseptasi' || item1.label === 'Tagihan Spot dan Derivatif')
            .forEach(item1 => item1.value = 0); 

            const item3 = this.assetsBankAsalPemburukanC.find(item3 => item3.label === 'Aset Lainnya');

            if (item3) {
                console.log("Item found:", item3);
                item3.value = 0;  
                console.log("Updated item:", item3);
            } else {
                console.warn("Item with label 'Aset Lainnya' not found.");
}

            console.log("assetsBankAsalPemburukan", this.assetsBankAsalPemburukanC);
            

            // this.assetsBankAsalPemburukanC.find(item => item.label === 'Kredit-Net').value = 0;

            const totalAssetC = this.assetsBankAsalPemburukanC
            .reduce((sum, item) => 
              (item.label !== "Kredit-Net" && item.label !== "TOTAL ASET" && item.label !== "Properti Terbengkalai" && item.label !== "CKPN Prop Terbengkalai (-)") ? sum + (item.value ?? 0) : sum
            , 0);

            this.assetsBankAsalPemburukanC.filter(item => item.label === 'TOTAL ASET')[0].value = totalAssetC;

            console.log("assetsBankAsalPemburukan", this.assetsBankAsalPemburukanC);
        
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

            // Menyisipkan Estimasi Kerugian sebelum Total Ekuitas
            // Menyisipkan Estimasi Kerugian sebelum Total Ekuitas

            const ckpnAyda = 0;
            const asetLainnyaBv = this.aset_lainnya;

        
            //change mapping
            this.liabilitiesEquityBankAsal = this.liabilitiesEquity.map(item => ({ ...item }));
            this.liabilitiesEquityBankAsalPemburukan = this.liabilitiesEquity.map(item => ({ ...item }));

            this.liabilitiesEquityBankAsalPemburukan.filter(item => item.label === 'Kewajiban pada Bank Lain')[0].value = 0;

            const penempatanBIA = this.assetsBankAsal.filter(item => item.label === 'Penempatan pada BI')[0].value || 0;
            console.log("penempatanBIA", penempatanBIA);
            const simpananBerjangkaA = this.liabilitiesEquityBankAsal.filter(item => item.label === 'Simpanan Berjangka')[0].value || 0;
            console.log("simpananBerjangkaA", simpananBerjangkaA);
            const suratBerhargaA = this.assetsBankAsal.filter(item => item.label === 'Surat Berharga')[0].value || 0;
            console.log("suratBerhargaA", suratBerhargaA);
            const kewBankLainA = this.liabilitiesEquityBankAsal.filter(item => item.label === 'Kewajiban pada Bank Lain')[0].value || 0;
            console.log("kewBankLainA", kewBankLainA);

            const penempatanBI = this.assetsBankAsalPemburukan.filter(item => item.label === 'Penempatan pada BI')[0].value || 0;
            console.log("penempatanBI", penempatanBI);
            const suratBerharga = this.assetsBankAsalPemburukan.filter(item => item.label === 'Surat Berharga')[0].value || 0;
            console.log("suratBerharga", suratBerharga);
            const kewBankLain = this.liabilitiesEquityBankAsalPemburukan.filter(item => item.label === 'Kewajiban pada Bank Lain')[0].value || 0;
            console.log("kewBankLain", kewBankLain);


            this.liabilitiesEquityBankAsalPemburukan.filter(item => item.label === 'Simpanan Berjangka')[0].value = simpananBerjangkaA + (suratBerharga - suratBerhargaA) + (penempatanBI - penempatanBIA) - (kewBankLain - kewBankLainA);

            console.log("modifiedDataTable1 Rest", this.modifiedDataTable1[0]?.baki_debet_res);
            console.log("modifiedDataTable1 Rest1", this.modifiedDataTable1[1]?.baki_debet_res);
            console.log("modifiedDataTable1 Rest2", this.modifiedDataTable1[2]?.baki_debet_res);
            console.log("modifiedDataTable1 Rest3", this.modifiedDataTable1[3]?.baki_debet_res);
            console.log("modifiedDataTable1 Rest4", this.modifiedDataTable1[4]?.baki_debet_res);

            console.log("CKPN Kredit", this.dataTableNeracaBank.ckpnKredit);
            console.log("CKPN Ayda", ckpnAyda);
             console.log("Aset Lainnya BV", asetLainnyaBv);
                console.log("Aset Lainnya", this.dataTableNeracaBank.asetLainnya);
                console.log("Properti Terbengkalai", this.dataTableNeracaBank.propertiTerbengkalai);

                let testEstimate =                     (-1 * (this.modifiedDataTable1[0]?.baki_debet_res || 0) * 0.01) + 
                (-1 * (this.modifiedDataTable1[1]?.baki_debet_res || 0) * 0.05) + 
                (-1 * (this.modifiedDataTable1[2]?.baki_debet_res || 0) * 0.15) + 
                (-1 * (this.modifiedDataTable1[3]?.baki_debet_res || 0) * 0.50) + 
                (-1 * (this.modifiedDataTable1[4]?.baki_debet_res || 0) * 1.0)
                console.log("testEstimate", testEstimate);

                let testEstimate1 = (this.dataTableNeracaBank.ckpnKredit) + 
                ckpnAyda + asetLainnyaBv - 
                this.dataTableNeracaBank.asetLainnya - 
                (this.assetsBankAsalPemburukan.find(item => item.label === 'Properti Terbengkalai')?.value || 0);
                
                console.log("testEstimate1", testEstimate1);

                const estimasiKerugian = (
                    (-1 * (this.modifiedDataTable1[0]?.baki_debet_res || 0) * 0.01) + 
                    (-1 * (this.modifiedDataTable1[1]?.baki_debet_res || 0) * 0.05) + 
                    (-1 * (this.modifiedDataTable1[2]?.baki_debet_res || 0) * 0.15) + 
                    (-1 * (this.modifiedDataTable1[3]?.baki_debet_res || 0) * 0.50) + 
                    (-1 * (this.modifiedDataTable1[4]?.baki_debet_res || 0) * 1.0) - 
                    (this.dataTableNeracaBank.ckpnKredit) + 
                    ckpnAyda + asetLainnyaBv - 
                    this.dataTableNeracaBank.asetLainnya - 
                    (this.assetsBankAsalPemburukan.find(item => item.label === 'Properti Terbengkalai')?.value || 0)
                );
                this.liabilitiesEquityBankAsalPemburukan.splice(                                                
                this.liabilitiesEquityBankAsalPemburukan.findIndex(item => item.label === 'Total Ekuitas'), // Temukan indeks 'Total Ekuitas'
                0, // 0 berarti tidak ada elemen yang dihapus
                { label: 'Estimasi Kerugian', value: estimasiKerugian } // Menyisipkan objek estimasi kerugian
                );


            const liabilityCategories = [
                "Giro",
                "Tabungan",
                "Simpanan Berjangka",
                "Kewajiban pada Bank Lain",
                "Kewajiban Spot dan Derivatif",
                "Kewajiban Repo",
                "Kewajiban Akseptasi",
                "Surat Berharga yang Diterbitkan",
                "Pinjaman",
                "Setoran Jaminan",
                "Kewajiban Lainnya",
              ];
            
            this.liabilitiesEquityBankAsalPemburukan.filter(item => item.label === 'Kewajiban pada Bank Lain')[0].value = 0;

            const totalLiabilities = this.liabilitiesEquityBankAsalPemburukan
                .filter(item => liabilityCategories.includes(item.label)) 
                .reduce((sum, item) => sum + (item.value ?? 0), 0);
            
            this.liabilitiesEquityBankAsalPemburukan.filter(item => item.label === 'Total Kewajiban')[0].value = totalLiabilities;

            const equityCategories = [
                "Modal Dasar",
                "Modal yg Belum Disetor (-)",
                "Agio",
                "Penghasilan Komprehensif Lain",
                "Dana Setoran Modal",
                "Cadangan Umum",
                "Laba Tahun Lalu",
                "Laba Tahun Berjalan",
                "Estimasi Kerugian",
              ];
            
            const totalEquity = this.liabilitiesEquityBankAsalPemburukan.reduce((sum, item) =>
                equityCategories.includes(item.label) ? sum + (item.value ?? 0) : sum
            , 0);

            this.liabilitiesEquityBankAsalPemburukan.filter(item => item.label === 'Total Ekuitas')[0].value = totalEquity;

            const totalLiabilitiesEquity = totalLiabilities + totalEquity;

            this.liabilitiesEquityBankAsalPemburukan.filter(item => item.label === 'TOTAL KEWAJIBAN DAN EKUITAS')[0].value = totalLiabilitiesEquity;

            this.liabilitiesEquityBankAsalPemburukanC = this.liabilitiesEquityBankAsalPemburukan.map(item => ({ ...item })); 
            
            
            this.liabilitiesEquityBankAsalPemburukanC
            .filter(item1 => item1.label === 'Kewajiban Spot dan Derivatif' || item1.label === 'Kewajiban Akseptasi')
            .forEach(item1 => item1.value = 0); // Mengubah value menjadi null untuk semua item yang cocok

            const asalPemburukan = this.liabilitiesEquityBankAsalPemburukan;
            const asalPemburukanC = this.liabilitiesEquityBankAsalPemburukanC;
            const asetPemburukan = this.assetsBankAsalPemburukan;
            
            const estimasiKerugianC = asalPemburukanC.find(item => item.label === 'Estimasi Kerugian');
            
            if (estimasiKerugianC) {
                const estimasiKerugianValue = asalPemburukan.find(item => item.label === 'Estimasi Kerugian')?.value ?? 0;
                const kewajibanAkseptasiValue = asalPemburukan.find(item => item.label === 'Kewajiban Akseptasi')?.value ?? 0;
                const kewajibanSpotDerivatifValue = asalPemburukan.find(item => item.label === 'Kewajiban Spot dan Derivatif')?.value ?? 0;
                const tagihanAkseptasiValue = asetPemburukan.find(item => item.label === 'Tagihan Akseptasi')?.value ?? 0;
                const tagihanSpotDerivatifValue = asetPemburukan.find(item => item.label === 'Tagihan Spot dan Derivatif')?.value ?? 0;
                const asetLainnyaValue = asetPemburukan.find(item => item.label === 'Aset Lainnya')?.value ?? 0;
            
                console.log("Estimasi Kerugian:", estimasiKerugianValue);
                console.log("Kewajiban Akseptasi:", kewajibanAkseptasiValue);
                console.log("Kewajiban Spot dan Derivatif:", kewajibanSpotDerivatifValue);
                console.log("Tagihan Akseptasi:", tagihanAkseptasiValue);
                console.log("Tagihan Spot dan Derivatif:", tagihanSpotDerivatifValue);
                console.log("Aset Lainnya:", asetLainnyaValue);
            
                estimasiKerugianC.value = 
                    estimasiKerugianValue -
                    (tagihanSpotDerivatifValue - kewajibanSpotDerivatifValue) -
                    (tagihanAkseptasiValue -  kewajibanAkseptasiValue) -
                    asetLainnyaValue;
            
                console.log("Hasil Estimasi KerugianC:", estimasiKerugianC.value);
            }
            
            
            const totalEquityC = this.liabilitiesEquityBankAsalPemburukanC.reduce((sum, item) =>
                equityCategories.includes(item.label) ? sum + (item.value ?? 0) : sum
            , 0);

            this.liabilitiesEquityBankAsalPemburukanC.filter(item => item.label === 'Total Ekuitas')[0].value = totalEquityC;
            
            const totalLiabilitiesC = this.liabilitiesEquityBankAsalPemburukanC.reduce((sum, item) =>
                liabilityCategories.includes(item.label) ? sum + (item.value ?? 0) : sum
            , 0);

            this.liabilitiesEquityBankAsalPemburukanC.filter(item => item.label === 'Total Kewajiban')[0].value = totalLiabilitiesC;

            const totalLiabilitiesEquityC = totalLiabilitiesC + totalEquityC;

            this.liabilitiesEquityBankAsalPemburukanC.filter(item => item.label === 'TOTAL KEWAJIBAN DAN EKUITAS')[0].value = totalLiabilitiesEquityC;
            
            this.liabilitiesEquityBankBp = this.liabilitiesEquityBankAsalPemburukanC.map(item => ({ ...item }));

            this.liabilitiesEquityBankBp.splice(1, 0, 
                {
                label: 'Total Simpanan', 
                value: this.liabilitiesEquityBankAsalPemburukanC.reduce((sum, item) =>
                    ["Giro", "Tabungan", "Simpanan Berjangka", "Kewajiban pada Bank Lain"].includes(item.label) 
                    ? sum + (item.value ?? 0) 
                    : sum, 0) 
                }
            );
            

            this.getGwmData();

            console.log("assets asal Pemburukan", this.assetsBankAsalPemburukan);
            this.financialTerms = [
                { label: 'Kas', nominal: this.assetsBankAsalPemburukan.filter(item => item.label === 'Kas')[0]?.value || 0, fv:  this.assetsBankAsalPemburukanC.filter(item => item.label === 'Kas')[0]?.value || 0 },
                { label: 'Penempatan Pada Bank Indonesia', nominal: this.assetsBankAsalPemburukan.filter(item => item.label === 'Penempatan pada BI')[0]?.value || 0, fv: this.assetsBankAsalPemburukanC.filter(item => item.label === 'Penempatan pada BI')[0]?.value || 0 },
                { label: 'Penempatan Pada Bank Lain', nominal: this.assetsBankAsalPemburukan.filter(item => item.label === 'Penempatan pada Bank Lain')[0]?.value || 0, fv: this.assetsBankAsalPemburukanC.filter(item => item.label === 'Penempatan pada Bank Lain')[0]?.value || 0 },
                { label: 'Surat Berharga yang Dimiliki', nominal: ((this.assetsBankAsalPemburukan.filter(item => item.label === 'Surat Berharga')[0]?.value || 0) - (this.assetsBankAsalPemburukan.filter(item => item.label === 'CKPN Surat Berharga (-)')[0]?.value || 0)) || 0, fv: this.assetsBankAsalPemburukanC.filter(item => item.label === 'Surat Berharga')[0]?.value || 0 },
                { label: 'Surat Berharga (REPO)', nominal: this.assetsBankAsalPemburukan.filter(item => item.label === 'Surat Berharga (Repo)')[0]?.value || 0, fv:  this.assetsBankAsalPemburukanC.filter(item => item.label === 'Surat Berharga (Repo)')[0]?.value || 0 },
                { label: 'Reverse Repo', nominal: this.assetsBankAsalPemburukan.filter(item => item.label === 'Reverse Repo')[0]?.value || 0, fv: this.assetsBankAsalPemburukanC.filter(item => item.label === 'Reverse Repo')[0]?.value || 0 },
                { label: 'Kredit Yang Diberikan (Nilai Nominal/Baki debet)', nominal: ((this.assetsBankAsalPemburukan.filter(item => item.label === 'Kredit Kol 1')[0]?.value || 0) + (this.assetsBankAsalPemburukan.filter(item => item.label === 'Kredit Kol 2')[0]?.value || 0)) || 0, fv: ((this.assetsBankAsalPemburukanC.filter(item => item.label === 'Kredit Kol 1')[0]?.value || 0) + (this.assetsBankAsalPemburukanC.filter(item => item.label === 'Kredit Kol 2')[0]?.value || 0)) || 0 },
                { label: 'CKPN Kredit yang Diberikan', nominal: ((this.assetsBankAsalPemburukan.filter(item => item.label === 'CKPN Kredit Kol 1 (-)')[0]?.value || 0) + (this.assetsBankAsalPemburukan.filter(item => item.label === 'CKPN Kredit Kol 2 (-)')[0]?.value || 0)) || 0, fv: ((this.assetsBankAsalPemburukanC.filter(item => item.label === 'CKPN Kredit Kol 1 (-)')[0]?.value || 0) + (this.assetsBankAsalPemburukanC.filter(item => item.label === 'CKPN Kredit Kol 2 (-)')[0]?.value || 0)) || 0 },
                { label: 'Aset tetap dan Inventaris', nominal: this.assetsBankAsalPemburukan.filter(item => item.label === 'Aset Tetap dan Inventaris')[0]?.value || 0, fv: ((this.assetsBankAsalPemburukanC.filter(item => item.label === 'Aset Tetap dan Inventaris')[0]?.value || 0) + (this.assetsBankAsalPemburukanC.filter(item => item.label === 'Akumulasi Penyusutan (-)')[0]?.value || 0)) || 0 },
                { label: 'Akumulasi Penyusutan Aset Tetap dan Inventaris', nominal: this.assetsBankAsalPemburukan.filter(item => item.label === 'Akumulasi Penyusutan (-)')[0]?.value || 0, fv: 0 },
                { label: 'Aset Tetap dan dan Inventaris Neto', nominal: ((this.assetsBankAsalPemburukan.filter(item => item.label === 'Aset Tetap dan Inventaris')[0]?.value || 0) + (this.assetsBankAsalPemburukan.filter(item => item.label === 'Akumulasi Penyusutan (-)')[0]?.value || 0)) || 0, fv: ((this.assetsBankAsalPemburukanC.filter(item => item.label === 'Aset Tetap dan Inventaris')[0]?.value || 0) + (this.assetsBankAsalPemburukanC.filter(item => item.label === 'Akumulasi Penyusutan (-)')[0]?.value || 0)) || 0 },
                { label: 'Aset Tidak Berwujud', nominal: this.assetsBankAsalPemburukan.filter(item => item.label === 'Aset Tidak Berwujud')[0]?.value || 0, fv: ((this.assetsBankAsalPemburukanC.filter(item => item.label === 'Aset Tidak Berwujud')[0]?.value || 0) + (this.assetsBankAsalPemburukanC.filter(item => item.label === 'Akumulasi Amortisasi')[0]?.value || 0)) || 0 },
                { label: 'Akumulasi Amortisasi Aset Tidak berwujud', nominal: this.assetsBankAsalPemburukan.filter(item => item.label === 'Akumulasi Amortisasi')[0]?.value || 0, fv: 0 },
                { label: 'Aset Tak Berwujud Neto', nominal: ((this.assetsBankAsalPemburukan.filter(item => item.label === 'Aset Tidak Berwujud')[0]?.value || 0) + (this.assetsBankAsalPemburukan.filter(item => item.label === 'Akumulasi Amortisasi')[0]?.value || 0)) || 0, fv: ((this.assetsBankAsalPemburukanC.filter(item => item.label === 'Aset Tidak Berwujud')[0]?.value || 0) + (this.assetsBankAsalPemburukanC.filter(item => item.label === 'Akumulasi Amortisasi')[0]?.value || 0)) || 0 },
                { label: 'Total Aset', nominal: 0, fv: 0 }
            ];

            //total asset financial terms
            this.financialTerms.filter(item => item.label === 'Total Aset')[0].nominal = this.financialTerms.reduce((sum, item) => sum + (item.nominal || 0), 0) - this.financialTerms[10].nominal;
            this.financialTerms.filter(item => item.label === 'Total Aset')[0].fv = this.financialTerms.reduce((sum, item) => sum + (item.fv || 0), 0) - this.financialTerms[10].fv;

            const posPengalihan =  this.posPengalihan.find(item => item.label === 'Aset yang dialihkan') ;

            if(posPengalihan){
                posPengalihan.nominal = this.financialTerms.filter(item => item.label === 'Total Aset')[0].nominal;
            }
            
            this.cekDataBb.filter(item => item.label === 'BB + BDL')[0].aset = (this.asetBdl.find(item => item.label === 'Total Aset')?.value || 0) + (this.asetBp.find(item => item.label === 'Total Aset')?.value || 0) - ((this.kewajibanBp.find(item => item.label === 'Modal KPMM')?.value || 0) + (this.kewajibanBp.find(item => item.label === 'Kewajiban kepada BDL')?.value || 0)) + ((this.assetsBankAsal.find(item => item.label === 'Penempatan pada Bank Lain')?.value || 0) - (this.asetBp.find(item => item.label === 'Penempatan pada Bank Lain')?.value || 0) + (this.kewajibanBp.find(item => item.label === 'Modal KPMM')?.value || 0));
            this.cekDataBb.filter(item => item.label === 'BA')[0].aset = this.assetsBankAsalPemburukanC.find(item => item.label === 'TOTAL ASET')?.value || 0;

            this.cekDataBb.filter(item => item.label === 'BB + BDL')[0].kewajiban = (this.kewajibanBdl.find(item => item.label === 'Total Kewajiban')?.value || 0) + (this.kewajibanBp.find(item => item.label === 'Total Kewajiban')?.value || 0) - (this.kewajibanBp.find(item => item.label === 'Kewajiban kepada BDL')?.value || 0);
            this.cekDataBb.filter(item => item.label === 'BA')[0].kewajiban = this.liabilitiesEquityBankAsalPemburukanC.find(item => item.label === 'Total Kewajiban')?.value || 0;

            this.cekDataBb.filter(item => item.label === 'BB + BDL')[0].modal = (this.kewajibanBdl.find(item => item.label === 'Total Ekuitas')?.value || 0) + (this.kewajibanBp.find(item => item.label === 'Total Ekuitas')?.value || 0) + ((this.assetsBankAsal.find(item => item.label === 'Penempatan pada Bank Lain')?.value || 0) - (this.asetBp.find(item => item.label === 'Penempatan pada Bank Lain')?.value || 0) );
            this.cekDataBb.filter(item => item.label === 'BA')[0].modal = this.liabilitiesEquityBankAsalPemburukanC.find(item => item.label === 'Total Ekuitas')?.value || 0;

            this.cekDataBb.filter(item => item.label === 'BB + BDL')[0].kew_modal = this.cekDataBb.filter(item => item.label === 'BB + BDL')[0].kewajiban + this.cekDataBb.filter(item => item.label === 'BB + BDL')[0].modal;
            this.cekDataBb.filter(item => item.label === 'BA')[0].kew_modal = this.cekDataBb.filter(item => item.label === 'BA')[0].kewajiban + this.cekDataBb.filter(item => item.label === 'BA')[0].modal;

            console.log("financial terms", this.financialTerms);

            
            this.assetsBankAsalPemburukanP = this.assetsBankAsal.map(item => ({ ...item }));

            this.assetsBankAsalPemburukanP.splice(10, 0, 
                { label: 'Kredit-Net', value: 0 },
                { label: 'Kredit Kol 1', value: this.modifiedDataTable1[0]?.baki_debet ?? 0 },
                { label: 'CKPN Kredit Kol 1 (-)', value: -(this.modifiedDataTable1[0]?.ckpn) || 0 , indent: 1 },
                { label: 'Kredit Kol 2', value: this.modifiedDataTable1[1]?.baki_debet ?? 0 },
                { label: 'CKPN Kredit Kol 2 (-)', value: -(this.modifiedDataTable1[1]?.ckpn)  || 0, indent: 1 },
                { label: 'Kredit Kol 3', value: this.modifiedDataTable1[2]?.baki_debet ?? 0 },
                { label: 'CKPN Kredit Kol 3 (-)', value: -(this.modifiedDataTable1[2]?.ckpn) || 0, indent: 1 },
                { label: 'Kredit Kol 4', value: this.modifiedDataTable1[3]?.baki_debet ?? 0 },
                { label: 'CKPN Kredit Kol 4 (-)', value: -(this.modifiedDataTable1[3]?.ckpn) || 0, indent: 1 },
                { label: 'Kredit Kol 5', value: this.modifiedDataTable1[4]?.baki_debet ?? 0 },
                { label: 'CKPN Kredit Kol 5 (-)', value: -(this.modifiedDataTable1[4]?.ckpn) || 0, indent: 1 }
            );

            // sum kredit net fron and kol 1 - 5
            const totalKreditP = this.assetsBankAsalPemburukanP
                .filter(item => item.label === 'Kredit Kol 1' || item.label === 'Kredit Kol 2' || item.label === 'Kredit Kol 3' || item.label === 'Kredit Kol 4' || item.label === 'Kredit Kol 5' || item.label === 'CKPN Kredit Kol 1 (-)' || item.label === 'CKPN Kredit Kol 2 (-)' || item.label === 'CKPN Kredit Kol 3 (-)' || item.label === 'CKPN Kredit Kol 4 (-)' || item.label === 'CKPN Kredit Kol 5 (-)')
                .reduce((sum, item) => sum + (item.value || 0), 0);
            
            this.assetsBankAsalPemburukanP.filter(item => item.label === 'Kredit-Net')[0].value = totalKreditP;

            // Pastikan array tidak kosong sebelum mencoba menghapus
            if (this.assetsBankAsalPemburukanP.length > 26) {
                this.assetsBankAsalPemburukanP.splice(21, 8);
            }

            // filter string wit CKPN set value 0
            // this.assetsBankAsalPemburukanP.filter(item => item.label === 'CKPN Kredit Kol 1 (-)' || item.label === 'CKPN Kredit Kol 2 (-)' || item.label === 'CKPN Kredit Kol 3 (-)' || item.label === 'CKPN Kredit Kol 4 (-)' || item.label === 'CKPN Kredit Kol 5 (-)').forEach(item => item.value = 0);
            this.assetsBankAsalPemburukanP.filter(item => item.label === 'TOTAL ASET')[0].value = 0;
            // Menggunakan find untuk mencari elemen dan memastikan bahwa nilai tidak null
            const totalAsetItem = this.assetsBankAsalPemburukanP.find(item => item.label === 'TOTAL ASET');
            const kreditNetItem = this.assetsBankAsalPemburukanP.find(item => item.label === 'Kredit-Net');

            // Pastikan elemen ditemukan, jika tidak, berikan nilai default
            if (totalAsetItem && kreditNetItem) {
            totalAsetItem.value = this.assetsBankAsalPemburukanP.reduce((sum, item) => sum + (item.value || 0), 0) - (kreditNetItem.value || 0);
            } else {
            console.log("Item 'TOTAL ASET' atau 'Kredit-Net' tidak ditemukan");
            }
                        
            
            this.assetsBankAsalPemburukanPA = this.assetsBankAsalPemburukanP.map(item => ({ ...item }));
            this.liabilitiesEquityBankAsalPemburukanPA = this.liabilitiesEquityBankAsalPemburukan.map(item => ({ ...item }));

            this.totalAsetB = this.assetsBankAsalPemburukanP.filter(item => item.label === 'TOTAL ASET')[0].value || 0;
            this.totalAsetP = this.assetsBankAsalPemburukan.filter(item => item.label === 'TOTAL ASET')[0].value || 0;
            this.totalAsetPA = this.assetsBankAsalPemburukanPA.filter(item => item.label === 'TOTAL ASET')[0].value || 0;
            
            this.estimasiKerugian = this.liabilitiesEquityBankAsalPemburukanPA.find(item => item.label === 'Estimasi Kerugian')?.value || 0;

            console.log("modalAtmr", this.modalAtmr);

            const jumlah_pms = ((this.atmr * (this.totalAsetP / this.totalAsetB)) * 14 / 100) - (this.modalAtmr + this.estimasiKerugian);

            let asset_temp = this.assetsBankAsalPemburukanPA.find(item => item.label === 'Penempatan pada BI')?.value || 0;
            this.assetsBankAsalPemburukanPA.filter(item => item.label === 'Penempatan pada BI')[0].value = jumlah_pms + asset_temp;

            let liability_temp = this.liabilitiesEquityBankAsalPemburukanPA.find(item => item.label === 'Dana Setoran Modal')?.value || 0;
            this.liabilitiesEquityBankAsalPemburukanPA.filter(item => item.label === 'Dana Setoran Modal')[0].value = jumlah_pms + liability_temp;

            this.assetsBankAsalPemburukanPA.filter(item => item.label === 'TOTAL ASET')[0].value = 0;
            const totalAsetPA = this.assetsBankAsalPemburukanPA.reduce((sum, item) => sum + (item.value || 0), 0);
            this.assetsBankAsalPemburukanPA.filter(item => item.label === 'TOTAL ASET')[0].value = totalAsetPA;

            this.liabilitiesEquityBankAsalPemburukanPA.filter(item => item.label === 'Total Ekuitas')[0].value = 0;

            const totalEkuitasPA = this.liabilitiesEquityBankAsalPemburukanPA
              .filter(item => [
                'Modal Disetor',
                'Modal Dasar',
                'Modal yg Belum Disetor (-)',
                'Tambahan Modal Disetor',
                'Agio',
                'Penghasilan Komprehensif Lain',
                'Dana Setoran Modal',
                'Cadangan Umum',
                'Laba (Rugi)',
                'Laba Tahun Lalu',
                'Laba Tahun Berjalan',
                'Estimasi Kerugian'
              ].includes(item.label))
              .reduce((sum, item) => sum + (item.value || 0), 0);

              this.liabilitiesEquityBankAsalPemburukanPA.filter(item => item.label === 'Total Ekuitas')[0].value = totalEkuitasPA;

              const totalKewajiban = this.liabilitiesEquityBankAsalPemburukanPA.find(item => item.label === 'Total Kewajiban')?.value || 0;
              const total = totalEkuitasPA + totalKewajiban;
              this.liabilitiesEquityBankAsalPemburukanPA.filter(item => item.label === 'TOTAL KEWAJIBAN DAN EKUITAS')[0].value = total || 0;
              
              let nilai_ekuitas = this.liabilitiesEquityBankAsal.find(item => item.label === 'Total Ekuitas')?.value || 0;


              this.nilai_ekuitas_atmr

              this.nilai_ekuitas_atmr = nilai_ekuitas;
              this.nilai_total_PA = totalEkuitasPA;

              this.calTotalModal = totalEkuitasPA / nilai_ekuitas * this.modalAtmr;

              console.log("calTotalModal", this.calTotalModal);
              console.log("totalEkuitasPA", totalEkuitasPA);
              console.log("nilai_ekuitas", nilai_ekuitas);
              console.log("modalAtmr", this.modalAtmr);
            
              this.calTotalAtmr = this.calTotalModal / 14 * 100;
              console.log("calTotalAtmr", this.calTotalAtmr);


              const jumlahPmsLps = ((this.atmr * (this.totalAsetP / this.totalAsetB)) * 14 / 100) - (this.modalAtmr + this.estimasiKerugian);
              const totalBdl = this.asetBdl.find(item => item.label === 'Total Aset')?.value || 0;

              this.dataBiayaResolusi[1].pms = jumlahPmsLps || 0;
              this.dataBiayaResolusi[3].bankPerantara = (2/100 * totalBdl + this.datalik[2].value);
              this.dataBiayaResolusi[3].bankPenerima = this.dataBiayaResolusi[3].bankPerantara;
              this.dataBiayaResolusi[3].likuidasi = this.datalik[1].value + this.datalik[2].value;
              this.dataBiayaResolusi[4].likuidasi = this.datalik[3].value;
              this.dataBiayaResolusi[4].bankPenerima = this.dataBiayaResolusi[4].likuidasi;
              this.dataBiayaResolusi[4].bankPerantara = this.dataBiayaResolusi[4].likuidasi;

              this.dataBiayaResolusi[5].bankPenerima = this.dataBiayaResolusi[1].bankPenerima + this.dataBiayaResolusi[2].bankPenerima + this.dataBiayaResolusi[3].bankPenerima + this.dataBiayaResolusi[4].bankPenerima;
              this.dataBiayaResolusi[5].bankPerantara = this.dataBiayaResolusi[1].bankPerantara + this.dataBiayaResolusi[2].bankPerantara + this.dataBiayaResolusi[3].bankPerantara + this.dataBiayaResolusi[4].bankPerantara;
              this.dataBiayaResolusi[5].likuidasi = this.dataBiayaResolusi[1].likuidasi + this.dataBiayaResolusi[2].likuidasi + this.dataBiayaResolusi[3].likuidasi + this.dataBiayaResolusi[4].likuidasi;
              this.dataBiayaResolusi[5].pms = this.dataBiayaResolusi[1].pms + this.dataBiayaResolusi[2].pms + this.dataBiayaResolusi[3].pms + this.dataBiayaResolusi[4].pms || 0;

              const kreditBp = this.asetBp.find(item => item.label === 'Kredit (Net)')?.value || 0;
              const totalEkuitasPms = this.liabilitiesEquityBankAsalPemburukanPA.find(item => item.label === 'Total Ekuitas')?.value || 0;
              const kreditKol5 = this.assetsBankAsalPemburukan.find(item => item.label === 'Kredit Kol 5')?.value || 0;
              const propertiTb = this.assetsBankAsalPemburukan.find(item => item.label === 'Properti Terbengkalai')?.value || 0;
              const aydaTb = this.assetsBankAsalPemburukan.find(item => item.label === 'AYDA')?.value || 0;


              this.dataBiayaResolusi[6].bankPerantara = (4.97 / 100 * kreditBp);
              this.dataBiayaResolusi[6].pms = (((((((totalEkuitasPms * 1.002) * 1.002) * 1.002) * 1.002) * 1.002)) + (0.05 * (kreditKol5 + propertiTb + aydaTb)));

              this.dataBiayaResolusi[7].bankPerantara = totalBdl;
              this.dataBiayaResolusi[7].bankPenerima = totalBdl;
              this.dataBiayaResolusi[7].likuidasi = this.datalik[5].value;

              this.dataBiayaResolusi[8].bankPenerima = this.dataBiayaResolusi[6].bankPenerima + this.dataBiayaResolusi[7].bankPenerima;
              this.dataBiayaResolusi[8].bankPerantara = this.dataBiayaResolusi[6].bankPerantara + this.dataBiayaResolusi[7].bankPerantara;
              this.dataBiayaResolusi[8].likuidasi = this.dataBiayaResolusi[6].likuidasi + this.dataBiayaResolusi[7].likuidasi;
              this.dataBiayaResolusi[8].pms = this.dataBiayaResolusi[6].pms + this.dataBiayaResolusi[7].pms;

              this.dataBiayaResolusi[9].bankPenerima = this.dataBiayaResolusi[5].bankPenerima - this.dataBiayaResolusi[8].bankPenerima;
              this.dataBiayaResolusi[9].bankPerantara = this.dataBiayaResolusi[5].bankPerantara - this.dataBiayaResolusi[8].bankPerantara;
              this.dataBiayaResolusi[9].likuidasi = this.dataBiayaResolusi[5].likuidasi - this.dataBiayaResolusi[8].likuidasi;
              this.dataBiayaResolusi[9].pms = this.dataBiayaResolusi[5].pms - this.dataBiayaResolusi[8].pms;

              this.dataBiayaResolusi[11].bankPerantara = this.dataBiayaResolusi[6].bankPerantara;
              this.dataBiayaResolusi[11].pms = -(this.dataBiayaResolusi[9].pms);

              this.dataBiayaResolusi[12].bankPerantara = -(this.dataBiayaResolusi[9].bankPerantara) - this.dataBiayaResolusi[11].bankPerantara;
              this.dataBiayaResolusi[12].pms = -(this.dataBiayaResolusi[9].pms) - this.dataBiayaResolusi[11].pms;
              this.dataBiayaResolusi[12].likuidasi = -(this.dataBiayaResolusi[9].likuidasi) - this.dataBiayaResolusi[11].likuidasi;
              this.dataBiayaResolusi[12].bankPenerima = -(this.dataBiayaResolusi[9].bankPenerima) - this.dataBiayaResolusi[11].bankPenerima;
        }
    
    
    
    async getGwmData(){
        this.gwmData.giroBi = this.dataTableNeracaBank.penempatanPadaBI;

        const liabilitasBank = this.liabilitiesEquityBankAsal;
                
        if (liabilitasBank) {
            this.gwmData.dpkPdbl =
                (liabilitasBank.find(item => item.label === 'Giro')?.value ?? 0) +
                (liabilitasBank.find(item => item.label === 'Tabungan')?.value ?? 0) +
                (liabilitasBank.find(item => item.label === 'Simpanan Berjangka')?.value ?? 0) +
                (liabilitasBank.find(item => item.label === 'Kewajiban pada Bank Lain')?.value ?? 0)         }

        this.gwmDataHasilBi = (this.gwmData.total * +this.gwmData.parameter1 / 100) / ((+this.gwmData.parameter1 + +this.gwmData.parameter2) / 100)

        this.gwmDataHasilPdbl = (this.gwmData.total * +this.gwmData.parameter2 / 100) / ((+this.gwmData.parameter1 + +this.gwmData.parameter2) / 100)

        this.gwmData.total = this.gwmData.giroBi + this.gwmData.dpkPdbl;

        console.log("GWM Data", this.gwmData);
    }


    async getReportLct(tableName: string, keyword: string): Promise<void> {
        console.log('Table Name:', tableName);
        console.log('Keyword:', keyword);
      
        try {
          if (!tableName || !keyword) {
            throw new Error('Table name and keyword must be provided');
          }
      
          // Pastikan result selalu berupa array
          let result = await this.crudService.getDataLct(tableName, keyword) as ReportDataType[] | undefined;
          if(this.selectedPeriode == null){
                result = (await this.crudService.getDataLct(tableName, keyword)) as ReportDataType[] | undefined;
          }
          else{
                result = (await this.crudService.getDataLctPeriode(tableName, keyword, this.selectedPeriode)) as ReportDataType[] | undefined;
          }
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
    
    updateParentTotal(product: any) {
        console.log("ini product", product);
        console.log("ini table", this.modifiedDataTable1);
        this.updateDataFromModifiedTable1(product.pos);
    
        product.ckpn_aset_baik = (Number(product.ckpn_aset_baik_normal) || 0) + (Number(product.ckpn_aset_baik_restrukturisasi) || 0);
        product.ckpn_aset_kurang_baik = (Number(product.ckpn_aset_kurang_baik_normal) || 0) + (Number(product.ckpn_aset_kurang_baik_restrukturisasi) || 0);
        product.ckpn_aset_tidak_baik = (Number(product.ckpn_aset_tidak_baik_normal) || 0) + (Number(product.ckpn_aset_tidak_baik_restrukturisasi) || 0);
        product.ckpn = (Number(product.ckpn_normal) || 0) + (Number(product.ckpn_restrukturisasi) || 0);
        product.jumlah_rekening = (Number(product.jumlah_rekening_normal) || 0) + (Number(product.jumlah_rekening_restrukturisasi) || 0);
        product.baki_debet = (Number(product.baki_debet_normal) || 0) + (Number(product.baki_debet_restrukturisasi) || 0);
    
        if (product) {
            if (product.pos === 1) {
                // find pos nilai 1 di modifiedDataTable1
                const product = this.modifiedDataTable1.find(item => item.pos === 1);

                product.hasil_hitung = Number(product.baki_debet_pemeriksa) - Number(product.baki_debet);
                // let totalHasilHitung = this.modifiedDataTable1
                // .filter(item => [1].includes(item.pos))
                // .reduce((sum, item) => sum + (Number(item.baki_debet_pemeriksa) - Number(item.baki_debet) || 0), 0);
                console.log("hasil hitung rf1", product.hasil_hitung);

                this.modifiedDataTable3[0].diligence1 = -(
                    (Number(product.hasil_hitung))+
                    (Number(this.modifiedDataTable3[0].kredit_ffs1)) +
                    (Number(this.modifiedDataTable3[0].baki_debet_restrukturisasi1
                    ) || 0)
                );
            }
    
            if ([2, 3, 4].includes(product.pos)) {
                // product.hasil_hitung = Number(product.baki_debet_pemeriksa) - Number(product.baki_debet);

                // console.log("hasil hitung rf2", product.hasil_hitung);
    
                let totalHasilHitung = this.modifiedDataTable1
                    .filter(item => [2, 3, 4].includes(item.pos))
                    .reduce((sum, item) => sum + (Number(item.baki_debet_pemeriksa) - Number(item.baki_debet) || 0), 0);
                
                console.log("total", totalHasilHitung);

                this.modifiedDataTable3[0].diligence24 = -(
                    (Number(totalHasilHitung) || 0) +
                    (Number(this.modifiedDataTable3[0].restru1) || 0) +
                    (Number(this.modifiedDataTable3[0].baki_debet_restrukturisasi24) || 0)
                );
            }
        }
        this.modifiedDataTable3[0].baki_debet_restrukturisasi1 = this.modifiedDataTable1[0].baki_debet_restrukturisasi;
        console.log("baki_debet_restrukturisasi1", this.modifiedDataTable3[0].baki_debet_restrukturisasi1);
        console.log("baki debet", this.modifiedDataTable1[0].baki_debet);
        console.log("kredit ffs1", this.modifiedDataTable3[0].kredit_ffs1);
        console.log("baki debet restrukturisasi1", this.modifiedDataTable3[0].baki_debet_restrukturisasi1);
        console.log("diligence1", this.modifiedDataTable3[0].diligence1);
        
        this.modifiedDataTable1[0].baki_debet_res = parseInt(this.modifiedDataTable1[0].baki_debet) - (parseInt(this.modifiedDataTable3[0].kredit_ffs1) + parseInt(this.modifiedDataTable3[0].baki_debet_restrukturisasi1) + parseInt(this.modifiedDataTable3[0].diligence1));
        this.modifiedDataTable1[1].baki_debet_res = parseInt(this.modifiedDataTable1[1].baki_debet) - (parseInt(this.modifiedDataTable3[0].kredit_ffs2) + parseInt(this.modifiedDataTable3[0].baki_debet_restrukturisasi24) + parseInt(this.modifiedDataTable3[0].diligence24));
        this.modifiedDataTable1[2].baki_debet_res = parseInt(this.modifiedDataTable1[2].baki_debet)
        this.modifiedDataTable1[3].baki_debet_res = parseInt(this.modifiedDataTable1[3].baki_debet)
        this.modifiedDataTable1[4].baki_debet_res = parseInt(this.modifiedDataTable1[4].baki_debet) + (parseInt(this.modifiedDataTable3[0].kredit_ffs1) + parseInt(this.modifiedDataTable3[0].baki_debet_restrukturisasi1) + parseInt(this.modifiedDataTable3[0].diligence1)) + (parseInt(this.modifiedDataTable3[0].kredit_ffs2) + parseInt(this.modifiedDataTable3[0].baki_debet_restrukturisasi24) + parseInt(this.modifiedDataTable3[0].diligence24));
        

        console.log("modifiedtable1", this.modifiedDataTable1);
        console.log("modifiedtable3", this.modifiedDataTable3);
    }
    
    updateKreditFFS1(value: number) {
        this.modifiedDataTable3[0].kredit_ffs1 = value;
        this.modifiedDataTable3[0].pos = 1;
        this.updateParentTotal(this.modifiedDataTable3[0]);
    }

    updateKreditFFS2(value: number) {
        this.modifiedDataTable3[0].kredit_ffs2 = value;
        this.modifiedDataTable3[0].pos = 2;
        this.updateParentTotal(this.modifiedDataTable3[0]);
    }

    updateTotalPemburukan(product: any){
        console.log('modifiedTable1:', this.modifiedDataTable1);
        console.log('modifiedTable3:', this.modifiedDataTable3);
    }
    
    updateDataFromModifiedTable1(productId: number) {
        console.log('product', productId);
    
        if (!this.modifiedDataTable3 || this.modifiedDataTable3.length === 0) {
            this.modifiedDataTable3 = [{}];
        }
    
        if (productId === 1) {
            const product1 = this.modifiedDataTable1.find(item => item.pos === productId);
            if (!product1) {
                console.warn(`Produk dengan ID ${productId} tidak ditemukan.`);
                return;
            }
            this.modifiedDataTable3[0].baki_debet_baki_debet_ = product1.baki_debet_restrukturisasi;
            console.log('tabel3 -1 ', this.modifiedDataTable3);
        }
    
        if ([2, 3, 4].includes(productId)) {
            const filteredProducts = this.modifiedDataTable1.filter(item => [2, 3, 4].includes(item.pos));
    
            if (filteredProducts.length === 0) {
                console.warn('Tidak ada produk dengan ID 2, 3, atau 4 yang ditemukan.');
                return;
            }
    
            const totalBakiDebet = filteredProducts.reduce((sum, item) => sum + (+item.baki_debet_restrukturisasi || 0), 0);
    
            this.modifiedDataTable3[0].baki_debet_restrukturisasi24 = totalBakiDebet;
            console.log('tabel3 -1 ', this.modifiedDataTable3);
        }


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

      onVariableChange2(): void {
        console.log('ati terbengkalai', this.ati_ke_properti_terbengkalai);
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

    onValueChange(event: any) {
        // Total Biaya
        this.datalik[4].value = this.datalik[0].value + this.datalik[1].value + this.datalik[2].value + this.datalik[3].value;

        // Total Surplus
        this.datalik[6].value = this.datalik[5].value - this.datalik[4].value;


        this.datalik[9].value = this.datalik[8].value * 9 * 50 / 100;

        this.datalik[11].value = this.datalik[9].value + this.datalik[10].value;

        console.log('Data LIK', this.datalik);
        console.log('Event  ', event);

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
    
        // Sheet 1: Hasil Analisis LCT
        const worksheetData1 = [
            ['', 'LPS'],
            ['', 'Dokumen ini di-download pada waktu:'],
            ['', timestamp],
            [],
            ['', 'Hasil Analisis LCT'],
            [],
            ['', 'Deskripsi', 'Nominal Rupiah', 'Nominal Valas', 'Nominal Total', 'Hasil'],
        ];
    
        this.modifiedDataTable.forEach((report) => {
            const rowData: string[] = [
                '',
                report?.pos || '-',
                report?.nominal_rupiah || '0',
                report?.nominal_valas || '0',
                report?.nominal_total || '0',
                report?.hasil || '-',
            ];
            worksheetData1.push(rowData);
        });
    
        const worksheet1 = XLSX.utils.aoa_to_sheet(worksheetData1);
        XLSX.utils.book_append_sheet(workbook, worksheet1, 'Hasil Analisis LCT');
    
        // Sheet 2: Summary Kredit
        const worksheetData2 = [
            ['', 'Data Bank Kredit Pembayaran'],
            [],
            ['', 'Kredit', 'CKPN Aset Baik', 'CKPN Aset Kurang Baik', 'CKPN Aset Tidak Baik', 'CKPN', 'Jumlah Rekening', 'Baki Debet', 'Baki Debet Pemeriksa', 'Hasil Hitung'],
        ];
    
        this.modifiedDataTable1.forEach((report) => {
            const rowData: string[] = [
                '',
                report?.pos || '-',
                report?.ckpn_aset_baik || '0',
                report?.ckpn_aset_kurang_baik || '0',
                report?.ckpn_aset_tidak_baik || '0',
                report?.ckpn || '0',
                report?.jumlah_rekening || '0',
                report?.baki_debet || '0',
                report?.baki_debet_pemeriksa || '0',
                report?.baki_debet_pemeriksa - report?.baki_debet|| '0',
            ];
            worksheetData2.push(rowData);
        });
    
        const worksheetData21 = [
            ['', 'Parameter Data'],
            [],
            ['', 'Skenario Pemburukan', 'Kol 1', 'Kol 2-4', 'Total', 'Keterangan'],
        ];

        if (this.modifiedDataTable3 && this.modifiedDataTable3.length > 0) {
            const data = this.modifiedDataTable3[0];

            worksheetData21.push(
                ['', 'Kredit FFS', String(data.kredit_ffs1 || 0), String(data.kredit_ffs2 || 0), 
                    String((+data.kredit_ffs1 || 0) + (+data.kredit_ffs2 || 0)), 'Penyesuaian -> Macet'],
                ['', 'Restru < COF', String(data.baki_debet_restrukturisasi1 || 0), String(data.baki_debet_restrukturisasi24 || 0), 
                    String((+data.baki_debet_restrukturisasi1 || 0) + (+data.baki_debet_restrukturisasi24 || 0)), 'Penyesuaian -> Macet'],
                ['', 'Temuan due diligence', String(data.diligence1 || 0), String(data.diligence24 || 0), 
                    String((+data.diligence1 || 0) + (+data.diligence24 || 0)), 'Penyesuaian -> Macet'],
                [],
                ['', 'Grand Total', '', '', 
                    String(
                        (+data.kredit_ffs1 || 0) + (+data.kredit_ffs2 || 0) +
                        (+data.baki_debet_restrukturisasi1 || 0) + (+data.baki_debet_restrukturisasi24 || 0) +
                        (+data.diligence1 || 0) + (+data.diligence24 || 0)
                    ), '']
            );
        }

        const worksheetDataSkenario = [
            ['', 'Skenario Pemburukan'],
            [],
            ['', 'Kualitas Kredit', 'Jumlah Rekening', 'Baki Debet'],
        ];

        this.modifiedDataTable1.forEach((report) => {
            const rowData = [
                '',
                report?.pos || '-',
                report?.jumlah_rekening || '0',
                report?.baki_debet_res || '0',
            ];
            worksheetDataSkenario.push(rowData);
        });

        worksheetDataSkenario.push(
            ['', 'Grand Total', 
            String(this.getTotal('modifiedDataTable1', 'jumlah_rekening') || 0),
            String(this.getTotal('modifiedDataTable1', 'baki_debet_res') || 0)]
        );

        const worksheetDataFinal = [...worksheetData2, [], ...worksheetData21, [], ...worksheetDataSkenario];

        const worksheetFinal = XLSX.utils.aoa_to_sheet(worksheetDataFinal);
        XLSX.utils.book_append_sheet(workbook, worksheetFinal, 'Summary Kredit');
        
    
        // // Sheet 3: GWM (Giro Wajib Minimum)
        // const worksheetData3 = [
        //     ['', 'Data Bank GWM'],
        //     [],
        //     ['', 'Parameter', 'Nilai Asal', 'Operasi', 'Hasil', 'Keterangan'],
        // ];
    
        // if (this.gwmData) {
        //     worksheetData3.push(
        //         ['', 'Giro BI', String(this.gwmData.giroBi || 0), String(this.gwmData.parameter1 || 0) + '%', String(this.calculateGwmResult(1) || 0), ''],
        //         ['', 'DPK+PDBL', String(this.gwmData.dpkPdbl || 0), String(this.gwmData.parameter2 || 0) + '%', String(this.calculateGwmResult(2) || 0), ''],
        //         ['', 'Total', String(this.gwmData.total || 0), String((+this.gwmData.parameter1 + +this.gwmData.parameter2)) + '%', String(this.calculateGwmTotal() || 0), '']
        //     );
        // }
        
        // const worksheet3 = XLSX.utils.aoa_to_sheet(worksheetData3);

        const table = document.getElementById('tableGwm');

        if (!table) {
            console.error("Tabel GWM tidak ditemukan!");
            return;
        }
  
        // Konversi tabel ke worksheet Excel
        const worksheet3 = XLSX.utils.table_to_sheet(table);
  
        XLSX.utils.book_append_sheet(workbook, worksheet3, 'GWM');


        // sheet 4:neraca BV & FV
        const worksheetData4 = [
            ['', 'Neraca BV & FV'],
            [],
            ['', 'Kategori', 'Label', 'Nilai'],
        ];
        
        this.assetsBankAsal.forEach((item) => {
            worksheetData4.push(['', 'ASET', item.label, String(item.value ?? '0')]);
        });
        
        this.liabilitiesEquityBankAsal.forEach((item) => {
            worksheetData4.push(['', 'LIABILITAS & EKUITAS', item.label, String(item.value ?? '0')]);
        });
        
        worksheetData4.push([], ['', 'BANK ASAL MENGGUNAKAN HASIL PEMBURUKAN'], [], ['', 'Kategori', 'Label', 'Nilai']);
        
        this.assetsBankAsalPemburukan.forEach((item) => {
            worksheetData4.push(['', 'ASET', item.label, String(item.value ?? '0')]);
        });
        
        this.liabilitiesEquityBankAsalPemburukan.forEach((item) => {
            worksheetData4.push(['', 'LIABILITAS & EKUITAS', item.label, String(item.value ?? '0')]);
        });
        
        worksheetData4.push([], ['', 'BANK ASAL MENGGUNAKAN HASIL PEMBURUKAN - FAIR VALUE'], [], ['', 'Kategori', 'Label', 'Nilai']);
        
        this.assetsBankAsalPemburukanC.forEach((item) => {
            worksheetData4.push(['', 'ASET', item.label, String(item.value ?? '0')]);
        });
        
        this.liabilitiesEquityBankAsalPemburukanC.forEach((item) => {
            worksheetData4.push(['', 'LIABILITAS & EKUITAS', item.label, String(item.value ?? '0')]);
        });
        
        this.assetsBankAsal.forEach((item) => {
            worksheetData4.push(['', 'ASET', item.label, String(item.value ?? '0')]);
        });
        
        this.liabilitiesEquityBankAsal.forEach((item) => {
            worksheetData4.push(['', 'LIABILITAS & EKUITAS', item.label, String(item.value ?? '0')]);
        });
        
        this.assetsBankAsalPemburukan.forEach((item) => {
            worksheetData4.push(['', 'ASET (Pemburukan)', item.label, String(item.value ?? '0')]);
        });
        
        this.liabilitiesEquityBankAsalPemburukan.forEach((item) => {
            worksheetData4.push(['', 'LIABILITAS & EKUITAS (Pemburukan)', item.label, String(item.value ?? '0')]);
        });
        
        this.assetsBankAsalPemburukanC.forEach((item) => {
            worksheetData4.push(['', 'ASET (Fair Value)', item.label, String(item.value ?? '0')]);
        });
        
        this.liabilitiesEquityBankAsalPemburukanC.forEach((item) => {
            worksheetData4.push(['', 'LIABILITAS & EKUITAS (Fair Value)', item.label, String(item.value ?? '0')]);
        });
        
        this.assetsBankAsal.forEach((item) => {
            worksheetData4.push(['', 'ASET', item.label, String(item.value ?? '0')]);
        });
        
        this.liabilitiesEquityBankAsal.forEach((item) => {
            worksheetData4.push(['', 'LIABILITAS & EKUITAS', item.label, String(item.value ?? '0')]);
        });
        
        const worksheetDataBVFV = [
            ['', 'Neraca BV & FV'],
            [],
            ['', 'Kategori', 'Label', 'Nilai'],
        ];
        
        this.assetsBankAsal.forEach((item) => {
            worksheetDataBVFV.push(['', 'ASET', item.label, String(item.value ?? '0')]);
        });
        
        this.liabilitiesEquityBankAsal.forEach((item) => {
            worksheetDataBVFV.push(['', 'LIABILITAS & EKUITAS', item.label, String(item.value ?? '0')]);
        });
        
        worksheetDataBVFV.push([], ['', 'BANK ASAL MENGGUNAKAN HASIL PEMBURUKAN'], [], ['', 'Kategori', 'Label', 'Nilai']);
        
        this.assetsBankAsalPemburukan.forEach((item) => {
            worksheetDataBVFV.push(['', 'ASET', item.label, String(item.value ?? '0')]);
        });
        
        this.liabilitiesEquityBankAsalPemburukan.forEach((item) => {
            worksheetDataBVFV.push(['', 'LIABILITAS & EKUITAS', item.label, String(item.value ?? '0')]);
        });
        
        worksheetDataBVFV.push([], ['', 'BANK ASAL MENGGUNAKAN HASIL PEMBURUKAN - FAIR VALUE'], [], ['', 'Kategori', 'Label', 'Nilai']);
        
        this.assetsBankAsalPemburukanC.forEach((item) => {
            worksheetDataBVFV.push(['', 'ASET', item.label, String(item.value ?? '0')]);
        });
        
        this.liabilitiesEquityBankAsalPemburukanC.forEach((item) => {
            worksheetDataBVFV.push(['', 'LIABILITAS & EKUITAS', item.label, String(item.value ?? '0')]);
        });
        const worksheetBVFV = XLSX.utils.aoa_to_sheet(worksheetDataBVFV);
        XLSX.utils.book_append_sheet(workbook, worksheetBVFV, 'Neraca BV & FV');

                // Sheet 1: SCV Data
                const worksheetDataSCV = [
                    ['', 'Single Customer View'],
                    [],
                    ['', 'Kode Bank', 'Periode', 'Deskripsi', 'Jumlah Nasabah Penyimpan', 'Jumlah Rekening Simpanan', 'Jumlah Saldo Simpanan', 'Jumlah Saldo Simpanan Dijamin'],
                ];
        
                this.components1.forEach(item => {
                    worksheetDataSCV.push([
                        '',
                        item.nama_bank || '-',
                        `${item.tahun}-${item.bulan}`,
                        item.deskripsi,
                        item.jumlah_nasabah_penyimpan,
                        item.jumlah_rekening_simpanan,
                        item.jumlah_saldo_simpanan,
                        item.jumlah_saldo_simpanan_dijamin
                    ]);
                });
        
                const worksheetSCV = XLSX.utils.aoa_to_sheet(worksheetDataSCV);
                XLSX.utils.book_append_sheet(workbook, worksheetSCV, 'SCV');

                        // Sheet 3: Rincian Pengalihan
        const worksheetDataRincianPengalihan = [
            ['', 'Rincian Pengalihan'],
            [],
            ['', 'Aset yang Akan Dialihkan', 'Nominal', 'FV', 'Selisih'],
        ];

        this.financialTerms.forEach(item => {
            worksheetDataRincianPengalihan.push([
                '',
                item.label,
                String(item.nominal),
                String(item.fv),
                String(item.nominal - item.fv) // Selisih
            ]);
        });

        worksheetDataRincianPengalihan.push([], ['', 'Kewajiban yang Akan Dialihkan', 'Nominal', 'FV']);

        this.kewajibanAlih.forEach(item => {
            worksheetDataRincianPengalihan.push([
                '',
                item.label,
                String(item.nominal),
                String(item.fv)
            ]);
        });

        worksheetDataRincianPengalihan.push([], ['', 'P&A dan BB']);

        this.posPengalihan.forEach(item => {
            worksheetDataRincianPengalihan.push([
                '',
                item.label,
                String(item.nominal)
            ]);
        });

        worksheetDataRincianPengalihan.push(['', 'Total Selisih', String(this.getSelisihTotal())]);

        const worksheetRincianPengalihan = XLSX.utils.aoa_to_sheet(worksheetDataRincianPengalihan);
        XLSX.utils.book_append_sheet(workbook, worksheetRincianPengalihan, 'Rincian Pengalihan');
    
        // Get tables from the DOM by their IDs
        // const tableBB_Aset = document.getElementById('tableBB_Aset');
        // const tableBB_Liabilities = document.getElementById('tableBB_Liabilities');
        // const tableBB_Pemburukan_Aset = document.getElementById('tableBB_Pemburukan_Aset');
        // const tableBB_Pemburukan_Liabilities = document.getElementById('tableBB_Pemburukan_Liabilities');
        // const tableBB_FairValue_Aset = document.getElementById('tableBB_FairValue_Aset');
        // const tableBB_FairValue_Liabilities = document.getElementById('tableBB_FairValue_Liabilities');
        // const tableBB_CekSelisih = document.getElementById('tableBB_CekSelisih');

        const worksheetDataBB = [];

        // Append BB Report Title
        worksheetDataBB.push(['', `Laporan Keuangan Bank ${this.selectedSearch || " - "}`], []);
        
        // Section: Bank Asal
        worksheetDataBB.push(['', 'A. BANK ASAL'], []);
        worksheetDataBB.push(['ASET', '', '', 'LIABILITAS & EKUITAS']);

        // Add ASET & LIABILITIES side-by-side
        const maxLength = Math.max(this.assetsBankAsal.length, this.liabilitiesEquityBankAsal.length);

        for (let i = 0; i < maxLength; i++) {
            worksheetDataBB.push([
                this.assetsBankAsal[i]?.label || '',
                this.assetsBankAsal[i]?.value || '',
                '',
                this.liabilitiesEquityBankAsal[i]?.label || '',
                this.liabilitiesEquityBankAsal[i]?.value || ''
            ]);
        }

        worksheetDataBB.push([], ['', 'A. BANK ASAL - MENYESUAIKAN HASIL PENDALAMAN LPS'], []);

        // Section: Bank Asal - Menyesuaikan Hasil Pendalaman LPS
        worksheetDataBB.push(['ASET (Pemburukan)', '', '', 'LIABILITAS & EKUITAS (Pemburukan)']);

        const maxLengthPemburukan = Math.max(this.assetsBankAsalPemburukan.length, this.liabilitiesEquityBankAsalPemburukan.length);

        for (let i = 0; i < maxLengthPemburukan; i++) {
            worksheetDataBB.push([
                this.assetsBankAsalPemburukan[i]?.label || '',
                this.assetsBankAsalPemburukan[i]?.value || '',
                '',
                this.liabilitiesEquityBankAsalPemburukan[i]?.label || '',
                this.liabilitiesEquityBankAsalPemburukan[i]?.value || ''
            ]);
        }

        worksheetDataBB.push([], ['', 'A. BANK ASAL (FAIR VALUE)'], []);

        // Section: Bank Asal (Fair Value)
        worksheetDataBB.push(['ASET (Fair Value)', '', '', 'LIABILITAS & EKUITAS (Fair Value)']);

        const maxLengthFairValue = Math.max(this.assetsBankAsalPemburukanC.length, this.liabilitiesEquityBankAsalPemburukanC.length);

        for (let i = 0; i < maxLengthFairValue; i++) {
            worksheetDataBB.push([
                this.assetsBankAsalPemburukanC[i]?.label || '',
                this.assetsBankAsalPemburukanC[i]?.value || '',
                '',
                this.liabilitiesEquityBankAsalPemburukanC[i]?.label || '',
                this.liabilitiesEquityBankAsalPemburukanC[i]?.value || ''
            ]);
        }

        worksheetDataBB.push([], ['', 'B. BANK PERANTARA'], []);

        // Section: Bank Perantara
        worksheetDataBB.push(['ASET (Bank Perantara)', '', '', 'LIABILITAS & EKUITAS (Bank Perantara)']);

        const maxLengthBP = Math.max(this.asetBp.length, this.kewajibanBp.length);

        for (let i = 0; i < maxLengthBP; i++) {
            worksheetDataBB.push([
                this.asetBp[i]?.label || '',
                this.asetBp[i]?.value || '',
                '',
                this.kewajibanBp[i]?.label || '',
                this.kewajibanBp[i]?.value || ''
            ]);
        }

        worksheetDataBB.push([], ['', 'C. BANK DALAM LIKUIDASI'], []);

        // Section: Bank Dalam Likuidasi
        worksheetDataBB.push(['ASET (BDL)', '', '', 'LIABILITAS & EKUITAS (BDL)']);

        const maxLengthBDL = Math.max(this.asetBdl.length, this.kewajibanBdl.length);

        for (let i = 0; i < maxLengthBDL; i++) {
            worksheetDataBB.push([
                this.asetBdl[i]?.label || '',
                this.asetBdl[i]?.value || '',
                '',
                this.kewajibanBdl[i]?.label || '',
                this.kewajibanBdl[i]?.value || ''
            ]);
        }

        // Section: Cek Selisih
        worksheetDataBB.push([], ['', 'CEK SELISIH'], []);

        worksheetDataBB.push(['Kategori', 'ASET', 'Kewajiban', 'Modal', 'Kew + Modal']);

        this.cekDataBb.forEach(item => {
            worksheetDataBB.push([
                item.label,
                item.aset,
                item.kewajiban,
                item.modal,
                item.kew_modal
            ]);
        });

        // Convert Data to Excel Sheet
        const worksheetBB = XLSX.utils.aoa_to_sheet(worksheetDataBB);
        XLSX.utils.book_append_sheet(workbook, worksheetBB, 'BB');

        const worksheetDataPA = [];

        // Append P&A Report Title
        worksheetDataPA.push(['', `Laporan Keuangan Bank ${this.selectedSearch || " - "}`], []);
        
        // Section: Bank Asal
        worksheetDataPA.push(['', 'A. BANK ASAL'], []);
        worksheetDataPA.push(['ASET', '', '', 'LIABILITAS & EKUITAS']);

        // Add ASET & LIABILITIES side-by-side
        const maxLength1 = Math.max(this.assetsBankAsal.length, this.liabilitiesEquityBankAsal.length);

        for (let i = 0; i < maxLength1; i++) {
            worksheetDataPA.push([
                this.assetsBankAsal[i]?.label || '',
                this.assetsBankAsal[i]?.value || '',
                '',
                this.liabilitiesEquityBankAsal[i]?.label || '',
                this.liabilitiesEquityBankAsal[i]?.value || ''
            ]);
        }

        worksheetDataPA.push([], ['', 'A. BANK ASAL - MENYESUAIKAN HASIL PENDALAMAN LPS'], []);

        // Section: Bank Asal - Menyesuaikan Hasil Pendalaman LPS
        worksheetDataPA.push(['ASET (Pemburukan)', '', '', 'LIABILITAS & EKUITAS (Pemburukan)']);

        const maxLengthPemburukan1 = Math.max(this.assetsBankAsalPemburukan.length, this.liabilitiesEquityBankAsalPemburukan.length);

        for (let i = 0; i < maxLengthPemburukan1; i++) {
            worksheetDataPA.push([
                this.assetsBankAsalPemburukan[i]?.label || '',
                this.assetsBankAsalPemburukan[i]?.value || '',
                '',
                this.liabilitiesEquityBankAsalPemburukan[i]?.label || '',
                this.liabilitiesEquityBankAsalPemburukan[i]?.value || ''
            ]);
        }

        worksheetDataPA.push([], ['', 'A. BANK ASAL (FAIR VALUE)'], []);

        // Section: Bank Asal (Fair Value)
        worksheetDataPA.push(['ASET (Fair Value)', '', '', 'LIABILITAS & EKUITAS (Fair Value)']);

        const maxLengthFairValue1 = Math.max(this.assetsBankAsalPemburukanC.length, this.liabilitiesEquityBankAsalPemburukanC.length);

        for (let i = 0; i < maxLengthFairValue1; i++) {
            worksheetDataPA.push([
                this.assetsBankAsalPemburukanC[i]?.label || '',
                this.assetsBankAsalPemburukanC[i]?.value || '',
                '',
                this.liabilitiesEquityBankAsalPemburukanC[i]?.label || '',
                this.liabilitiesEquityBankAsalPemburukanC[i]?.value || ''
            ]);
        }

        worksheetDataPA.push([], ['', 'B. BANK PENERIMA'], []);

        // Section: Bank Penerima
        worksheetDataPA.push(['ASET (Bank Penerima)', '', '', 'LIABILITAS & EKUITAS (Bank Penerima)']);

        const maxLengthBP1 = Math.max(this.asetBp.length, this.kewajibanBp.length);

        for (let i = 0; i < maxLengthBP1; i++) {
            worksheetDataPA.push([
                this.asetBp[i]?.label || '',
                this.asetBp[i]?.value || '',
                '',
                this.kewajibanBp[i]?.label || '',
                this.kewajibanBp[i]?.value || ''
            ]);
        }

        worksheetDataPA.push([], ['', 'C. BANK DALAM LIKUIDASI'], []);

        // Section: Bank Dalam Likuidasi
        worksheetDataPA.push(['ASET (BDL)', '', '', 'LIABILITAS & EKUITAS (BDL)']);

        const maxLengthBDL1 = Math.max(this.asetBdl.length, this.kewajibanBdl.length);

        for (let i = 0; i < maxLengthBDL1; i++) {
            worksheetDataPA.push([
                this.asetBdl[i]?.label || '',
                this.asetBdl[i]?.value || '',
                '',
                this.kewajibanBdl[i]?.label || '',
                this.kewajibanBdl[i]?.value || ''
            ]);
        }

        // Convert Data to Excel Sheet
        const worksheetPA = XLSX.utils.aoa_to_sheet(worksheetDataPA);
        XLSX.utils.book_append_sheet(workbook, worksheetPA, 'P&A');

        const worksheetDataPMS = [];

        // Title
        worksheetDataPMS.push(['', `Laporan Keuangan Bank ${this.selectedSearch || " - "}`], []);
        worksheetDataPMS.push(['', 'Perhitungan Rasio KPMM'], []);
        
        // Section 1: KPMM Ratios
        worksheetDataPMS.push(['Kategori', 'ATMR', 'Modal', 'Rasio KPMM (%)']);

        worksheetDataPMS.push([
            'Bank Asal',
            this.atmr,
            this.modalAtmr,
            ((this.modalAtmr / this.atmr) * 100 || 0).toFixed(2) + '%'
        ]);

        worksheetDataPMS.push([
            'Bank Asal Pemburukan',
            (this.atmr * (this.totalAsetP / this.totalAsetB) || 0).toFixed(0),
            `(${(this.modalAtmr + this.estimasiKerugian) || 0})`,
            (((this.modalAtmr + this.estimasiKerugian) / (this.atmr * (this.totalAsetP / this.totalAsetB))) * 100 || 0).toFixed(2) + '%'
        ]);

        worksheetDataPMS.push([
            'Bank Setelah PMS',
            this.calTotalAtmr,
            `(${this.calTotalModal})`,
            ((this.calTotalModal / this.calTotalAtmr) * 100).toFixed(2) + '%'
        ]);

        worksheetDataPMS.push([], ['', 'KEBUTUHAN PMS (14% KPMM)'], []);

        // Section 2: PMS Calculation Table
        worksheetDataPMS.push(['Kategori', 'Nilai']);

        worksheetDataPMS.push(['Jumlah Modal', this.modalAtmr]);
        worksheetDataPMS.push(['Koreksi Neraca', `(${this.estimasiKerugian})`]);

        worksheetDataPMS.push([
            'Jumlah Modal sebagai KPMM setelah Koreksi',
            this.modalAtmr + this.estimasiKerugian
        ]);

        worksheetDataPMS.push(['ATMR (Awal)', this.atmr]);
        worksheetDataPMS.push(['ATMR (Pemburukan)', (this.atmr * (this.totalAsetP / this.totalAsetB) || 0).toFixed(0)]);

        worksheetDataPMS.push([
            'Modal untuk memenuhi KPMM 14%',
            ((this.atmr * (this.totalAsetP / this.totalAsetB)) * 14 / 100).toFixed(0)
        ]);

        worksheetDataPMS.push([
            'Jumlah PMS LPS',
            (((this.atmr * (this.totalAsetP / this.totalAsetB)) * 14 / 100) - (this.modalAtmr + this.estimasiKerugian)).toFixed(0)
        ]);

        worksheetDataPMS.push([], ['', 'A. BANK ASAL'], []);

        // Section 3: Bank Asal - ASET vs LIABILITAS & EKUITAS
        worksheetDataPMS.push(['ASET', '', '', 'LIABILITAS & EKUITAS']);

        const maxLengthAssets = Math.max(this.assetsBankAsalPemburukanP.length, this.liabilitiesEquityBankAsal.length);

        for (let i = 0; i < maxLengthAssets; i++) {
            worksheetDataPMS.push([
                this.assetsBankAsalPemburukanP[i]?.label || '',
                this.assetsBankAsalPemburukanP[i]?.value || '',
                '',
                this.liabilitiesEquityBankAsal[i]?.label || '',
                this.liabilitiesEquityBankAsal[i]?.value || ''
            ]);
        }

        worksheetDataPMS.push([], ['', 'A. BANK ASAL - PEMBURUKAN'], []);

        // Section 4: Bank Asal Pemburukan - ASET vs LIABILITAS
        worksheetDataPMS.push(['ASET (Pemburukan)', '', '', 'LIABILITAS & EKUITAS (Pemburukan)']);

        const maxLengthPemburukan2 = Math.max(this.assetsBankAsalPemburukan.length, this.liabilitiesEquityBankAsalPemburukan.length);

        for (let i = 0; i < maxLengthPemburukan2; i++) {
            worksheetDataPMS.push([
                this.assetsBankAsalPemburukan[i]?.label || '',
                this.assetsBankAsalPemburukan[i]?.value || '',
                '',
                this.liabilitiesEquityBankAsalPemburukan[i]?.label || '',
                this.liabilitiesEquityBankAsalPemburukan[i]?.value || ''
            ]);
        }

        worksheetDataPMS.push([], ['', 'B. BANK ASAL SETELAH PMS OLEH LPS'], []);

        // Section 5: Bank Asal Setelah PMS - ASET vs LIABILITAS
        worksheetDataPMS.push(['ASET (Setelah PMS)', '', '', 'LIABILITAS & EKUITAS (Setelah PMS)']);

        const maxLengthAfterPMS = Math.max(this.assetsBankAsalPemburukanPA.length, this.liabilitiesEquityBankAsalPemburukanPA.length);

        for (let i = 0; i < maxLengthAfterPMS; i++) {
            worksheetDataPMS.push([
                this.assetsBankAsalPemburukanPA[i]?.label || '',
                this.assetsBankAsalPemburukanPA[i]?.value || '',
                '',
                this.liabilitiesEquityBankAsalPemburukanPA[i]?.label || '',
                this.liabilitiesEquityBankAsalPemburukanPA[i]?.value || ''
            ]);
        }

        // Convert Data to Excel Sheet
        const worksheetPMS = XLSX.utils.aoa_to_sheet(worksheetDataPMS);
        XLSX.utils.book_append_sheet(workbook, worksheetPMS, 'PMS');

        const worksheetDataLIK = [];

        // Title
        worksheetDataLIK.push(['', `Laporan Biaya Likuidasi (LIK) Bank ${this.selectedSearch || " - "}`], []);
        
        // Table Headers
        worksheetDataLIK.push(['Keterangan', 'Biaya Likuidasi']);

        // Add Data Rows
        this.datalik.forEach(row => {
            if (row.isSubheader) {
                // Subheader row (bold & centered)
                worksheetDataLIK.push([row.label, '']);
            } else {
                // Data row
                worksheetDataLIK.push([
                    row.label,
                    row.noInput ? row.value : row.value.toLocaleString('id-ID') // Format for read-only fields
                ]);
            }
        });

        // Convert Data to Excel Sheet
        const worksheetLIK = XLSX.utils.aoa_to_sheet(worksheetDataLIK);
        XLSX.utils.book_append_sheet(workbook, worksheetLIK, 'LIK');

        const worksheetDataBiayaResolusi = [];

        // Title
        worksheetDataBiayaResolusi.push(['', `Laporan Biaya Resolusi Bank ${this.selectedSearch || " - "}`], []);
        
        // Table Headers
        worksheetDataBiayaResolusi.push(['Keterangan', 'Bank Perantara', 'Bank Penerima', 'PMS', 'Likuidasi']);

        // Add Data Rows
        this.dataBiayaResolusi.forEach(row => {
            if (row.isSubheader) {
                // Subheader row (bold & centered)
                worksheetDataBiayaResolusi.push([row.label, '', '', '', '']);
            } else {
                // Data row with formatted numbers
                worksheetDataBiayaResolusi.push([
                    row.label,
                    row.bankPerantara?.toLocaleString('id-ID') || '',
                    row.bankPenerima?.toLocaleString('id-ID') || '',
                    row.pms?.toLocaleString('id-ID') || '',
                    row.likuidasi?.toLocaleString('id-ID') || ''
                ]);
            }
        });

        // Convert Data to Excel Sheet
        const worksheetBiayaResolusi = XLSX.utils.aoa_to_sheet(worksheetDataBiayaResolusi);
        XLSX.utils.book_append_sheet(workbook, worksheetBiayaResolusi, 'Biaya Resolusi');

        // Generate Excel file
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        
        // Simpan file
        saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            'lct_report.xlsx'
        );
    }


    calculateGwmResult(type: number): number {
        if (!this.gwmData) return 0;
    
        const total = this.gwmData.total || 0;
        const param1 = this.gwmData.parameter1 || 0;
        const param2 = this.gwmData.parameter2 || 0;
    
        if (param1 + param2 === 0) return 0; // Mencegah pembagian oleh nol
    
        let result = 0;
    
        if (type === 1) {
            result = Math.round((total * param1) / (param1 + param2));
        } else {
            result = Math.round((total * param2) / (param1 + param2));
        }
    
        return result;
    }
    
    

    calculateGwmTotal(): number {
        return this.calculateGwmResult(1) + this.calculateGwmResult(2);
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
            const Insured = this.kewajibanAlih.find(item1 => item1.label === 'Insured Deposits');
            if (Insured) {
                Insured.nominal = 0;
            }

            this.components1.filter(item => item.deskripsi === 'B.1 Kategori 1' || item.deskripsi === 'B. 3 Kategori 3').forEach(item => {
                if (Insured) {
                    Insured.nominal += item.jumlah_saldo_simpanan_dijamin || 0;
                    console.log('Insured', Insured);
                    const InsuredPos = this.posPengalihan.find(item1 => item1.label === 'Kewajiban yang dialihkan');
                    if (InsuredPos) {
                        InsuredPos.nominal = Insured.nominal;
                    }
                    //BB
                        this.asetBp = [
                            { label: 'ASET', value: 0, isSubheader: true },
                            { label: 'Kas', value: this.dataTableNeracaBank.kas },
                            { label: 'Penempatan pada BI', value: this.assetsBankAsalPemburukan[2].value || 0 },
                            { label: 'Penempatan pada Bank Lain', value: this.dataTableNeracaBank.penempatanPadaBankLain },
                            { label: 'Surat Berharga', value: this.assetsBankAsalPemburukanC[4].value || 0},
                            { label: 'Surat Berharga (REPO)', value: this.dataTableNeracaBank.suratBerhargaRepo },
                            { label: 'Reverse Repo', value: this.dataTableNeracaBank.reverseRepo },
                            { label: 'Kredit (Net)', value: ((this.assetsBankAsalPemburukanC[11].value || 0) + (this.assetsBankAsalPemburukanC[13].value || 0))},
                            { label: 'Lancar', value: ((this.assetsBankAsalPemburukan[11].value || 0) + (this.assetsBankAsalPemburukan[12].value || 0))},
                            { label: 'Dalam Perhatian Khusus', value: ((this.assetsBankAsalPemburukan[13].value || 0) + (this.assetsBankAsalPemburukan[14].value || 0))},
                            { label: 'Aset tetap dan inventaris - Net', value: ((this.assetsBankAsalPemburukanC.filter(item => item.label === 'Aset Tetap dan Inventaris')[0]?.value || 0) + (this.assetsBankAsalPemburukanC.filter(item => item.label === 'Akumulasi Penyusutan (-)')[0]?.value || 0)) || 0},
                            { label: 'Aset tak berwujud - Net', value: ((this.assetsBankAsalPemburukanC.filter(item => item.label === 'Aset Tidak Berwujud')[0]?.value || 0) + (this.assetsBankAsalPemburukanC.filter(item => item.label === 'Akumulasi Amortisasi')[0]?.value || 0)) || 0 },
                            { label: 'Total Aset', value: 0
                            }
                        ];

                        let kreditNet = this.asetBp.find(item => item.label === 'Kredit (Net)');
                        let lancar = this.asetBp.find(item => item.label === 'Lancar');
                        let dalamPerhatianKhusus = this.asetBp.find(item => item.label === 'Dalam Perhatian Khusus');
                        
                        if (kreditNet && lancar && dalamPerhatianKhusus) {
                            kreditNet.value = lancar.value + dalamPerhatianKhusus.value;
                        } else {
                            console.log('Data tidak lengkap atau salah');
                        }

                        let totalAset = this.asetBp.find(item => item.label === 'Total Aset');
                        if (totalAset) {
                            totalAset.value = this.asetBp.slice(1).reduce((sum, item) => sum + (item.value || 0), 0) - (this.asetBp.find(item => item.label === 'Kredit (Net)')?.value || 0);
                        } else {
                            console.log('Total Aset tidak ditemukan');
                        }
                        
                        console.log('selisih BDL', this.selisishBp);

                        this.kewajibanBp = [
                            { label: 'LIABILITAS', value: 0, isSubheader: true },
                            { label: 'Insured Deposits', value: Insured.nominal },
                            { label: 'Kewajiban Repo', value: this.dataTableNeracaBank.kewajibanRepo },
                            { label: 'Kewajiban kepada BDL', value: this.selisishBp },
                            { label: 'Total Kewajiban', value: 0 },
                            { label: 'EKUITAS', value: 0, isSubheader: true },
                            { label: 'Modal KPMM', value: 0 },
                            { label: 'Total Ekuitas', value: 0 },
                            { label: 'Total Kewajiban dan Ekuitas', value: 0 }
                        ];
                        const asetDialihkan = this.posPengalihan.find(item => item.label === "Aset yang dialihkan")?.nominal ?? 0;
                        const kewajibanDialihkan = this.posPengalihan.find(item => item.label === "Kewajiban yang dialihkan")?.nominal ?? 0;

                        const kewajibanBdL = this.kewajibanBp.find(item => item.label === 'Kewajiban kepada BDL');
                        if (kewajibanBdL) {
                            kewajibanBdL.value = asetDialihkan - kewajibanDialihkan;
                        } else {
                            console.error("Kewajiban kepada BDL not found");
                        }

                        this.kewajibanBp[4].value = this.kewajibanBp[1].value + this.kewajibanBp[2].value + this.kewajibanBp[3].value;  
                        this.kewajibanBp[7].value = this.kewajibanBp[6].value;  
                        this.kewajibanBp[8].value = this.kewajibanBp[4].value + this.kewajibanBp[7].value;  

                        console.log("asset bank pemburukan insured", this.assetsBankAsalPemburukan);

                        this.asetBdl = [
                                { label: 'ASET', value: 0, isSubheader: true },
                                { label: 'Kas', value: 0 },
                                { label: 'Penempatan pada BI', value: 0 },
                                { label: 'Penempatan pada Bank Lain', value: 0 },
                                { label: 'Tagihan Spot dan Derivatif', value: this.assetsBankAsalPemburukanC.find(item => item.label === 'Tagihan Spot dan Derivatif')?.value || 0 },
                                { label: 'Surat Berharga', value: 0 },
                                { label: 'Surat Berharga (REPO)', value: 0 },
                                { label: 'Reverse Repo', value: (this.assetsBankAsalPemburukanC.find(item => item.label === 'Reverse Repo')?.value || 0) - (this.assetsBankAsalPemburukanC.find(item => item.label === 'Reverse Repo')?.value || 0) },
                                { label: 'Tagihan Akseptasi', value: this.assetsBankAsalPemburukanC.find(item => item.label === 'Tagihan Akseptasi')?.value || 0 },
                                { label: 'Tagihan kepada BB', value: this.kewajibanBp.find(item => item.label === 'Kewajiban kepada BDL')?.value || 0 },
                                { label: 'Total Kredit (Net)', value: 0 },
                                { label: 'Kredit Lancar', value: 0 },
                                { label: 'Kredit Dalam Perhatian Khusus', value: 0 },
                                { label: 'Kredit Kurang Lancar', value: (this.assetsBankAsalPemburukanC.find(item => item.label === 'Kredit Kol 3')?.value || 0 ) + (this.assetsBankAsalPemburukan.find(item => item.label === 'CKPN Kredit Kol 3 (-)')?.value || 0)},
                                { label: 'Kredit Diragukan', value: (this.assetsBankAsalPemburukanC.find(item => item.label === 'Kredit Kol 4')?.value || 0) + (this.assetsBankAsalPemburukan.find(item => item.label === 'CKPN Kredit Kol 4 (-)')?.value || 0) },
                                { label: 'Kredit Macet', value: (this.assetsBankAsalPemburukanC.find(item => item.label === 'Kredit Kol 5')?.value || 0) + (this.assetsBankAsalPemburukan.find(item => item.label === 'CKPN Kredit Kol 5 (-)')?.value || 0) },
                                { label: 'Aset Keuangan Lain', value: (this.assetsBankAsalPemburukanC.find(item => item.label === 'Aset Keuangan Lain')?.value || 0) + (this.assetsBankAsalPemburukanC.find(item => item.label === 'CKPN Aset Keuangan Lain (-)')?.value || 0) },
                                { label: 'CKPN Aset Keuangan Lainnya', value: 0 },
                                { label: 'Aset Tetap dan Inventaris-Net', value: 0 },
                                { label: 'Aset Tidak Berwujud-Net', value: (this.assetsBankAsalPemburukan.find(item => item.label === "Aset Tidak Berwujud")?.value || 0) + (this.assetsBankAsalPemburukan.find(item => item.label === "Akumulasi Amortisasi")?.value || 0) - (this.assetsBankAsalPemburukanC.find(item => item.label === 'Aset Tetap dan Inventaris-Net')?.value || 0)},
                                { label: 'Properti Terbengkalai-Net', value: this.assetsBankAsalPemburukanC.find(item => item.label === 'Properti Terbengkalai-Net')?.value || 0 },
                                { label: 'AYDA-Net', value: this.assetsBankAsalPemburukanC.find(item => item.label === 'AYDA')?.value || 0 },
                                { label: 'Aset Lainnya', value: this.assetsBankAsalPemburukanC.find(item => item.label === 'Aset Lainnya')?.value || 0 },
                                { label: 'Total Aset', value: 0
                                }
                              ];

                              let kreditLancar = this.asetBdl.find(item => item.label === 'Kredit Lancar');
                              let kreditDalamPerhatianKhusus = this.asetBdl.find(item => item.label === 'Kredit Dalam Perhatian Khusus');
                              let kreditKurangLancar = this.asetBdl.find(item => item.label === 'Kredit Kurang Lancar');
                              let kreditDiragukan = this.asetBdl.find(item => item.label === 'Kredit Diragukan');
                              let kreditMacet = this.asetBdl.find(item => item.label === 'Kredit Macet');
                              
                              // Memastikan elemen ditemukan, meskipun nilai bisa 0
                              if (kreditLancar !== undefined && kreditDalamPerhatianKhusus !== undefined && kreditKurangLancar !== undefined && kreditDiragukan !== undefined && kreditMacet !== undefined) {
                                  let totalKreditNet = kreditLancar.value + kreditDalamPerhatianKhusus.value + kreditKurangLancar.value + kreditDiragukan.value + kreditMacet.value;
                                
                                    console.log('Total Kredit (Net)', totalKreditNet);
                                    
                                  let totalKreditNetItem = this.asetBdl.find(item => item.label === 'Total Kredit (Net)');
                                  if (totalKreditNetItem) {
                                      totalKreditNetItem.value = totalKreditNet;
                                  }
                                
                                let totalAsetItem = this.asetBdl.find(item => item.label === 'Total Aset');
                                if (totalAsetItem) {
                                    totalAsetItem.value = this.asetBdl.slice(1).reduce((sum, item) => sum + (item.value || 0), 0) - totalKreditNet;
                                }
                            
                            } else {
                                console.log('Salah satu elemen tidak ditemukan');
                            }
                            

                                                      
                        this.kewajibanBdl = [
                                { label: 'LIABILITAS', value: 0, isSubheader: true },
                                { label: 'Uninsured Deposits', value: (this.liabilitiesEquityBankBp.find(item => item.label === 'Total Simpanan')?.value || 0) - (this.kewajibanBp.find(item => item.label === 'Insured Deposits')?.value || 0) },   
                                { label: 'Kewajiban pada Bank Lain', value: 0 },
                                { label: 'Kewajiban Spot dan Derivatif', value: this.liabilitiesEquityBankBp.find(item => item.label === 'Kewajiban Spot dan Derivatif')?.value || 0 },
                                { label: 'Kewajiban Repo', value: 0 },
                                { label: 'Kewajiban Akseptasi', value: this.liabilitiesEquityBankBp.find(item => item.label === 'Kewajiban Akseptasi')?.value || 0 },
                                { label: 'Surat Berharga yang Diterbitkan', value: this.liabilitiesEquityBankBp.find(item => item.label === 'Surat Berharga yang Diterbitkan')?.value || 0 },
                                { label: 'Pinjaman', value: this.liabilitiesEquityBankBp.find(item => item.label === 'Pinjaman')?.value || 0 },
                                { label: 'Setoran Jaminan', value: this.liabilitiesEquityBankBp.find(item => item.label === 'Setoran Jaminan')?.value || 0 },
                                { label: 'Kewajiban Lainnya', value: this.liabilitiesEquityBankBp.find(item => item.label === 'Kewajiban Lainnya')?.value || 0 },
                                { label: 'Total Kewajiban', value: 0 },
                                { label: 'EKUITAS', value: 0, isSubheader: true },
                                { label: 'Modal Disetor', value: 0 },
                                { label: 'Modal Dasar', value: this.liabilitiesEquityBankAsal.find(item => item.label === 'Modal Dasar')?.value || 0 },
                                { label: 'Modal yg Belum Disetor (-)', value: this.liabilitiesEquityBankAsal.find(item => item.label === 'Modal yg Belum Disetor (-)')?.value || 0 },
                                { label: 'Tambahan Modal Disetor', value: 0 },
                                { label: 'Agio', value: this.liabilitiesEquityBankAsal.find(item => item.label === 'Agio')?.value || 0 },
                                { label: 'Penghasilan Komprehensif Lain', value: this.liabilitiesEquityBankAsal.find(item => item.label === 'Penghasilan Komprehensif Lain')?.value || 0 },
                                { label: 'Dana Setoran Modal', value: this.liabilitiesEquityBankAsal.find(item => item.label === 'Dana Setoran Modal')?.value || 0 },
                                { label: 'Cadangan Umum', value: this.liabilitiesEquityBankAsal.find(item => item.label === 'Cadangan Umum')?.value || 0 },
                                { label: 'Laba (Rugi)', value: this.liabilitiesEquityBankAsal.find(item => item.label === 'Laba (Rugi)')?.value || 0 },
                                { label: 'Laba Tahun Lalu', value: this.liabilitiesEquityBankAsal.find(item => item.label === 'Laba Tahun Lalu')?.value || 0 },
                                { label: 'Laba Tahun Berjalan', value: this.liabilitiesEquityBankAsal.find(item => item.label === 'Laba Tahun Berjalan')?.value || 0 },
                                { label: 'Estimasi Kerugian', value: this.liabilitiesEquityBankBp.find(item => item.label === 'Estimasi Kerugian')?.value || 0 },
                                { label: 'Total Ekuitas', value: 0 },
                                { label: 'TOTAL KEWAJIBAN DAN EKUITAS', value: 0 },
                              ];
                        // Calculate total liabilities and ekuitas
                        this.kewajibanBdl[10].value = this.kewajibanBdl[1].value + this.kewajibanBdl[2].value + this.kewajibanBdl[3].value + this.kewajibanBdl[4].value + this.kewajibanBdl[5].value + this.kewajibanBdl[6].value + this.kewajibanBdl[7].value + this.kewajibanBdl[8].value + this.kewajibanBdl[9].value;
                        this.kewajibanBdl[24].value = this.kewajibanBdl[11].value + this.kewajibanBdl[12].value + this.kewajibanBdl[13].value + this.kewajibanBdl[14].value + this.kewajibanBdl[15].value + this.kewajibanBdl[16].value + this.kewajibanBdl[17].value + this.kewajibanBdl[18].value + this.kewajibanBdl[19].value + this.kewajibanBdl[20].value + this.kewajibanBdl[21].value + this.kewajibanBdl[22].value + this.kewajibanBdl[23].value;
                        this.kewajibanBdl[25].value = this.kewajibanBdl[10].value + this.kewajibanBdl[24].value;

                } else {
                    console.log('Label "Insured Deposit" not found in kewajibanAlih');
                }
            });
            this.loading = false;
        }
        
        const Repo = this.kewajibanAlih.find(item1 => item1.label === 'Kewajiban Repo');
        if (Repo) {
            Repo.nominal = this.dataTableNeracaBank.kewajibanRepo;
            console.log('Repo', Repo);
        } else {
            console.log('Label "Repo" not found in kewajibanAlih');
        }
        
        // if (this.dt1) {
        //   this.dt1.filter(event.value, 'periode_data', 'contains');  // Correct number of arguments
        // }
      }

      getTotalKewajibanAlih(field: 'nominal' | 'fv'): number {
        const hasil = this.kewajibanAlih.reduce((sum, item) => sum + (item[field] || 0), 0);
        return hasil;
    }

    getSelisihTotal(): number {
        const asetDialihkan = this.posPengalihan.find(item => item.label === "Aset yang dialihkan")?.nominal || 0;
        const kewajibanDialihkan = this.posPengalihan.find(item => item.label === "Kewajiban yang dialihkan")?.nominal || 0;
        const selisih = asetDialihkan - kewajibanDialihkan;
        const selisihItem = this.posPengalihan.find(item => item.label === "Selisih");
        if (selisihItem) {
            selisihItem.nominal = selisih;
        }

        this.selisishBp = selisih;
        
        return selisih;
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

    onRowExpand(event: any) {
        this.expandedRows[event.data.id] = true;
    }

    onRowCollapse(event: any) {
        delete this.expandedRows[event.data.id];
    }

    toggleRow(product: any) {
        if (this.expandedRows[product.id]) {
            delete this.expandedRows[product.id];
        } else {
            this.expandedRows[product.id] = true;
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
                this.getBankDataPeriodeScv(keyword);

                console.log('hasil search post', search);

                // this.components1.filter(item => item.deskripsi === 'B.1 Kategori 1' || item.deskripsi === 'B. 3 Kategori 3').forEach(item => {
                //     const foundItem = this.kewajibanAlih.find(item1 => item1.label === 'Insured Deposits');
                //     if (foundItem) {
                //         foundItem.nominal += item.jumlah_saldo_simpanan_dijamin || 0;
                //         console.log('foundItem', foundItem);
                //     } else {
                //         console.log('Label "Insured Deposit" not found in kewajibanAlih');
                //     }
                // });
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


    async getBankDataPeriodeScv(keyword: string) {
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
