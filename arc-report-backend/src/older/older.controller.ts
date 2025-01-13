import { Controller, Get, Post, Body, UseGuards, Delete } from '@nestjs/common';
import { OlderService } from './older.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('older')
@UseGuards(AuthGuard)
export class OlderController {
  constructor(private readonly olderService: OlderService) {}

  @Get('/result')
  findAllReportData() {
    return this.olderService.findAllReportData();
  }

  @Get('/result-total')
  findAllReportTotal() {
    return this.olderService.findAllReportTotal();
  }

  @Get('/operator')
  getOperatorData() {
    return this.olderService.getOperator();
  }

  @Delete('/remove')
  async deleteData(@Body() keyword: any): Promise<any> {
    return await this.olderService.removeOldComponent(keyword);
  }

  @Delete('/remove-2')
  async deleteData2(@Body() keyword: any): Promise<any> {
    return await this.olderService.removeOldComponent2(keyword);
  }
}
