import { Expose, Type } from 'class-transformer';

import { BaseDTO } from '../base.dto';
import { UserSmallDTO } from '../user';

export class SupportRequestMessageDTO extends BaseDTO {
  @Expose()
  createdAt: Date;

  @Expose()
  text: string;

  @Expose()
  readAt: Date;

  @Expose()
  @Type(() => UserSmallDTO)
  author: UserSmallDTO;

  constructor(partial: Partial<SupportRequestMessageDTO>) {
    super(partial);
  }
}
