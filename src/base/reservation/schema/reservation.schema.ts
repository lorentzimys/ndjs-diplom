import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ID } from 'src/types';
import { User } from 'src/base/user/schemas/user.schema';
import { Hotel } from 'src/base/hotel/schema/hotel.schema';

@Schema()
export class Reservation {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  userId: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
    unique: true,
  })
  hotelId: Hotel;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Room',
    required: true,
    unique: false,
  })
  roomId: ID;

  @Prop({ required: true, unique: false })
  dateStart: Date;

  @Prop({ required: true, unique: false })
  dateEnd: Date;
}

export type ReservationDocument = HydratedDocument<Reservation>;
export const ReservationSchema = SchemaFactory.createForClass(Reservation);
