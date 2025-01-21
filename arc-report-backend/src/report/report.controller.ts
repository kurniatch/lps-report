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

import { ReportService } from './report.service';
import { AuthGuard } from '../auth/auth.guard';
import * as path from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; // Mengimpor Express untuk tipe file upload




@Controller('report')
@UseGuards(AuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/view')
  async findAllViewData(
    @Query('page', ParseIntPipe) page = 1,
    @Query('perPage', ParseIntPipe) perPage = 10,
  ) {
    console.log('page : ', page);
    return this.reportService.findAllViewData(page, perPage);
  }

  @Get('/view-laba-rugi')
  async findAllViewDataLaba(
    @Query('page', ParseIntPipe) page = 1,
    @Query('perPage', ParseIntPipe) perPage = 10,
  ) {
    console.log('page : ', page);
    return this.reportService.findAllViewDataLaba(page, perPage);
  }

  @Get('/result')
  findAllReportData() {
    return this.reportService.findAllReportData();
  }

  @Get('/result-total')
  findAllReportTotal() {
    return this.reportService.findAllReportTotal();
  }

  @Get('/result-total-laba')
  findAllReportTotalLaba() {
    return this.reportService.findAllReportTotalLaba();
  }

  // @Get('/reg-plane')
  // getAircraftData() {
  //   return this.reportService.getAircraftReg();
  // }

  // @Get('/operator')
  // getOperatorData() {
  //   return this.reportService.getOperator();
  // }

  @Get('/bank')
  getBankData() {
    return this.reportService.getBank();
  }

  @Get('/laba-rugi')
  getLabaRugiData() {
    return this.reportService.getLabaRugi();
  }

  @Get('/total-missing')
  getTotalMissingData() {
    return this.reportService.findErrorData();
  }

  @Get('/total-view')
  findAllReportDataTotal() {
    return this.reportService.findAllReportDataTotal();
  }

  // @Get('/total-status')
  // findDataStatus() {
  //   return this.reportService.findDataStatus();
  // }

  // @Get('/total-status-null')
  // findDataStatusNull() {
  //   return this.reportService.findDataStatusNull();
  // }

  @Get('/total-status-general')
  findDataStatusGeneral() {
    return this.reportService.findDataStatusGeneral();
  }

  // @Post('/search-plane')
  // async findDataPlane(@Body('keyword') keyword: string) {
  //   return await this.reportService.findDataPlane(keyword);
  // }

  // @Post('/search-operator')
  // async findDataOperator(@Body('keyword') keyword: string) {
  //   console.log(keyword);
  //   return await this.reportService.findDataOperator(keyword);
  // }

  @Post('/search')
  async findKeywordGeneral(@Body('keyword') keyword: string) {
    return await this.reportService.findKeywordGeneral(keyword);
  }

  @Post('/search-bank')
  async findKeywordGeneralBank(@Body('keyword') keyword: string) {
    return await this.reportService.findKeywordGeneralBank(keyword);
  }

  @Post('/search-bank-periode')
  async findKeywordGeneralBankPeriode(
    @Body('keyword') keyword: string,
    @Body('periode') periode: string,
  ) {
    return await this.reportService.findKeywordGeneralBankPeriode(keyword, periode);
  }

  @Post('/search-laba-rugi')
  async findKeywordGeneralLaba(@Body('keyword') keyword: string) {
    return await this.reportService.findKeywordGeneralLaba(keyword);
  }

  @Post('/result-individual')
  async findIndividualData(@Body('keyword') keyword: string) {
    return await this.reportService.findIndividualData(keyword);
  }

  @Post('/new-bank')
  async createData(@Body() data: any): Promise<any> {
    return await this.reportService.createData(data);
  }

  @Post('/update-bank')
  async updateData(@Body() data: any): Promise<any> {
    return await this.reportService.updateData(data);
  }

  // @Post('/add-old')
  // async createOldData(@Body() keyword: any): Promise<any> {
  //   console.log('controller', keyword);
  //   return await this.reportService.createOldComponent(keyword);
  // }

  @Post('/import-laba-rugi')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Pastikan direktori ini ada
      filename: (req, file, cb) => {
        // Generate nama file unik
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
      const result = await this.reportService.importDataCsv(filePath);
      console.log('Import successful:', result);
      return { message: 'Import successful', data: result };
    } catch (error) {
      console.error('Import failed:', error);
      throw new InternalServerErrorException('Import failed');
    }
  }

  @Post('/import-neraca')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Pastikan direktori ini ada
      filename: (req, file, cb) => {
        // Generate nama file unik
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
  async importDataCsvNeraca(@UploadedFile() file: Express.Multer.File) {
    console.log('File:', file);
    
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const filePath = path.join(__dirname, '..', '..', 'uploads', file.filename);
    console.log('File Path:', filePath); 

    try {
      const result = await this.reportService.importDataCsvNeraca(filePath);
      console.log('Import successful:', result);
      return { message: 'Import successful', data: result };
    } catch (error) {
      console.error('Import failed:', error);
      throw new InternalServerErrorException('Import failed');
    }
  }

  @Delete('/remove')
  async deleteData(@Body() data: any): Promise<any> {
    return await this.reportService.deleteData(data);
  } 

  @Get('server-status')
  async getServerStatus() {
    return this.reportService.getServerStatus();
  }

  @Get('data-lct')
  async getDataLct(
    @Query('tableName') tableName: string, 
    @Query('keyword') keyword: string
  ) {
    if (!tableName || !keyword) {
      throw new BadRequestException('Both tableName and keyword are required');
    }
  
    return this.reportService.getDataLct(tableName, keyword);
  }
  
}
