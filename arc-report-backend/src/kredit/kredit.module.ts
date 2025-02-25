import { Module } from '@nestjs/common';
import { KreditService } from './kredit.service';
import { KreditController } from './kredit.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KreditController],
  providers: [KreditService],
})
export class KreditModule {}
