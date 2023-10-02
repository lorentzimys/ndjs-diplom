import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Reservation } from '../schema';
import { ReservationDocument } from '../schema/reservation.schema';

@Injectable()
export class ReservationService implements IReservationService {
  constructor(
    @InjectModel(Reservation.name) private model: Model<ReservationDocument>,
  ) {}

  async addReservation(data: ReservationDto): Promise<ReservationDocument> {
    const { userId, hotelId, roomId, dateStart, dateEnd } = data;
    const roomAvailable =
      (await this.model
        .countDocuments({
          userId,
          roomId,
          hotelId,
          $or: [
            {
              $and: [
                { endDate: { $gte: dateStart } },
                { endDate: { $lte: dateEnd } },
              ],
            },
            {
              $and: [
                { startDate: { $gte: dateStart } },
                { startDate: { $lte: dateEnd } },
              ],
            },
          ],
        })
        .exec()) === 0;

    if (!roomAvailable) {
      throw new Error('Room is not available');
    }

    const reservation = new this.model(data);

    return await reservation.save();
  }

  async removeReservation(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }

  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<ReservationDocument[]> {
    return await this.model.find(filter).exec();
  }
}
