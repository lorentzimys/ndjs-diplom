import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ID } from 'src/types';

import { HotelRoom } from '../schema/hotelRoom.schema';

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(@InjectModel(HotelRoom.name) private model: Model<HotelRoom>) {}

  async create(data: HotelRoom): Promise<HotelRoom> {
    const hotelRoom = await new this.model(data);

    return hotelRoom.save();
  }

  async findById(id: string): Promise<HotelRoom> {
    const hotelRoom = await this.model.findById(id);

    return hotelRoom;
  }

  async search({
    limit,
    offset,
    hotel,
    isEnabled,
  }: SearchRoomsParams): Promise<HotelRoom[]> {
    if (!isEnabled) {
      return await this.model.find({ hotel });
    }

    const hotelRooms = await this.model
      .find({ hotel })
      .skip(offset)
      .limit(limit)
      .exec();

    return hotelRooms;
  }

  async update(id: ID, data: HotelRoom): Promise<HotelRoom> {
    const hotelRoom = await this.model.findByIdAndUpdate(id, data);

    return hotelRoom;
  }
}
