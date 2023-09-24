import { AuthMechanism, ServerApiVersion } from 'mongodb';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { UserModule } from './base/user/user.module';
import { HotelsModule } from './base/hotel/hotel.module';
import { ReservationModule } from './base/reservation/reservation.module';

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
    UserModule,
    HotelsModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
