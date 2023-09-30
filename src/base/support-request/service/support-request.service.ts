import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Message, SupportRequest } from '../schema';

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
    const { user, isActive } = params;

    const supportRequests = await this.supportRequestModel.find({
      user,
      isActive,
    });

    return supportRequests;
  }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    const message = new this.messageModel(data);

    return await message.save();
  }

  async getMessages(supportRequest: string): Promise<Message[]> {
    const messages = await this.messageModel.find({ supportRequest });

    return messages;
  }

  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    throw new Error('Method not implemented.');
  }
}
