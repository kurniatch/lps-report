import { Injectable } from '@nestjs/common';
// import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}
  async findAllViewData(page: number, perPage: number) {
    try {
      const skip = (page - 1) * perPage;
      const take = perPage;
      const result = await this.prisma.$queryRaw`
      SELECT *
      FROM 
          neraca_bank
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

  async findAllViewDataLaba(page: number, perPage: number) {
    try {
      const skip = (page - 1) * perPage;
      const take = perPage;
      const result = await this.prisma.$queryRaw`
      SELECT *
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
      SELECT COUNT(*) AS total FROM neraca_bank;
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
SELECT * 
FROM laba_rugi
WHERE 
    (
        "id_pelapor" ILIKE ${`%${keyword}%`}
    )
    AND 
    ("head" = 'Header' OR ("buk" IS NOT NULL AND "buk" != ''))
ORDER BY 
    "id_pelapor",
    CAST("id" AS NUMERIC);`
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

  async findDataPlane(keyword: any) {
    console.log(keyword);
    try {
      const result = await this.prisma.$queryRaw`
      SELECT *
      FROM view_get_data_time_result
      WHERE aircraft_reg LIKE '%' || ${keyword.aircraft_reg} || '%'
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
      SELECT DISTINCT id_pelapor FROM neraca_bank;
      `;
      return result;
    } catch (error) {
      throw new Error('Error executing custom query');
    }
  }

  async getLabaRugi() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT DISTINCT id_pelapor FROM laba_rugi;
      `;
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
}
