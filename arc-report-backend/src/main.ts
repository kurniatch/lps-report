import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Increase JSON payload limit
  app.use(bodyParser.json({ limit: '50mb' }));
  
  // Increase URL-encoded payload limit
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    // Konfigurasi CORS
  app.enableCors({
    origin: 'http://localhost:4000', // Ganti dengan origin frontend Anda
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(3012);
}
bootstrap();
