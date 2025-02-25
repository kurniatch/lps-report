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
import { KreditService } from './kredit.service';
import { AuthGuard } from '../auth/auth.guard';
import * as path from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; // Mengimpor Express untuk tipe file upload


@Controller('kredit')
@UseGuards(AuthGuard)
export class KreditController {
  constructor(private readonly kreditService: KreditService) {}

  @Get('/view')
  async findAllViewData(
    @Query('page', ParseIntPipe) page = 1,
    @Query('perPage', ParseIntPipe) perPage = 10,
  ) {
    console.log('page : ', page);
    return this.kreditService.findAllViewData(page, perPage);
  }

  @Get('/result')
  findAllReportData() {
    return this.kreditService.findAllReportData();
  }

  @Get('/result-total')
  findAllReportTotal() {
    return this.kreditService.findAllReportTotal();
  }

  @Get('/bank')
  getBankData() {
    return this.kreditService.getBank();
  }

  @Get('/total-missing')
  getTotalMissingData() {
    return this.kreditService.findErrorData();
  }

  @Get('/total-view')
  findAllReportDataTotal() {
    return this.kreditService.findAllReportDataTotal();
  }

  @Get('/summary-kredit')
  getSummaryKredit(@Query('table') table: string, @Query('period') period: string) {
    return this.kreditService.getDataSummary(table, period); 
  }

  @Get('/summary-kredit-general')
  getSummaryKreditGeneral(@Query('table') table: string) {
    return this.kreditService.getDataSummaryGeneral(table); 
  }

  @Post('/search-kredit')
  async findKeywordGeneralKredit(@Body('keyword') keyword: string, @Body('page', ParseIntPipe) page = 1,
  @Body('perPage', ParseIntPipe) perPage = 10) {
    return await this.kreditService.findKeywordGeneralKredit(keyword, page, perPage);
  }

  @Post('/search-bank-periode')
  async findKeywordGeneralBankPeriode(
    @Body('keyword') keyword: string,
  ) {
    return await this.kreditService.findKeywordGeneralBankPeriode(keyword);
  }


  @Post('/result-individual')
  async findIndividualData(@Body('keyword') keyword: string) {
    return await this.kreditService.findIndividualData(keyword);
  }

  @Post('/new-kredit')
  async createData(@Body() data: any): Promise<any> {
    return await this.kreditService.createData(data);
  }

  @Post('/update-bank')
  async updateData(@Body() data: any): Promise<any> {
    return await this.kreditService.updateData(data);
  }


  @Post('/import-kredit')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', 
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
    limits: { fileSize: 100 * 1024 * 1024 }, 
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
      const result = await this.kreditService.importDataCsv(filePath);
      console.log('Import successful:', result);
      return { message: 'Import successful', data: result };
    } catch (error) {
      console.error('Import failed:', error);
      throw new InternalServerErrorException('Import failed');
    }
  }

  @Delete('/remove')
  async deleteData(@Body() data: any): Promise<any> {
    return await this.kreditService.deleteData(data);
  } 
  
}
