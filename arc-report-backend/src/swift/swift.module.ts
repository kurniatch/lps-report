import { Module } from '@nestjs/common';
import { SwiftService } from './swift.service';
import { SwiftController } from './swift.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SwiftController],
  providers: [SwiftService],
})
export class SwiftModule {}
