import { Module } from '@nestjs/common';
import { ScvService } from './scv.service';
import { ScvController } from './scv.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ScvController],
  providers: [ScvService],
})
export class ScvModule {}
