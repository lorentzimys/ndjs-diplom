import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService implements IUserService {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  async create(data: Partial<User>): Promise<UserDocument> {
    const user = new this.model(data);

    return await user.save();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.model.findById(id);

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.model.findOne({
      email: { $regex: email, $options: 'i' },
    });

    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    const users = await this.model.find();

    return users;
  }

  async search(params: SearchUserParams): Promise<UserDocument[]> {
    const users = await this.model.find({
      email: { $regex: params.email, $options: 'i' },
      name: { $regex: params.name, $options: 'i' },
      contactPhone: { $regex: params.contactPhone, $options: 'i' },
    });

    return users;
  }
}
