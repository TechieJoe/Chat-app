import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as compression from 'compression';
import * as express from 'express';

async function bootstrap() {
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: '*' });
  app.use(compression());
  const publicPath = join(__dirname, '..', 'public');
  app.useStaticAssets(publicPath);
  
  // Serve index.html for unknown routes
  app.use('*', express.static(publicPath));
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log( `App running at http://localhost:${port}`);
}
bootstrap();

