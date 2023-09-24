import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService implements IUserService {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  async create(data: Partial<User>): Promise<User> {
    const user = new this.model(data);

    return await user.save();
  }

  async findById(id: string): Promise<User> {
    const user = await this.model.findById(id);

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.model.findOne({ email });

    return user;
  }

  async findAll() {
    const users = await this.model.find();

    return users;
  }
}
