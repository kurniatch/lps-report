import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocfileService {
  constructor(private readonly prisma: PrismaService) {}

  async docfileAll(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const take = perPage;

    const data = await this.prisma.docfile.findMany({
      skip,
      take,
    });
    return data;
  }

  async docfileAllCount() {
    return await this.prisma.docfile.count(); // Menghitung total jumlah data
  }

  async findKeywordGeneral(keyword: string) {
    try {
      const result = await this.prisma.docfile.findMany({
        where: {
          OR: [
            { doc_no: { contains: keyword, mode: 'insensitive' } },
            { doc_posting_date: { contains: keyword, mode: 'insensitive' } },
            { doc_type: { contains: keyword, mode: 'insensitive' } },
            { doc_location: { contains: keyword, mode: 'insensitive' } },
            { doc_status: { contains: keyword, mode: 'insensitive' } },
            { doc_createddate: { contains: keyword, mode: 'insensitive' } },
            { doc_createdby: { contains: keyword, mode: 'insensitive' } },
            { doc_lastupdate: { contains: keyword, mode: 'insensitive' } },
            { doc_lastuser: { contains: keyword, mode: 'insensitive' } },
            { doc_category: { contains: keyword, mode: 'insensitive' } },
            { doc_aircrafte: { contains: keyword, mode: 'insensitive' } },
            { doc_work_packagee: { contains: keyword, mode: 'insensitive' } },
            { doc_reason: { contains: keyword, mode: 'insensitive' } },
            { doc_returndate: { contains: keyword, mode: 'insensitive' } },
            {
              doc_retention_schedule: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
            { doc_last_received: { contains: keyword, mode: 'insensitive' } },
            { doc_last_rejected: { contains: keyword, mode: 'insensitive' } },
            { doc_filed: { contains: keyword, mode: 'insensitive' } },
          ],
        },
      });
      return result;
    } catch (error) {
      console.error('Error executing custom query:', error);
    }
  }

  async createData(data: any) {
    console.log(data);

    let createdDocfile = null;

    try {
      createdDocfile = await this.prisma.docfile.create({
        data: data.docfile,
      });
    } catch (docfileError) {
      console.error('Failed to create docfile:', docfileError.message);
    }

    return {
      message: 'Data created successfully',
      docfile: createdDocfile,
    };
  }

  async updateData(data: any) {
    console.log(data);
    try {
      const updateDocfile = await this.prisma.docfile.upsert({
        where: { doc_no: data.docfile.doc_no }, // Use a combination of 'equipment', 'doc_no', and 'doc_box' as the unique identifier for the update
        create: data.docfile,
        update: data.docfile,
      });

      return {
        message: 'Data updated successfully',
        docfile: updateDocfile,
      };
    } catch (error) {
      return { message: 'Failed to update data', error: error.message };
    }
  }

  async deleteData(data: any) {
    console.log(data);
    try {
      const deletedDocfile = await this.prisma.docfile.delete({
        where: { doc_no: data.doc_no }, // Use 'equipment' as the unique identifier for the delete
      });

      return {
        message: 'Data deleted successfully',
        docfile: deletedDocfile,
      };
    } catch (error) {
      return { message: 'Failed to delete data', error: error.message };
    }
  }
}
