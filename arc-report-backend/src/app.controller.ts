import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getItems() {
    return this.appService.listItem();
  }

  @Post()
  addItem(@Body() item: { name: string }) {
    return this.appService.addItem(item.name);
  }
}
