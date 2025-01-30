import { Module } from '@nestjs/common';
import { ReportService } from './neraca.service';
import { ReportController } from './neraca.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class NeracaModule {}
