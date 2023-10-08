import 'dotenv/config';
import { join } from 'path';

import * as session from 'express-session';
import * as passport from 'passport';

import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { API_PREFIX, PUBLIC_DIR } from '@common/constants';
import { MongoExceptionFilter } from '@common/filters';
import { RolesGuard } from '@common/guards';

import { AppModule } from './app.module';

async function bootstrap() {
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
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
