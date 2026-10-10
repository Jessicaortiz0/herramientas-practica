import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import express = require('express');
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const expressApp = express();
  expressApp.set('case sensitive routing', true);
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, adapter);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  await app.listen(3000, '127.0.0.1');
  console.log('API disponible en http://localhost:3000/Usuarios');
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
