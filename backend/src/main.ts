import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as express from 'express';
import type { Request, Response } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let cachedApp: any;

async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://sellora-theta-lilac.vercel.app',
    ],
    credentials: true,
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

  await app.init();

  return app;
}

export default async function handler(req: Request, res: Response) {
  if (!cachedApp) {
    cachedApp = await createApp();
  }

  const expressApp = cachedApp.getHttpAdapter().getInstance();

  expressApp(req, res);
}

// Local development
if (process.env.NODE_ENV !== 'production') {
  createApp().then((app) => {
    app.listen(process.env.PORT ?? 3000);
  });
}



// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module.js';
// import { ValidationPipe } from '@nestjs/common';
// import { fileURLToPath } from 'node:url';
// import { dirname, join } from 'node:path';
// import * as express from 'express';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors({
//     origin: 'http://localhost:3001',
//   });

// app.use(
//   '/uploads',
//   express.static(join(__dirname, '..', 'uploads')),
// );

//   app.setGlobalPrefix('api');

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       transform: true,
//     }),
//   );

//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();
