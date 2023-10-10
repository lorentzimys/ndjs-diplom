import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Message, SupportRequest } from '../schema';
import { MessageDocument } from '../schema/message.schema';

@Injectable()
export class SupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}

  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequest[]> {
    const searchParams = {};

    if (params.user) {
      searchParams['user'] = params.user;
    }

    if (params.isActive) {
      searchParams['isActive'] = params.isActive;
    }

    const query = this.supportRequestModel.find(searchParams);

    if (params.offset) {
      query.skip(params.offset);
    }

    if (params.limit) {
      query.limit(params.limit);
    }

    return await query.populate('user').exec();
  }

  async sendMessage(data: SendMessageDto): Promise<MessageDocument> {
    const message = new this.messageModel(data);

    return await message.save();
  }

  async getMessages(supportRequest: string): Promise<MessageDocument[]> {
    const messages = await this.messageModel.find({ supportRequest });

    return messages;
  }

  subscribe(
    handler: (supportRequest: SupportRequest, message: MessageDocument) => void,
  ): () => void {
    throw new Error('Method not implemented.');
  }
}
