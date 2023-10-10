import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from '@base/user/schemas/user.schema';

import { Message, SupportRequest } from '../schema';

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const user = await this.supportRequestModel
      .findById(params.supportRequest)
      .get('user');

    await this.messageModel
      .updateMany(
        {
          user,
          supportRequest: params.supportRequest,
          sentAt: { $lte: params.createdBefore },
        },
        {
          readAt: new Date(),
        },
      )
      .exec();
  }

  async getUnreadCount(supportRequest: string): Promise<number> {
    const user = await this.supportRequestModel
      .findById(supportRequest)
      .get('user');

    const count = await this.messageModel
      .countDocuments({
        supportRequest,
        user,
        isRead: false,
      })
      .exec();

    return count;
  }

  async closeRequest(supportRequestId: string): Promise<void> {
    await this.supportRequestModel.updateOne(
      {
        _id: supportRequestId,
      },
      {
        isActive: false,
      },
    );
  }
}
