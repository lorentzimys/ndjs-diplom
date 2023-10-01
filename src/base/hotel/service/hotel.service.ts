import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ID } from 'src/common/types';

import { Hotel, HotelDocument } from '../schema/hotel.schema';

@Injectable()
export class HotelService implements IHotelService {
  constructor(@InjectModel(Hotel.name) private model: Model<Hotel>) {}

  async create(data: any): Promise<HotelDocument> {
    const hotel = new this.model({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await hotel.save();
  }

  async findById(id: ID): Promise<HotelDocument> {
    const hotel = await this.model.findById(id);

    return hotel;
  }

  async search(params: SearchHotelParams): Promise<HotelDocument[]> {
    const { limit, offset, title } = params;
    const query = {};

    if (title) {
      query['title'] = title;
    }

    const hotels = await this.model
      .find(query)
      .skip(offset)
      .limit(limit)
      .exec();

    return hotels;
  }

  async update(id: ID, data: UpdateHotelParams): Promise<HotelDocument> {
    const hotel = await this.model.findByIdAndUpdate(id, data);

    return hotel;
  }
}
