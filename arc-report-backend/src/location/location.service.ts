import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  async locationAll(page: number, perPage: number) {
    const skip = (page - 1) * perPage;
    const take = perPage;

    const data = await this.prisma.location.findMany({
      skip,
      take,
    });
    return data;
  }

  async locationAllCount() {
    return await this.prisma.location.count(); // Menghitung total jumlah data
  }

  async findKeywordGeneral(keyword: string) {
    console.log(keyword);
    try {
      const result = await this.prisma.location.findMany({
        where: {
          OR: [
            { doc_box: { contains: keyword, mode: 'insensitive' } },
            { doc_locations: { contains: keyword, mode: 'insensitive' } },
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

    let createdLocation = null;

    try {
      createdLocation = await this.prisma.location.create({
        data: data.location,
      });
    } catch (locationError) {
      console.error('Failed to create location:', locationError.message);
    }

    return {
      message: 'Data created successfully',
      location: createdLocation,
    };
  }

  async updateData(data: any) {
    console.log(data);
    try {
      const updateLocation = await this.prisma.location.upsert({
        where: { doc_box: data.location.doc_box }, // Use a combination of 'equipment', 'doc_no', and 'doc_box' as the unique identifier for the update
        create: data.location,
        update: data.location,
      });

      return {
        message: 'Data updated successfully',
        location: updateLocation,
      };
    } catch (error) {
      return { message: 'Failed to update data', error: error.message };
    }
  }

  async deleteData(data: any) {
    console.log(data);
    try {
      const deletedLocation = await this.prisma.location.delete({
        where: { doc_box: data.doc_box }, // Use 'equipment' as the unique identifier for the delete
      });

      return {
        message: 'Data deleted successfully',
        location: deletedLocation,
      };
    } catch (error) {
      return { message: 'Failed to delete data', error: error.message };
    }
  }
}
