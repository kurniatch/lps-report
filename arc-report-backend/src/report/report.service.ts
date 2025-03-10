import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import checkDiskSpace from 'check-disk-space';
import * as os from 'os';
import * as osUtils from 'os-utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllViewData(page: number, perPage: number) {
    try {
      const skip = (page - 1) * perPage;
      const take = perPage;
      const result = await this.prisma.$queryRaw`
    SELECT DISTINCT ON (CAST("id" AS NUMERIC)) 
        "id_pelapor",
        "periode_laporan",
        "periode_data",
        CAST("id" AS NUMERIC) AS id_numeric, -- Ubah id menjadi numerik
        "pos_laporan_keuangan",
        "deskripsi_pos_laporan_keuangan",
        "cakupan_data",
        "deskripsi_cakupan_data",
        "nominal_rupiah",
        "nominal_valas",
        "nominal_valas_usd",
        "nominal_valas_non_usd",
        "nominal_total",
        "nominal_perusahaan_induk_rupiah",
        "nominal_perusahaan_induk_valas",
        "nominal_perusahaan_induk_total",
        "nominal_perusahaan_anak_selain_asuransi_rupiah",
        "nominal_perusahaan_anak_selain_asuransi_valas",
        "nominal_perusahaan_anak_selain_asuransi_total",
        "nominal_perusahaan_anak_asuransi_rupiah",
        "nominal_perusahaan_anak_asuransi_valas",
        "nominal_perusahaan_anak_asuransi_total",
        "nominal_konsolidasi_rupiah",
        "nominal_konsolidasi_valas",
        "nominal_konsolidasi_total",
        "buk",
        "bus",
        "uus",
        "kategori",
        "uuid",
        "head",
        LEFT("id_pelapor", 3) AS id_pelapor_prefix,
        SUM(COALESCE("nominal_rupiah", 0)) OVER(PARTITION BY LEFT("id_pelapor", 3), "id") AS total_nominal_rupiah,
        SUM(COALESCE("nominal_valas", 0)) OVER(PARTITION BY LEFT("id_pelapor", 3), "id") AS total_nominal_valas,
        SUM(COALESCE("nominal_total", 0)) OVER(PARTITION BY LEFT("id_pelapor", 3), "id") AS total_nominal_total
    FROM 
        neraca_bank
    WHERE 
        "head" = 'Header' OR "buk" IS NOT NULL AND "buk" != ''
    ORDER BY 
        id_numeric, -- Urutkan berdasarkan id_numeric
        CAST("id" AS NUMERIC)
    OFFSET ${skip}
    LIMIT ${take};

    `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  

  async findAllViewDataLaba(page: number, perPage: number) {
    try {
      const skip = (page - 1) * perPage;
      const take = perPage;
      const result = await this.prisma.$queryRaw`
      SELECT 
          "id_pelapor",
          "periode_laporan",
          "periode_data",
          "id",
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
          SUM(COALESCE("nominal_rupiah", 0)) OVER(PARTITION BY LEFT("id_pelapor", 3), "id") AS total_nominal_rupiah,
          SUM(COALESCE("nominal_valas", 0)) OVER(PARTITION BY LEFT("id_pelapor", 3), "id") AS total_nominal_valas,
          SUM(COALESCE("nominal_total", 0)) OVER(PARTITION BY LEFT("id_pelapor", 3), "id") AS total_nominal_total
      FROM 
          laba_rugi
      WHERE 
          "head" = 'Header' OR "buk" IS NOT NULL AND "buk" != ''
      ORDER BY 
          "id_pelapor",
          CAST("id" AS NUMERIC)
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
        SELECT 
          (SELECT COUNT(*) FROM neraca_bank) AS total_neraca_bank,
          (SELECT COUNT(*) FROM laba_rugi) AS total_laba_rugi,
          (SELECT COUNT(*) FROM data_scv) AS total_scv,
          (SELECT COUNT(*) FROM kredit_pembiayaan) AS total_kredit,
          (SELECT COUNT(*) FROM nama_bank) AS total_bank;

      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  findCheckData(){
    try {
      const result = this.prisma.$queryRaw`
        SELECT
            kode AS id_pelapor,
            nama AS nama_bank,
            MAX(CASE WHEN source_table = 'neraca_bank' THEN 'Yes' ELSE 'No' END) AS found_in_neraca_bank,
            MAX(CASE WHEN source_table = 'data_scv' THEN 'Yes' ELSE 'No' END) AS found_in_data_scv,
            MAX(CASE WHEN source_table = 'kredit_pembiayaan' THEN 'Yes' ELSE 'No' END) AS found_in_kredit_pembiayaan,
            MAX(CASE WHEN source_table = 'laba_rugi' THEN 'Yes' ELSE 'No' END) AS found_in_laba_rugi,
            (
                CASE WHEN MAX(CASE WHEN source_table = 'neraca_bank' THEN 'Yes' ELSE 'No' END) = 'Yes' THEN 1 ELSE 0 END
                + CASE WHEN MAX(CASE WHEN source_table = 'data_scv' THEN 'Yes' ELSE 'No' END) = 'Yes' THEN 1 ELSE 0 END
                + CASE WHEN MAX(CASE WHEN source_table = 'kredit_pembiayaan' THEN 'Yes' ELSE 'No' END) = 'Yes' THEN 1 ELSE 0 END
                + CASE WHEN MAX(CASE WHEN source_table = 'laba_rugi' THEN 'Yes' ELSE 'No' END) = 'Yes' THEN 1 ELSE 0 END
            ) AS completeness_score
        FROM (
            SELECT DISTINCT LEFT(id_pelapor, 3) AS id_pelapor, 'neraca_bank' AS source_table
            FROM neraca_bank
            UNION
            SELECT DISTINCT LEFT(nama_bank, 3) AS id_pelapor, 'data_scv' AS source_table
            FROM data_scv
            UNION
            SELECT DISTINCT LEFT(id_pelapor, 3) AS id_pelapor, 'kredit_pembiayaan' AS source_table
            FROM kredit_pembiayaan
            UNION
            SELECT DISTINCT LEFT(id_pelapor, 3) AS id_pelapor, 'laba_rugi' AS source_table
            FROM laba_rugi
        ) AS combined
        RIGHT JOIN nama_bank nb ON nb.kode = combined.id_pelapor
        GROUP BY kode
        ORDER BY completeness_score DESC, kode;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  findCheckDataPeriod(period: string) {
    try {
        const result = this.prisma.$queryRaw`
            SELECT
                kode AS id_pelapor,
                nama AS nama_bank,
                MAX(CASE WHEN source_table = 'neraca_bank' THEN 'Yes' ELSE 'No' END) AS found_in_neraca_bank,
                MAX(CASE WHEN source_table = 'data_scv' THEN 'Yes' ELSE 'No' END) AS found_in_data_scv,
                MAX(CASE WHEN source_table = 'kredit_pembiayaan' THEN 'Yes' ELSE 'No' END) AS found_in_kredit_pembiayaan,
                MAX(CASE WHEN source_table = 'laba_rugi' THEN 'Yes' ELSE 'No' END) AS found_in_laba_rugi,
                (
                    CASE WHEN MAX(CASE WHEN source_table = 'neraca_bank' THEN 'Yes' ELSE 'No' END) = 'Yes' THEN 1 ELSE 0 END
                    + CASE WHEN MAX(CASE WHEN source_table = 'data_scv' THEN 'Yes' ELSE 'No' END) = 'Yes' THEN 1 ELSE 0 END
                    + CASE WHEN MAX(CASE WHEN source_table = 'kredit_pembiayaan' THEN 'Yes' ELSE 'No' END) = 'Yes' THEN 1 ELSE 0 END
                    + CASE WHEN MAX(CASE WHEN source_table = 'laba_rugi' THEN 'Yes' ELSE 'No' END) = 'Yes' THEN 1 ELSE 0 END
                ) AS completeness_score
            FROM (
                SELECT DISTINCT LEFT(id_pelapor, 3) AS id_pelapor, 'neraca_bank' AS source_table
                FROM neraca_bank
                WHERE LEFT ("periode_data", 7) = ${period}
                UNION
                SELECT DISTINCT LEFT(nama_bank, 3) AS id_pelapor, 'data_scv' AS source_table
                FROM data_scv
                WHERE CONCAT(tahun, '-', LPAD(bulan::TEXT, 2, '0')) = ${period}
                UNION
                SELECT DISTINCT LEFT(id_pelapor, 3) AS id_pelapor, 'kredit_pembiayaan' AS source_table
                FROM kredit_pembiayaan
                WHERE LEFT ("periode_data", 7) = ${period}
                UNION
                SELECT DISTINCT LEFT(id_pelapor, 3) AS id_pelapor, 'laba_rugi' AS source_table
                FROM laba_rugi
                WHERE LEFT ("periode_data", 7) = ${period}
            ) AS combined
            RIGHT JOIN nama_bank nb ON nb.kode = combined.id_pelapor
            GROUP BY kode
            ORDER BY completeness_score DESC, kode;
        `;

        return result;
    } catch (error) {
        console.error("Error fetching check data:", error);
        throw error;
    }
}


  async findAllReportDataTotal() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT COUNT(*) AS total FROM neraca_bank;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }


  async findKeywordGeneralBank(keyword: string, kategori: string) {
    console.log(keyword);
    console.log(kategori);
  
    // Validasi nama kolom untuk mencegah SQL Injection
    const validColumns = [
      "buk",
      "bus",
      "uus"
    ];
  
    if (!validColumns.includes(kategori)) {
      throw new Error(`Invalid column name: ${kategori}`);
    }
  
    const rawQuery = Prisma.sql`
      SELECT DISTINCT ON (CAST("id" AS NUMERIC)) 
          "id_pelapor",
          "periode_laporan",
          "periode_data",
          CAST("id" AS NUMERIC) AS id_numeric, -- Ubah id menjadi numerik
          "pos_laporan_keuangan",
          "deskripsi_pos_laporan_keuangan",
          "cakupan_data",
          "deskripsi_cakupan_data",
          "nominal_rupiah",
          "nominal_valas",
          "nominal_valas_usd",
          "nominal_valas_non_usd",
          "nominal_total",
          "nominal_perusahaan_induk_rupiah",
          "nominal_perusahaan_induk_valas",
          "nominal_perusahaan_induk_total",
          "nominal_perusahaan_anak_selain_asuransi_rupiah",
          "nominal_perusahaan_anak_selain_asuransi_valas",
          "nominal_perusahaan_anak_selain_asuransi_total",
          "nominal_perusahaan_anak_asuransi_rupiah",
          "nominal_perusahaan_anak_asuransi_valas",
          "nominal_perusahaan_anak_asuransi_total",
          "nominal_konsolidasi_rupiah",
          "nominal_konsolidasi_valas",
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
          neraca_bank
      WHERE 
          (
              LEFT("id_pelapor", 3) ILIKE ${`%${keyword}%`}
          )
          AND 
          ("head" = 'Header' OR ("${Prisma.raw(kategori)}" IS NOT NULL AND "${Prisma.raw(kategori)}" != ''))
      ORDER BY 
          id_numeric, 
          "id_pelapor_prefix";
    `;
  
    try {
      const result = await this.prisma.$queryRaw(rawQuery);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  

  async findKeywordGeneralBankPeriode(keyword: string, periode: string) {
    console.log(keyword);
    try {
        const result = await this.prisma.$queryRaw`
    SELECT * 
    FROM neraca_bank
    WHERE 
        (
            "id_pelapor" ILIKE ${`%${keyword}%`} OR
            "periode_laporan" ILIKE ${`%${keyword}%`} OR
            "periode_data" ILIKE ${`%${keyword}%`} OR
            "id" ILIKE ${`%${keyword}%`} OR
            "pos_laporan_keuangan" ILIKE ${`%${keyword}%`} OR
            "deskripsi_pos_laporan_keuangan" ILIKE ${`%${keyword}%`} OR
            "cakupan_data" ILIKE ${`%${keyword}%`} OR
            "deskripsi_cakupan_data" ILIKE ${`%${keyword}%`} OR
            "buk" ILIKE ${`%${keyword}%`} OR
            "bus" ILIKE ${`%${keyword}%`} OR
            "uus" ILIKE ${`%${keyword}%`} OR
            "kategori" ILIKE ${`%${keyword}%`}
        )
        AND 
        ("head" = 'Header' OR ("buk" IS NOT NULL AND "buk" != ''))
        AND 
        "periode_data" = ${periode}
    ORDER BY 
        "id_pelapor",
        CAST("id" AS NUMERIC);`
        return result;
    } catch (error) {
        console.error('Error executing custom query:', error);
    }
}


  async findKeywordGeneralLaba(keyword: string, kategori: string) {

    // Validasi nama kolom untuk mencegah SQL Injection
    const validColumns = [
      "buk",
      "bus",
      "uus"
    ];
      
    if (!validColumns.includes(kategori)) {
      throw new Error(`Invalid column name: ${kategori}`);
    }

    console.log(keyword);
    const rawQuery = Prisma.sql`
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
        ("head" = 'Header' OR ("${Prisma.raw(kategori)}" IS NOT NULL AND "${Prisma.raw(kategori)}" != ''))
    ORDER BY 
        id_numeric, 
        "id_pelapor_prefix";`
        
    try {
      const result = await this.prisma.$queryRaw(rawQuery);
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
    }
  }
  
  

  async findKeywordGeneral(keyword: string) {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT *
        FROM view_get_data_new
        WHERE material_description LIKE '%' || ${keyword} || '%'
           OR aircraft_reg LIKE '%' || ${keyword} || '%'
           OR doc_no LIKE '%' || ${keyword} || '%'
           OR equipment LIKE '%' || ${keyword} || '%'
           OR material_number LIKE '%' || ${keyword} || '%'
           OR serial_number LIKE '%' || ${keyword} || '%'
           OR doc_locations LIKE '%' || ${keyword} || '%'
           OR doc_box LIKE '%' || ${keyword} || '%'
           OR title LIKE '%' || ${keyword} || '%'
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
    }
  }


  async createData(data: any) {
    console.log(data);

    let createdNeracaBank = null;
    console.log(data.neraca_bank.id_pelapor);

    if (data.neraca_bank.id_pelapor !== null && data.neraca_bank.id_pelapor !== '') {
      console.log('dioc no skip');
      try {
        createdNeracaBank = await this.prisma.neraca_bank.create({
          data: data.neraca_bank,
        });
      } catch (neracaBankError) {
        console.error('Failed to create docfile:', neracaBankError.message);
      }
    }
    return {
      message: 'Data created successfully',
      neraca_bank: createdNeracaBank,
    };
  }

  async createDataLaba(data: any) {
    console.log(data);
  
    let createdLabaRugi = null;
  
    if (data.laba_rugi.id_pelapor !== null && data.laba_rugi.id_pelapor !== '') {
      try {
        const query = `
          INSERT INTO laba_rugi (
            id_pelapor, periode_laporan, periode_data, id, pos_laba_rugi, deskripsi_pos_laba_rugi,
            cakupan_data, deskripsi_cakupan_data, nominal_penduduk_rupiah, nominal_penduduk_valas, nominal_penduduk_total,
            nominal_bukan_penduduk_rupiah, nominal_bukan_penduduk_valas, nominal_bukan_penduduk_total,
            nominal_rupiah, nominal_valas, nominal_total,
            nominal_perusahaan_induk_penduduk_rupiah, nominal_perusahaan_induk_penduduk_valas,
            nominal_perusahaan_induk_bukan_penduduk_rupiah, nominal_perusahaan_induk_bukan_penduduk_valas,
            nominal_perusahaan_induk_total, nominal_perusahaan_anak_sln_asuransi_penduduk_rupiah,
            nominal_perusahaan_anak_sln_asuransi_penduduk_valas, nominal_perusahaan_anak_sln_asuransi_bukan_penduduk_rupiah,
            nominal_perusahaan_anak_sln_asuransi_bukan_penduduk_valas, nominal_perusahaan_anak_asuransi_penduduk_rupiah,
            nominal_perusahaan_anak_asuransi_penduduk_valas, nominal_perusahaan_anak_asuransi_bukan_penduduk_rupiah,
            nominal_perusahaan_anak_asuransi_bukan_penduduk_valas, nominal_perusahaan_anak_total,
            nominal_konsolidasi_penduduk_rupiah, nominal_konsolidasi_penduduk_valas,
            nominal_konsolidasi_bukan_penduduk_rupiah, nominal_konsolidasi_bukan_penduduk_valas,
            nominal_konsolidasi_total, buk, bus, uus, kategori, head
          ) VALUES (
            '${data.laba_rugi.id_pelapor ?? ''}',
            '${data.laba_rugi.periode_laporan ?? ''}',
            '${data.laba_rugi.periode_data ?? ''}',
            '${data.laba_rugi.id ?? ''}',
            '${data.laba_rugi.pos_laba_rugi ?? ''}',
            '${data.laba_rugi.deskripsi_pos_laba_rugi ?? ''}',
            '${data.laba_rugi.cakupan_data ?? ''}',
            '${data.laba_rugi.deskripsi_cakupan_data ?? ''}',
            ${data.laba_rugi.nominal_penduduk_rupiah ?? 'NULL'},
            ${data.laba_rugi.nominal_penduduk_valas ?? 'NULL'},
            ${data.laba_rugi.nominal_penduduk_total ?? 'NULL'},
            ${data.laba_rugi.nominal_bukan_penduduk_rupiah ?? 'NULL'},
            ${data.laba_rugi.nominal_bukan_penduduk_valas ?? 'NULL'},
            ${data.laba_rugi.nominal_bukan_penduduk_total ?? 'NULL'},
            ${data.laba_rugi.nominal_rupiah ?? 'NULL'},
            ${data.laba_rugi.nominal_valas ?? 'NULL'},
            ${data.laba_rugi.nominal_total ?? 'NULL'},
            ${data.laba_rugi.nominal_perusahaan_induk_penduduk_rupiah ?? 'NULL'},
            ${data.laba_rugi.nominal_perusahaan_induk_penduduk_valas ?? 'NULL'},
            ${data.laba_rugi.nominal_perusahaan_induk_bukan_penduduk_rupiah ?? 'NULL'},
            ${data.laba_rugi.nominal_perusahaan_induk_bukan_penduduk_valas ?? 'NULL'},
            ${data.laba_rugi.nominal_perusahaan_induk_total ?? 'NULL'},
            ${data.laba_rugi.nominal_perusahaan_anak_sln_asuransi_penduduk_rupiah ?? 'NULL'},
            ${data.laba_rugi.nominal_perusahaan_anak_sln_asuransi_penduduk_valas ?? 'NULL'},
            ${data.laba_rugi.nominal_perusahaan_anak_sln_asuransi_bukan_penduduk_rupiah ?? 'NULL'},
            ${data.laba_rugi.nominal_perusahaan_anak_sln_asuransi_bukan_penduduk_valas ?? 'NULL'},
            ${data.laba_rugi.nominal_perusahaan_anak_asuransi_penduduk_rupiah ?? 'NULL'},
            ${data.laba_rugi.nominal_perusahaan_anak_asuransi_penduduk_valas ?? 'NULL'},
            ${data.laba_rugi.nominal_perusahaan_anak_asuransi_bukan_penduduk_rupiah ?? 'NULL'},
            ${data.laba_rugi.nominal_perusahaan_anak_asuransi_bukan_penduduk_valas ?? 'NULL'},
            ${data.laba_rugi.nominal_perusahaan_anak_total ?? 'NULL'},
            ${data.laba_rugi.nominal_konsolidasi_penduduk_rupiah ?? 'NULL'},
            ${data.laba_rugi.nominal_konsolidasi_penduduk_valas ?? 'NULL'},
            ${data.laba_rugi.nominal_konsolidasi_bukan_penduduk_rupiah ?? 'NULL'},
            ${data.laba_rugi.nominal_konsolidasi_bukan_penduduk_valas ?? 'NULL'},
            ${data.laba_rugi.nominal_konsolidasi_total ?? 'NULL'},
            '${data.laba_rugi.buk ?? ''}',
            '${data.laba_rugi.bus ?? ''}',
            '${data.laba_rugi.uus ?? ''}',
            '${data.laba_rugi.kategori ?? ''}',
            '${data.laba_rugi.head ?? ''}'
          )
          RETURNING *;
        `;
  
        // Execute the raw SQL query
        createdLabaRugi = await this.prisma.$queryRawUnsafe(query);
      } catch (error) {
        console.error('Failed to create laba_rugi:', error.message);
      }
    }
  
    return {
      message: 'Data created successfully',
      neraca_bank: createdLabaRugi,
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

  async getAircraftReg() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT DISTINCT aircraft_reg FROM view_get_data_new;
      `;
      return result;
    } catch (error) {
      throw new Error('Error executing custom query');
    }
  }

  async getOperator() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT DISTINCT operator FROM view_get_data_new;
      `;
      return result;
    } catch (error) {
      throw new Error('Error executing custom query');
    }
  }

  async getBank() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT DISTINCT kode AS id_pelapor_prefix, nama, kategori
      FROM nama_bank;     `;
      return result;
    } catch (error) {
      throw new Error('Error executing custom query');
    }
  }

  async getLabaRugi() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT DISTINCT kode AS id_pelapor_prefix, nama, kategori
      FROM nama_bank;     
      `;
      return result;
    } catch (error) {
      throw new Error('Error executing custom query');
    }
  }

  async getBankPeriode() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT DISTINCT LEFT("id_pelapor", 3) AS id_pelapor_prefix, NULL AS periode_data
        FROM neraca_bank
        UNION
        SELECT NULL AS id_pelapor_prefix, "periode_data"
        FROM neraca_bank   `;
      return result;
    } catch (error) {
      throw new Error('Error executing custom query');
    }
  }

  async getLabaRugiPeriode() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT DISTINCT LEFT("id_pelapor", 3) AS id_pelapor_prefix, NULL AS periode_data
        FROM laba_rugi
        UNION
        SELECT NULL AS id_pelapor_prefix, "periode_data"
        FROM laba_rugi   `;
      return result;
    } catch (error) {
      throw new Error('Error executing custom query');
    }
  }


  async createOldComponent(data) {
    try {
      const bodyData = JSON.parse(data.body);

      const newComponent = await this.prisma.old_component.create({
        data: {
          identified: bodyData.identified,
          aircraft_reg: bodyData.aircraft_reg,
          ac_type: bodyData.ac_type,
          operator: bodyData.operator,
        },
      });

      return newComponent;
    } catch (error) {
      throw new Error(`Error creating old component: ${error.message}`);
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
          COPY laba_rugi  (
            id_pelapor,
            periode_laporan,
            periode_data,
            id,
            pos_laba_rugi,
            deskripsi_pos_laba_rugi,
            cakupan_data,
            deskripsi_cakupan_data,
            nominal_penduduk_rupiah,
            nominal_penduduk_valas,
            nominal_penduduk_total,
            nominal_bukan_penduduk_rupiah,
            nominal_bukan_penduduk_valas,
            nominal_bukan_penduduk_total,
            nominal_rupiah,
            nominal_valas,
            nominal_total,
            nominal_perusahaan_induk_penduduk_rupiah,
            nominal_perusahaan_induk_penduduk_valas,
            nominal_perusahaan_induk_bukan_penduduk_rupiah,
            nominal_perusahaan_induk_bukan_penduduk_valas,
            nominal_perusahaan_induk_total,
            nominal_perusahaan_anak_sln_asuransi_penduduk_rupiah,
            nominal_perusahaan_anak_sln_asuransi_penduduk_valas,
            nominal_perusahaan_anak_sln_asuransi_bukan_penduduk_rupiah,
            nominal_perusahaan_anak_sln_asuransi_bukan_penduduk_valas,
            nominal_perusahaan_anak_asuransi_penduduk_rupiah,
            nominal_perusahaan_anak_asuransi_penduduk_valas,
            nominal_perusahaan_anak_asuransi_bukan_penduduk_rupiah,
            nominal_perusahaan_anak_asuransi_bukan_penduduk_valas,
            nominal_perusahaan_anak_total,
            nominal_konsolidasi_penduduk_rupiah,
            nominal_konsolidasi_penduduk_valas,
            nominal_konsolidasi_bukan_penduduk_rupiah,
            nominal_konsolidasi_bukan_penduduk_valas,
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
    

  async importDataCsvNeraca(filePath: string) {
    const posixFilePath = filePath.split(path.sep).join('/');
    console.log('Importing CSV file:', posixFilePath);
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }
      
      const query = `
          COPY neraca_bank  (
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

  async getServerStatus() {
    try {
      const pathRoot = process.platform === 'win32' ? 'C:\\' : '/';

      const diskInfo = await this.getDiskUsage(pathRoot);
      const totalDisk = diskInfo.size;
      const freeDisk = diskInfo.free;
      const usedDisk = totalDisk - freeDisk;
      const storageUsage = Number(((usedDisk / totalDisk) * 100).toFixed(2));

      const cpuUsage = await this.getCpuUsage();

      const memoryUsage = this.getMemoryUsage();

      return {
        storageUsage,
        cpuUsage,
        memoryUsage,
      };
    } catch (error) {
      console.error('Error fetching server status:', error);
      throw new InternalServerErrorException('Failed to fetch server status');
    }
  }

  private async getDiskUsage(pathRoot: string): Promise<{ size: number; free: number }> {
    try {
      const diskSpace = await checkDiskSpace(pathRoot);
      return {
        size: diskSpace.size,
        free: diskSpace.free,
      };
    } catch (error) {
      console.error('Error fetching disk usage:', error);
      throw new InternalServerErrorException('Failed to fetch disk usage');
    }
  }

  private getMemoryUsage(): number {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryUsage = (usedMem / totalMem) * 100;
    return Number(memoryUsage.toFixed(2));
  }

  private getCpuUsage(): Promise<number> {
    return new Promise((resolve, reject) => {
      osUtils.cpuUsage((v: number) => {
        const cpuUsage = v * 100;
        resolve(Number(cpuUsage.toFixed(2)));
      });
    });
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
  
  async getDataLct(keyword: string, tableName: string) {
    console.log(`Keyword: ${keyword}`);
    console.log(`Table Name: ${tableName}`);
  
    try {
      const tableNames = ['neraca_bank', 'laba_rugi'];
      if (!tableNames.includes(tableName)) {
        throw new Error('Invalid table name');
      }
  
      const deskripsiColumn =
        tableName === 'neraca_bank'
          ? 'deskripsi_pos_laporan_keuangan'
          : 'deskripsi_pos_laba_rugi';
  
      const result = await this.prisma.$queryRaw(
        Prisma.sql`
          SELECT 
            LEFT("id_pelapor", 3) AS id_pelapor_prefix, 
            "id",
            ${Prisma.raw(deskripsiColumn)} AS deskripsi,
            SUM("nominal_rupiah") AS total_nominal_rupiah,
            SUM("nominal_valas") AS total_nominal_valas,
            SUM("nominal_total") AS total_nominal_total
          FROM ${Prisma.raw(tableName)}
          WHERE LEFT("id_pelapor", 3) = ${keyword}
          GROUP BY "id", ${Prisma.raw(deskripsiColumn)}, LEFT("id_pelapor", 3)
          ORDER BY "id";
        `
      );
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }
  
  async getDataLctPeriode(keyword: string, tableName: string, tanggal: string) {
    console.log(`Keyword: ${keyword}`);
    console.log(`Table Name: ${tableName}`);
  
    try {
      const tableNames = ['neraca_bank', 'laba_rugi'];
      if (!tableNames.includes(tableName)) {
        throw new Error('Invalid table name');
      }
  
      const deskripsiColumn =
        tableName === 'neraca_bank'
          ? 'deskripsi_pos_laporan_keuangan'
          : 'deskripsi_pos_laba_rugi';
  
      const result = await this.prisma.$queryRaw(
        Prisma.sql`
          SELECT 
            LEFT("id_pelapor", 3) AS id_pelapor_prefix, 
            "id",
            ${Prisma.raw(deskripsiColumn)} AS deskripsi,
            SUM("nominal_rupiah") AS total_nominal_rupiah,
            SUM("nominal_valas") AS total_nominal_valas,
            SUM("nominal_total") AS total_nominal_total
          FROM ${Prisma.raw(tableName)}
          WHERE LEFT("id_pelapor", 3) = ${keyword}
            AND LEFT("periode_data", 7) = ${tanggal}
          GROUP BY "id", ${Prisma.raw(deskripsiColumn)}, LEFT("id_pelapor", 3)
          ORDER BY "id";
        `
      );
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }
  
  async deleteDuplicateDataNeraca() {
    try {
      const result = await this.prisma.$queryRaw`
        WITH CTE AS (
            SELECT 
                ROW_NUMBER() OVER (PARTITION BY id_pelapor, periode_data, deskripsi_pos_laporan_keuangan ORDER BY (SELECT NULL)) AS row_num,
                ctid,
                id_pelapor,
                periode_data,
                deskripsi_pos_laporan_keuangan,
            FROM neraca_bank
        )
        DELETE FROM neraca_bank
        WHERE ctid IN (
            SELECT ctid
            FROM CTE
            WHERE row_num > 1
        );
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }


  async deleteTruncateDataNeraca(nama_bank: string): Promise<any> {
    try {
      if (nama_bank !== "all") {
        const result = await this.prisma.$queryRaw`
          DELETE FROM neraca_bank WHERE LEFT("id_pelapor", 3) = ${nama_bank};
        `;
        return result;
      } else {
        const result = await this.prisma.$queryRaw`
          TRUNCATE TABLE neraca_bank;
        `;
        return result;
      }
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }
  
  async deleteDuplicateDataLaba() {
    try {
      const result = await this.prisma.$queryRaw`
        WITH CTE AS (
            SELECT 
                ROW_NUMBER() OVER (PARTITION BY id_pelapor, periode_data, deskripsi_pos_laba_rugi ORDER BY (SELECT NULL)) AS row_num,
                ctid,
                id_pelapor,
                periode_data,
                deskripsi_pos_laba_rugi,
            FROM laba_rugi
        )
        DELETE FROM laba_rugi
        WHERE ctid IN (
            SELECT ctid
            FROM CTE
            WHERE row_num > 1
        );
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }


  async deleteTruncateDataLaba(nama_bank: string): Promise<any> {
    try {
      if (nama_bank !== "all") {
        const result = await this.prisma.$queryRaw`
          DELETE FROM laba_rugi WHERE LEFT("id_pelapor", 3) = ${nama_bank};
        `;
        return result;
      } else {
        const result = await this.prisma.$queryRaw`
          TRUNCATE TABLE laba_rugi;
        `;
        return result;
      }
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

}
