import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SwiftService {
  constructor(private readonly prisma: PrismaService) {}

  async arcSwiftAll(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const take = perPage;

    const data = await this.prisma.arc_swift.findMany({
      skip,
      take,
    });
    return data;
  }

  async arcSwiftAllCount() {
    return await this.prisma.arc_swift.count(); // Menghitung total jumlah data
  }

  async findKeywordGeneral(keyword: string) {
    try {
      const result = await this.prisma.arc_swift.findMany({
        where: {
          OR: [
            { equipment: { contains: keyword, mode: 'insensitive' } },
            { material_number: { contains: keyword, mode: 'insensitive' } },
            { serial_number: { contains: keyword, mode: 'insensitive' } },
            {
              material_description: { contains: keyword, mode: 'insensitive' },
            },
            { functional_location: { contains: keyword, mode: 'insensitive' } },
            { aircraft_reg: { contains: keyword, mode: 'insensitive' } },
            { notif_w3: { contains: keyword, mode: 'insensitive' } },
            { order_notif_w3: { contains: keyword, mode: 'insensitive' } },
            { notif_w4: { contains: keyword, mode: 'insensitive' } },
            { batch_notif_w4: { contains: keyword, mode: 'insensitive' } },
            { title: { contains: keyword, mode: 'insensitive' } },
            { po_number: { contains: keyword, mode: 'insensitive' } },
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

    let createdArcSwift = null;

    try {
      createdArcSwift = await this.prisma.arc_swift.create({
        data: data.arc_swift,
      });
    } catch (arcSwiftError) {
      console.error('Failed to create arc_swift:', arcSwiftError.message);
    }

    return {
      message: 'Data created successfully',
      arc_swift: createdArcSwift,
    };
  }

  async updateData(data: any) {
    console.log(data);
    try {
      const updatedArcSwift = await this.prisma.arc_swift.upsert({
        where: { equipment: data.arc_swift.equipment }, // Use a combination of 'equipment', 'doc_no', and 'doc_box' as the unique identifier for the update
        create: data.arc_swift,
        update: data.arc_swift,
      });

      return {
        message: 'Data updated successfully',
        arc_swift: updatedArcSwift,
      };
    } catch (error) {
      return { message: 'Failed to update data', error: error.message };
    }
  }

  async deleteData(data: any) {
    console.log(data);
    try {
      const deletedArcSwift = await this.prisma.arc_swift.delete({
        where: { equipment: data.equipment }, // Use 'equipment' as the unique identifier for the delete
      });

      return {
        message: 'Data deleted successfully',
        arc_swift: deletedArcSwift,
      };
    } catch (error) {
      return { message: 'Failed to delete data', error: error.message };
    }
  }
}
