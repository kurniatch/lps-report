import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

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

  async findAllReportTotal() {
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
      SELECT COUNT(*) AS total FROM neraca_bank;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async findDataStatus() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT * FROM view_data_status;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async findDataStatusNull() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT * FROM view_data_null_available;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async findDataStatusGeneral() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT * FROM view_count_status_general;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async findKeywordGeneralBank(keyword: string) {
    console.log(keyword);
    try {
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
          ("head" = 'Header' OR ("buk" IS NOT NULL AND "buk" != ''))
      ORDER BY 
          id_numeric, -- Urutkan berdasarkan id_numeric
          "id_pelapor_prefix";`
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
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
          COPY laba_rugi_edit  (
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
