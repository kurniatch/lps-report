import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';
import { SwiftModule } from './swift/swift.module';
import { DocfileModule } from './docfile/docfile.module';
import { PrismaModule } from './prisma/prisma.module';
import { LocationModule } from './location/location.module';
import { OlderModule } from './older/older.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import * as multer from 'multer';


@Module({
  imports: [
    PrismaModule,
    ReportModule,
    AuthModule,
    SwiftModule,
    DocfileModule,
    LocationModule,
    OlderModule,
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
