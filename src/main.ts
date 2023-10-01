import 'dotenv/config';
import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

import { API_PREFIX, PUBLIC_DIR } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    cors: true,
  });

  app.setGlobalPrefix(API_PREFIX);
  app.useStaticAssets(join(process.cwd(), PUBLIC_DIR));

  await app.listen(process.env.HTTP_PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
