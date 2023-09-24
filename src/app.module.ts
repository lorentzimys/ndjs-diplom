import { AuthMechanism, ServerApiVersion } from 'mongodb';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URL,
        dbName: 'hotels-booking',
        user: 'testuser',
        authMechanism: AuthMechanism.MONGODB_X509,
        ssl: true,
        tlsCertificateKeyFile: process.env.MONGO_CERT,
        retryWrites: true,
        authSource: '$external',
        w: 'majority',
        serverApi: ServerApiVersion.v1,
      }),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
