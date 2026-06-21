// Node.js 18 polyfill — globalThis.crypto is only a global from Node 19+.
// Better Auth's generateId() requires the Web Crypto API to be globally available.
import { webcrypto } from 'node:crypto';
if (!globalThis.crypto) {
  // @ts-expect-error Node 18 webcrypto is compatible but types differ slightly
  globalThis.crypto = webcrypto;
}

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  // CORS — allow frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Bangrajan Muaythai API')
    .setDescription(
      'Backend API for Bangrajan Muaythai Boxing Camp management system',
    )
    .setVersion('1.0')
    .addTag('Auth', 'Authentication (Better Auth)')
    .addTag('Members', 'Member management')
    .addTag('Check-in', 'Barcode check-in processing')
    .addTag('Packages', 'Training packages')
    .addTag('Announcements', 'Camp announcements')
    .addTag('Notifications', 'Member notifications')
    .addTag('Dashboard', 'Admin & member dashboard stats')
    .addTag('Reports', 'CSV data export')
    .addTag('Website', 'Landing page CMS')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`\n🥊 Bangrajan API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs\n`);
}
bootstrap();
