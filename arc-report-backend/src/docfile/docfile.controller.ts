import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DocfileService } from './docfile.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('docfile')
@UseGuards(AuthGuard)
export class DocfileController {
  constructor(private readonly docfileService: DocfileService) {}

  @Get('/all')
  findAllData(
    @Query('page', ParseIntPipe) page = 1,
    @Query('perPage', ParseIntPipe) perPage = 10,
  ) {
    return this.docfileService.docfileAll(page, perPage);
  }

  @Get('/all/count')
  findAllDataCount() {
    return this.docfileService.docfileAllCount();
  }

  @Post('/search')
  async findKeywordGeneral(@Body('keyword') keyword: string) {
    return await this.docfileService.findKeywordGeneral(keyword);
  }

  @Post('/new')
  async createData(@Body() data: any): Promise<any> {
    return await this.docfileService.createData(data);
  }

  @Post('/update')
  async updateData(@Body() data: any): Promise<any> {
    return await this.docfileService.updateData(data);
  }
  @Delete('/remove')
  async deleteData(@Body() data: any): Promise<any> {
    return await this.docfileService.deleteData(data);
  }
}
