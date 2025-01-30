import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { LabaModule } from './laba/laba.module';
import { NeracaModule } from './neraca/neraca.module';
import * as path from 'path';
import * as multer from 'multer';
import { ScvModule } from './scv/scv.module';


@Module({
  imports: [
    PrismaModule,
    ReportModule,
    AuthModule,
    LabaModule,
    NeracaModule,
    ScvModule,
    MulterModule.register({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, path.join(__dirname, '..', 'uploads'));
        },
        filename: function (req, file, cb) {
          cb(null, `${Date.now()}-${file.originalname}`); 
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 }, 
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(csv|xlsx|xls)$/)) {
          return cb(new Error('Only CSV and Excel files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
