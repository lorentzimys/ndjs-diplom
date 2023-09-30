import { Module } from '@nestjs/common';
import { HotelApiController } from './hotel-api.controller';
import { HotelModule } from 'src/base/hotel/hotel.module';

@Module({
  imports: [HotelModule],
  controllers: [HotelApiController],
})
export class HotelApiModule {}
