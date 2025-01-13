import { Module } from '@nestjs/common';
import { OlderService } from './older.service';
import { OlderController } from './older.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OlderController],
  providers: [OlderService],
})
export class OlderModule {}
