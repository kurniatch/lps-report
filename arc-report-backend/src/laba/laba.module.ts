import { Module } from '@nestjs/common';
import { ReportService } from './laba.service';
import { ReportController } from './laba.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class LabaModule {}
