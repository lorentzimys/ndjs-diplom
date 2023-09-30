import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const DEFAULT_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });
  app.setGlobalPrefix('api');
  await app.listen(process.env.HTTP_PORT || DEFAULT_PORT);
}
bootstrap();
