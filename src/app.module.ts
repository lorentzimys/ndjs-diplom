import { AuthMechanism, ServerApiVersion } from 'mongodb';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { RolesGuard } from '@common/guards';

import { SupportRequestModule } from '@base/support-request/support-request.module';
import { UserModule } from '@base/user/user.module';

import { AuthModule } from '@api/auth/auth.module';
import { HotelApiModule } from '@api/hotel/hotel-api.module';
import { ReservationApiModule } from '@api/reservation/reservation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URL,
        dbName: process.env.MONGO_DB_NAME,
        user: process.env.MONGO_DB_USER,
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
    SupportRequestModule,
    HotelApiModule,
    ReservationApiModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
