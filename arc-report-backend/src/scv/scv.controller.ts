import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Delete,
  Body,
  ParseIntPipe,
  UseGuards,
  BadRequestException, 
  InternalServerErrorException,
} from '@nestjs/common';
import { UseInterceptors, UploadedFile } from '@nestjs/common';

import { ScvService } from './scv.service';
import { AuthGuard } from '../auth/auth.guard';
import * as path from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; // Mengimpor Express untuk tipe file upload


@Controller('scv')
@UseGuards(AuthGuard)
export class ScvController {
  constructor(private readonly scvService: ScvService) {}

  @Get('/view')
  async findAllViewData(
    @Query('page', ParseIntPipe) page = 1,
    @Query('perPage', ParseIntPipe) perPage = 10,
  ) {
    console.log('page : ', page);
    return this.scvService.findAllViewData(page, perPage);
  }

  @Get('/result')
  findAllReportData() {
    return this.scvService.findAllReportData();
  }

  @Get('/result-total')
  findAllReportTotal() {
    return this.scvService.findAllReportTotal();
  }

  @Get('/bank')
  getBankData() {
    return this.scvService.getBank();
  }

  @Get('/total-missing')
  getTotalMissingData() {
    return this.scvService.findErrorData();
  }

  @Get('/total-view')
  findAllReportDataTotal() {
    return this.scvService.findAllReportDataTotal();
  }

  @Get('/total-status-general')
  findDataStatusGeneral() {
    return this.scvService.findDataStatusGeneral();
  }

  @Post('/search')
  async findKeywordGeneral(@Body('keyword') keyword: string) {
    return await this.scvService.findKeywordGeneral(keyword);
  }

  @Post('/search-scv')
  async findKeywordGeneralBank(@Body('keyword') keyword: string) {
    return await this.scvService.findKeywordGeneralBank(keyword);
  }

  @Post('/search-bank-periode')
  async findKeywordGeneralBankPeriode(
    @Body('keyword') keyword: string,
  ) {
    return await this.scvService.findKeywordGeneralBankPeriode(keyword);
  }


  @Post('/result-individual')
  async findIndividualData(@Body('keyword') keyword: string) {
    return await this.scvService.findIndividualData(keyword);
  }

  @Post('/new-scv')
  async createData(@Body() data: any): Promise<any> {
    return await this.scvService.createData(data);
  }

  @Post('/update-bank')
  async updateData(@Body() data: any): Promise<any> {
    return await this.scvService.updateData(data);
  }


  @Post('/import-scv')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', 
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
        cb(null, true);
      } else {
        cb(new BadRequestException('Only CSV files are allowed'), false);
      }
    },
  }))
  async importDataCsv(@UploadedFile() file: Express.Multer.File) {
    console.log('File:', file);
    
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const filePath = path.join(__dirname, '..', '..', 'uploads', file.filename);
    console.log('File Path:', filePath); 

    try {
      const result = await this.scvService.importDataCsv(filePath);
      console.log('Import successful:', result);
      return { message: 'Import successful', data: result };
    } catch (error) {
      console.error('Import failed:', error);
      throw new InternalServerErrorException('Import failed');
    }
  }

  @Delete('/remove')
  async deleteData(@Body() data: any): Promise<any> {
    return await this.scvService.deleteData(data);
  } 
  
}
