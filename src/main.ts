import { join, resolve } from 'path';

import * as dotenv from 'dotenv';
import * as session from 'express-session';
import * as passport from 'passport';

import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { API_PREFIX, PUBLIC_DIR } from '@common/constants';
import { MongoExceptionFilter } from '@common/filters';
import { RolesGuard } from '@common/guards';

import { AppModule } from './app.module';

export const environment = process.env.NODE_ENV || 'development';
export const ENV_FILE_PATH = resolve(
  __dirname,
  '..',
  'env',
  `.${environment}.env`,
);

async function bootstrap() {
  dotenv.config({ path: ENV_FILE_PATH });

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    cors: true,
  });

  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  app.useGlobalFilters(new MongoExceptionFilter());
  app.useStaticAssets(join(process.cwd(), PUBLIC_DIR));
  app.use(
    session({
      secret: process.env.AUTH_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.HTTP_PORT);
  console.log(
    `Application is running on: ${await app.getUrl()} in ${environment} mode`,
  );
}

bootstrap();
