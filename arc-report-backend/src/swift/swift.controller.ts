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
import { SwiftService } from './swift.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('swift')
@UseGuards(AuthGuard)
export class SwiftController {
  constructor(private readonly swiftService: SwiftService) {}

  @Get('/all')
  findAllData(
    @Query('page', ParseIntPipe) page = 1,
    @Query('perPage', ParseIntPipe) perPage = 10,
  ) {
    return this.swiftService.arcSwiftAll(page, perPage);
  }

  @Get('/all/count')
  findAllDataCount() {
    return this.swiftService.arcSwiftAllCount();
  }

  @Post('/search')
  async findKeywordGeneral(@Body('keyword') keyword: string) {
    return await this.swiftService.findKeywordGeneral(keyword);
  }

  @Post('/new')
  async createData(@Body() data: any): Promise<any> {
    return await this.swiftService.createData(data);
  }

  @Post('/update')
  async updateData(@Body() data: any): Promise<any> {
    return await this.swiftService.updateData(data);
  }
  @Delete('/remove')
  async deleteData(@Body() data: any): Promise<any> {
    return await this.swiftService.deleteData(data);
  }
}
