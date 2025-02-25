import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class KreditService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllViewData(page: number, perPage: number) {
    try {
      const skip = (page - 1) * perPage;
      const take = perPage;
      const result = await this.prisma.$queryRaw`
      SELECT id_pelapor, periode_laporan, periode_data, nomor_rekening, jenis_kredit_pembiayaan, deskripsi_jenis_kredit_pembiayaan, baki_debet
      FROM 
        kredit_pembiayaan
      ORDER BY periode_data, deskripsi_jenis_kredit_pembiayaan
      OFFSET ${skip}
      LIMIT ${take};
    `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async findAllReportTotal() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT COUNT(*) AS total FROM kredit_pembiayaan;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async findAllReportData() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT * FROM view_get_data_time_result;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async findAllReportDataTotal() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT COUNT(*) AS total FROM kredit_pembiayaan;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }




  async findKeywordGeneralKredit(keyword: string, page: number, perPage: number) {
    console.log(keyword);
    const skip = (page - 1) * perPage;
    const take = perPage;
    try {
      const result = await this.prisma.$queryRaw`
        SELECT id_pelapor, periode_laporan, periode_data, nomor_rekening, jenis_kredit_pembiayaan, deskripsi_jenis_kredit_pembiayaan, baki_debet
        FROM kredit_pembiayaan
        WHERE LEFT(id_pelapor, 3) = ${keyword}
        ORDER BY periode_data, deskripsi_jenis_kredit_pembiayaan
          OFFSET ${skip}
          LIMIT ${take};
      ;
      `
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
    }
  }
  
  async findKeywordGeneralBankPeriode(keyword: string) {
    console.log(keyword);
    try {
      const result = await this.prisma.$queryRaw`
        SELECT DISTINCT periode_data
        FROM kredit_pembiayaan 
        WHERE id_pelapor LIKE ${keyword + '%'}
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Database query failed');
    }
  }
  
  


  async findKeywordGeneralLaba(keyword: string) {
    console.log(keyword);
    try {
      const result = await this.prisma.$queryRaw`
      SELECT DISTINCT ON (CAST("id" AS NUMERIC))
          "id_pelapor",
          "periode_laporan",
          "periode_data",
          CAST("id" AS NUMERIC) AS id_numeric, -- Ubah id menjadi numerik
          "pos_laba_rugi",
          "deskripsi_pos_laba_rugi",
          "cakupan_data",
          "deskripsi_cakupan_data",
          "nominal_penduduk_rupiah",
          "nominal_penduduk_valas",
          "nominal_penduduk_total",
          "nominal_bukan_penduduk_rupiah",
          "nominal_bukan_penduduk_valas",
          "nominal_bukan_penduduk_total",
          "nominal_rupiah",
          "nominal_valas",
          "nominal_total",
          "nominal_perusahaan_induk_penduduk_rupiah",
          "nominal_perusahaan_induk_penduduk_valas",
          "nominal_perusahaan_induk_bukan_penduduk_rupiah",
          "nominal_perusahaan_induk_bukan_penduduk_valas",
          "nominal_perusahaan_induk_total",
          "nominal_perusahaan_anak_sln_asuransi_penduduk_rupiah",
          "nominal_perusahaan_anak_sln_asuransi_penduduk_valas",
          "nominal_perusahaan_anak_sln_asuransi_bukan_penduduk_rupiah",
          "nominal_perusahaan_anak_sln_asuransi_bukan_penduduk_valas",
          "nominal_perusahaan_anak_asuransi_penduduk_rupiah",
          "nominal_perusahaan_anak_asuransi_penduduk_valas",
          "nominal_perusahaan_anak_asuransi_bukan_penduduk_rupiah",
          "nominal_perusahaan_anak_asuransi_bukan_penduduk_valas",
          "nominal_perusahaan_anak_total",
          "nominal_konsolidasi_penduduk_rupiah",
          "nominal_konsolidasi_penduduk_valas",
          "nominal_konsolidasi_bukan_penduduk_rupiah",
          "nominal_konsolidasi_bukan_penduduk_valas",
          "nominal_konsolidasi_total",
          "buk",
          "bus",
          "uus",
          "kategori",
          "uuid",
          "head",
          LEFT("id_pelapor", 3) AS id_pelapor_prefix,
          SUM(COALESCE("nominal_rupiah", 0)) OVER(PARTITION BY LEFT("id_pelapor", 3), CAST("id" AS NUMERIC)) AS total_nominal_rupiah,
          SUM(COALESCE("nominal_valas", 0)) OVER(PARTITION BY LEFT("id_pelapor", 3), CAST("id" AS NUMERIC)) AS total_nominal_valas,
          SUM(COALESCE("nominal_total", 0)) OVER(PARTITION BY LEFT("id_pelapor", 3), CAST("id" AS NUMERIC)) AS total_nominal_total
      FROM 
          laba_rugi
      WHERE 
          (
              LEFT("id_pelapor", 3) ILIKE ${`%${keyword}%`}
          )
          AND 
          ("head" = 'Header' OR ("buk" IS NOT NULL AND "buk" != ''))
      ORDER BY 
          id_numeric, -- Urutkan berdasarkan id_numeric
          "id_pelapor_prefix";`
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
    }
  }


  async createData(data: any) {
    console.log(data);
  
    let createdScv = null;
    console.log(data.data_scv);
  
    if (data.data_scv.nama_bank !== null && data.data_scv.nama_bank !== '') {
      try {
        const query = `
          INSERT INTO data_scv (
            tahun, bulan, kode_kepesertaan, nama_bank, deskripsi, jumlah_nasabah_penyimpan,
            jumlah_rekening_simpanan, jumlah_saldo_simpanan, jumlah_saldo_simpanan_dijamin,
            uninsured, insured
          ) VALUES (
            ${data.data_scv.tahun ?? 'NULL'},
            ${data.data_scv.bulan ?? 'NULL'},
            '${data.data_scv.kode_kepesertaan ?? ''}',
            '${data.data_scv.nama_bank ?? ''}',
            '${data.data_scv.deskripsi ?? ''}',
            ${data.data_scv.jumlah_nasabah_penyimpan ?? 'NULL'},
            ${data.data_scv.jumlah_rekening_simpanan ?? 'NULL'},
            ${data.data_scv.jumlah_saldo_simpanan ?? 'NULL'},
            ${data.data_scv.jumlah_saldo_simpanan_dijamin ?? 'NULL'},
            ${data.data_scv.uninsured ?? 'NULL'},
            ${data.data_scv.insured ?? 'NULL'}
          );
        `;
  
        // Execute raw query
        createdScv = await this.prisma.$queryRawUnsafe(query);
      } catch (error) {
        console.error('Failed to create SCV:', error.message);
      }
    }
  
    return {
      message: 'Data created successfully',
      data_scv: createdScv,
    };
  }
  

  async updateData(data: any) {
    console.log(data);
    try {
      const updatedNeracaBank = await this.prisma.neraca_bank.upsert({
        where: { uuid: data.neraca_bank.uuid }, 
        create: data.neraca_bank,
        update: data.neraca_bank,
      });

      return {
        message: 'Data updated successfully',
        neraca_bank: updatedNeracaBank,
      };
    } catch (error) {
      return { message: 'Failed to update data', error: error.message };
    }
  }

  async deleteData(data: any) {
    try {
      const deletedArcSwift = await this.prisma.arc_swift.delete({
        where: { equipment: data.arc_swift.equipment },
      });

      return {
        message: 'Data deleted successfully',
        arc_swift: deletedArcSwift,
      };
    } catch (error) {
      return { message: 'Failed to delete data', error: error.message };
    }
  }

  async getBank() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT DISTINCT LEFT("id_pelapor", 3) AS id_pelapor_prefix, NULL AS periode_data
      FROM neraca_bank
      UNION
      SELECT NULL AS id_pelapor_prefix, "periode_data"
      FROM neraca_bank;     `;
      return result;
    } catch (error) {
      throw new Error('Error executing custom query');
    }
  }

  async findDataOperator(keyword: any) {
    console.log(keyword);
    try {
      const result = await this.prisma.$queryRaw`
      SELECT distinct aircraft_reg
      FROM view_get_data_new
      WHERE operator= ${keyword}
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom Operator:', error);
    }
  }

  async importDataCsv(filePath: string) {
    const posixFilePath = filePath.split(path.sep).join('/');
    console.log('Importing CSV file:', posixFilePath);
  
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }
  
      const query = `
      COPY kredit_pembiayaan (
          id_pelapor,
          periode_laporan,
          periode_data,
          nomor_rekening,
          id_debitur,
          jenis_kredit_pembiayaan,
          deskripsi_jenis_kredit_pembiayaan,
          nomor_akad_awal,
          tanggal_akad_awal,
          nomor_akad_akhir,
          tanggal_akad_akhir,
          tanggal_awal,
          tanggal_mulai,
          tanggal_jatuh_tempo,
          kategori_usaha_debitur,
          deskripsi_kategori_usaha_debitur,
          kategori_portofolio,
          deskripsi_kategori_portofolio,
          skim_pembiayaan_syariah,
          deskripsi_skim_pembiayaan_syariah,
          jenis_akad,
          deskripsi_jenis_akad,
          karakteristik_sumber_dana,
          deskripsi_karakteristik_sumber_dana,
          sifat_investasi,
          deskripsi_sifat_investasi,
          metode_bagi_hasil,
          deskripsi_metode_bagi_hasil,
          persentase_nisbah,
          persentase_rbh_terhadap_pbh,
          sifat_kredit_pembiayaan,
          deskripsi_sifat_kredit_pembiayaan,
          jenis_penggunaan,
          deskripsi_jenis_penggunaan,
          orientasi_penggunaan,
          deskripsi_orientasi_penggunaan,
          jenis_valuta,
          deskripsi_jenis_valuta,
          klasifikasi_aset_keuangan,
          deskripsi_klasifikasi_aset_keuangan,
          kredit_program_pemerintah,
          deskripsi_kredit_program_pemerintah,
          sektor_kredit_usaha_rakyat,
          deskripsi_sektor_kredit_usaha_rakyat,
          sektor_ekonomi,
          deskripsi_sektor_ekonomi,
          lokasi_penggunaan,
          deskripsi_lokasi_penggunaan,
          jenis_aset,
          deskripsi_jenis_aset,
          waktu_perolehan_aset,
          jenis_valuta_aset,
          deskripsi_jenis_valuta_aset,
          harga_perolehan_aset,
          jumlah_periode_penyusutan_amortisasi,
          metode_penyusutan_amortisasi,
          deskripsi_metode_penyusutan_amortisasi,
          nilai_kontrak,
          periode_pembayaran_sewa,
          deskripsi_periode_pembayaran_sewa,
          nilai_sewa_perperiode,
          akumulasi_penyusutan_amortisasi,
          ckpn_aset_ijarah,
          uang_muka_ijarah,
          jenis_suku_bunga_imbalan,
          deskripsi_jenis_suku_bunga_imbalan,
          persentase_imbalan_awal_kontrak,
          suku_bunga_persentase_imbalan_bulan_laporan,
          kualitas,
          deskripsi_kualitas,
          plafon_awal,
          plafon,
          saldo_harga_pokok,
          saldo_margin_ditangguhkan,
          baki_debet,
          realisasi_pencairan_bulan_berjalan,
          pendapatan_bunga_imbalan_yang_akan_diterima,
          jumlah,
          kelonggaran_tarik_committed,
          kelonggaran_tarik_uncommitted,
          nilai_agunan_yang_dapat_diperhitungkan_kredit,
          nilai_agunan_yang_dapat_diperhitungkan_kelonggaran_tarik,
          cadangan_kerugian_penurunan_nilai_aset_baik,
          cadangan_kerugian_penurunan_nilai_aset_kurang_baik,
          cadangan_kerugian_penurunan_nilai_aset_tidak_baik,
          tunggakan_pokok,
          tunggakan_margin_imbalan,
          jumlah_hari_tunggakan,
          jumlah_hari_tunggakan_pokok,
          jumlah_hari_tunggakan_bagi_hasil
      )
      FROM '${posixFilePath}'
      DELIMITER '|' 
      CSV HEADER 
      ENCODING 'UTF8';
    `;
  
      console.log('Executing Query:', query);
  
      const result = await this.prisma.$executeRawUnsafe(query);
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error.message);
      throw new Error('Failed to import CSV');
    }
  }
  
  async getDataSummary(table: string, period: string) {
    console.log("periode", period);
    try {
      const result = await this.prisma.$queryRaw`
        SELECT 
            kualitas, 
            CASE 
                WHEN CAST(sifat_kredit_pembiayaan AS TEXT) IN ('1', '5') THEN 'Restru'
                WHEN CAST(sifat_kredit_pembiayaan AS TEXT) IN ('2', '9') THEN 'Normal'
                ELSE 'Lainnya'
            END AS kategori,
            CONCAT(kualitas, '-', 
                  CASE 
                      WHEN CAST(sifat_kredit_pembiayaan AS TEXT) IN ('1', '5') THEN 'Restru'
                      WHEN CAST(sifat_kredit_pembiayaan AS TEXT) IN ('2', '9') THEN 'Normal'
                      ELSE 'Lainnya'
                  END) AS id_unik,
            SUM(baki_debet) AS total_baki_debet
        FROM kredit_pembiayaan
        WHERE kualitas IN ('1', '2', '3', '4', '5')
          AND LEFT(id_pelapor, 3) = ${table}
          AND LEFT(periode_data, 7) = ${period}
        GROUP BY kualitas, kategori, id_unik
        ORDER BY kualitas, kategori;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Failed to fetch data summary');
    }
  }

  async getDataSummaryGeneral(table: string) {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT 
            kualitas, 
            CASE 
                WHEN CAST(sifat_kredit_pembiayaan AS TEXT) IN ('1', '5') THEN 'Restru'
                WHEN CAST(sifat_kredit_pembiayaan AS TEXT) IN ('2', '9') THEN 'Normal'
                ELSE 'Lainnya'
            END AS kategori,
            CONCAT(kualitas, '-', 
                  CASE 
                      WHEN CAST(sifat_kredit_pembiayaan AS TEXT) IN ('1', '5') THEN 'Restru'
                      WHEN CAST(sifat_kredit_pembiayaan AS TEXT) IN ('2', '9') THEN 'Normal'
                      ELSE 'Lainnya'
                  END) AS id_unik,
            SUM(baki_debet) AS total_baki_debet,
            periode_data
        FROM kredit_pembiayaan
        WHERE kualitas IN ('1', '2', '3', '4', '5')
          AND LEFT(id_pelapor, 3) = ${table}  
        GROUP BY kualitas, kategori, id_unik, periode_data
        ORDER BY kualitas, kategori, periode_data;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Failed to fetch data summary');
    }
  }

  async importDataCsvNeraca(filePath: string) {
    const posixFilePath = filePath.split(path.sep).join('/');
    console.log('Importing CSV file:', posixFilePath);
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }
      
      const query = `
          COPY neraca_bank_edit  (
            id_pelapor,
            periode_laporan,
            periode_data,
            id,
            pos_laporan_keuangan,
            deskripsi_pos_laporan_keuangan,
            cakupan_data,
            deskripsi_cakupan_data,
            nominal_rupiah,
            nominal_valas,
            nominal_valas_usd,
            nominal_valas_non_usd,
            nominal_total,
            nominal_perusahaan_induk_rupiah,
            nominal_perusahaan_induk_valas,
            nominal_perusahaan_induk_total,
            nominal_perusahaan_anak_selain_asuransi_rupiah,
            nominal_perusahaan_anak_selain_asuransi_valas,
            nominal_perusahaan_anak_selain_asuransi_total,
            nominal_perusahaan_anak_asuransi_rupiah,
            nominal_perusahaan_anak_asuransi_valas,
            nominal_perusahaan_anak_asuransi_total,
            nominal_konsolidasi_rupiah,
            nominal_konsolidasi_valas,
            nominal_konsolidasi_total
          )
          FROM '${posixFilePath}' 
          DELIMITER '|'
          CSV HEADER;
      `;
      console.log('Executing Query:', query);

      const result = await this.prisma.$executeRawUnsafe(query);
      
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Failed to import CSV');
    }
  }


  async findErrorData() {
    try {
      const result = this.prisma.$queryRaw`
      SELECT
          (COALESCE(COUNT(t1.id_pelapor), 0) + COALESCE(COUNT(t2.id_pelapor), 0)) AS total_baris
      FROM
          (SELECT id_pelapor FROM neraca_bank WHERE id_pelapor IS NULL) t1
      FULL OUTER JOIN
          (SELECT id_pelapor FROM laba_rugi WHERE id_pelapor IS NULL) t2
      ON 1=1;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async findIndividualData(keyword: string) {
    console.log(`Keyword: ${keyword}`);
    try {
      const result = await this.prisma.$queryRaw`
  WITH filtered_neraca AS (
    SELECT
      id_pelapor,
      TO_CHAR(TO_DATE(periode_data, 'YYYY-MM-DD'), 'YYYY-MM-DD') AS formatted_month,
      id,
      buk
    FROM
      neraca_bank
    WHERE
      LEFT(id_pelapor, 3) = ${keyword}
      AND buk IS NOT NULL
      AND buk != ''
  ),
  filtered_laba AS (
    SELECT
      id_pelapor,
      TO_CHAR(TO_DATE(periode_data, 'YYYY-MM-DD'), 'YYYY-MM-DD') AS formatted_month,
      id,
      buk
    FROM
      laba_rugi
    WHERE
      LEFT(id_pelapor, 3) = ${keyword}
      AND buk IS NOT NULL
      AND buk != ''
  )
  SELECT
    COALESCE(n.formatted_month, l.formatted_month) AS formatted_month,
    COUNT(DISTINCT n.id) AS total_neraca,
    COUNT(DISTINCT l.id) AS total_laba
  FROM
    filtered_neraca n
  FULL OUTER JOIN
    filtered_laba l
  ON
    n.id_pelapor = l.id_pelapor
  GROUP BY
    COALESCE(n.formatted_month, l.formatted_month)
  ORDER BY
    formatted_month;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Failed to fetch individual data.');
    }
  }

}
