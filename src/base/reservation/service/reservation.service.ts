import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Reservation } from '../schema';
import { ReservationDocument } from '../schema/reservation.schema';

@Injectable()
export class ReservationService implements IReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  async addReservation(data: ReservationDto): Promise<ReservationDocument> {
    const { userId, hotelId, roomId, dateStart, dateEnd } = data;

    const countDocuments = await this.reservationModel.countDocuments({
      userId,
      roomId,
      hotelId,
      dateStart: { $lte: new Date(dateEnd).toISOString() },
      dateEnd: { $gte: new Date(dateStart).toISOString() },
    });

    const roomAvailable = countDocuments === 0;

    if (!roomAvailable) {
      throw new Error('Room is not available');
    }

    const reservation = new this.reservationModel(data);

    return await reservation.save();
  }

  async removeReservation(id: string): Promise<void> {
    await this.reservationModel.findByIdAndDelete(id);
  }

  async getReservations(
    filter: ReservationSearchOptions,
    expand?: string[],
  ): Promise<ReservationDocument[]> {
    const query = this.reservationModel.find(filter);

    if (expand) {
      query.populate(expand);
    }

    return await query.exec();
  }
}
