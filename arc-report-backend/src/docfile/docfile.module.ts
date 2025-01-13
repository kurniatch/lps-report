import { Module } from '@nestjs/common';
import { DocfileService } from './docfile.service';
import { DocfileController } from './docfile.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DocfileController],
  providers: [DocfileService],
})
export class DocfileModule {}
