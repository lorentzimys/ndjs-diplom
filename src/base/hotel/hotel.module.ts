import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Hotel, HotelSchema } from './schemas/hotel.schema';
import { HotelRoom, HotelRoomSchema } from './schemas/hotelRoom.schema';

import { HotelService } from './hotel.service';
import { HotelRoomService } from './hotel-room.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  providers: [HotelService, HotelRoomService],
  exports: [HotelService, HotelRoomService],
})
export class HotelsModule {}
