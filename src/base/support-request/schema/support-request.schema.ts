import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from 'src/base/user/schemas/user.schema';
import { Message } from './message.schema';

@Schema()
export class SupportRequest {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({
    type: MongooseSchema.Types.Array,
    ref: Message.name,
    required: true,
  })
  messages: Message[];

  @Prop({ required: true })
  isActive: boolean;
}

export type SupportRequestDocument = HydratedDocument<SupportRequest>;
export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
