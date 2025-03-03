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

  async findAllReportTotalLaba() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT COUNT(*) AS total FROM laba_rugi;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
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

  async getLabaRugi() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT DISTINCT LEFT("id_pelapor", 3) AS id_pelapor_prefix, NULL AS periode_data
      FROM laba_rugi
      UNION
      SELECT NULL AS id_pelapor_prefix, "periode_data"
      FROM laba_rugi;     
      `;
      return result;
    } catch (error) {
      throw new Error('Error executing custom query');
    }
  }


  async importDataCsv(filePath: string) {
    const posixFilePath = filePath.split(path.sep).join('/');
    console.log('Importing CSV file:', posixFilePath);
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }
      
      // Bangun query COPY sebagai string lengkap
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

      // Jalankan query menggunakan $executeRawUnsafe
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
      
      // Bangun query COPY sebagai string lengkap
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
