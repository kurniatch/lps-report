import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OlderService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllReportTotal() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT * FROM view_get_data_time_total_old;
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
      SELECT * FROM view_get_data_time_result_old;
      `;
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw new Error('Error executing custom query');
    }
  }

  async getOperator() {
    try {
      const result = await this.prisma.$queryRaw`
      SELECT DISTINCT operator FROM view_get_data_old;
      `;
      return result;
    } catch (error) {
      throw new Error('Error executing custom query');
    }
  }

  async removeOldComponent(keyword) {
    console.log(keyword);
    try {
      const deletedComponent = await this.prisma.old_component.delete({
        where: {
          identified: keyword.key,
        },
      });
      return deletedComponent;
    } catch (error) {
      throw new Error(`Error removing old component: ${error.message}`);
    }
  }

  async removeOldComponent2(keyword) {
    console.log(keyword);
    try {
      const deleteResult = await this.prisma.$executeRaw`
              DELETE FROM old_component
              WHERE ac_type = ${keyword.key};
            `;
      return deleteResult;
    } catch (error) {
      throw new Error(`Error deleting by operator: ${error.message}`);
    }
  }
}
