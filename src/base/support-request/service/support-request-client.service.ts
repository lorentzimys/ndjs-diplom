import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from '@base/user/schemas/user.schema';

import { Message, SupportRequest } from '../schema';
import { SupportRequestDocument } from '../schema/support-request.schema';

@Injectable()
export class SupportRequestClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequestDocument> {
    throw new Error('Method not implemented.');
  }

  markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const users = this.userModel.find({ _id: { $not: params.user } });
    this.messageModel
      .updateMany(
        {
          user: { $in: [users] },
          supportRequest: params.supportRequest,
          sentAt: { $lte: params.createdBefore },
        },
        { isRead: true },
      )
      .exec();
    throw new Error('Method not implemented.');
  }

  async getUnreadCount(supportRequest: string): Promise<number> {
    const managers = await this.userModel.find({ role: 'manager' }).exec();

    const messagesCount = await this.messageModel
      .countDocuments({
        author: { $in: [managers] },
        supportRequest,
        isRead: false,
      })
      .exec();

    return messagesCount;
  }
}
