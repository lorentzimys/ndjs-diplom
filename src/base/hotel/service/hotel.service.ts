import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ID } from 'src/types';

import { Hotel } from '../schema/hotel.schema';

@Injectable()
export class HotelService implements IHotelService {
  constructor(@InjectModel(Hotel.name) private model: Model<Hotel>) {}

  async create(data: any): Promise<Hotel> {
    const hotel = new this.model(data);

    return await hotel.save();
  }

  async findById(id: ID): Promise<Hotel> {
    const hotel = await this.model.findById(id);

    return hotel;
  }

  async search(params: SearchHotelParams): Promise<Hotel[]> {
    const { limit, offset, title } = params;

    const hotels = await this.model
      .find({ title })
      .skip(offset)
      .limit(limit)
      .exec();

    return hotels;
  }

  async update(id: string, data: UpdateHotelParams): Promise<Hotel> {
    const hotel = await this.model.findByIdAndUpdate(id, data);

    return hotel;
  }
}
