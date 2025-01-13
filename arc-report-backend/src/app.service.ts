import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  items: string[] = [];

  listItem(): any {
    return this.items;
  }

  addItem(item: string): any {
    this.items.push(item);
  }
}
