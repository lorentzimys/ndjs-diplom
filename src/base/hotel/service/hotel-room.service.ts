import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ID } from 'src/common/types';
import { CreateHotelRoomDto } from 'src/common/dto/create-hotel-room.dto';

import { HotelRoom, HotelRoomDocument } from '../schema/hotelRoom.schema';
import { PUBLIC_DIR } from 'src/common/constants';
import { UpdateHotelRoomDto } from 'src/common/dto/update-hotel-room.dto';

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(@InjectModel(HotelRoom.name) private model: Model<HotelRoom>) {}

  async create(data: CreateHotelRoomDto): Promise<HotelRoomDocument> {
    const { hotelId, description, images } = data;
    const hotelRoom = await new this.model({
      description,
      images: images.map((image) => image.path.replace(PUBLIC_DIR, '')),
      hotel: hotelId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return hotelRoom.save();
  }

  async findById(id: ID): Promise<HotelRoom> {
    const hotelRoom = await this.model.findById(id);

    return hotelRoom;
  }

  async search({
    limit,
    offset,
    hotel,
    isEnabled,
  }: SearchRoomsParams): Promise<HotelRoomDocument[]> {
    if (isEnabled === undefined) {
      return await this.model.find().populate('hotel').exec();
    }

    const hotelRooms = await this.model
      .find({ hotel })
      .populate('hotel')
      .skip(offset)
      .limit(limit)
      .exec();

    return hotelRooms;
  }

  async update(id: ID, data: UpdateHotelRoomDto): Promise<HotelRoom> {
    const hotelRoom = await this.model.findByIdAndUpdate(id, data);

    return hotelRoom;
  }
}
