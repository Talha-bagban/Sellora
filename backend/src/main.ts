import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',
  });

app.use(
  '/uploads',
  express.static(join(__dirname, '..', 'uploads')),
);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
