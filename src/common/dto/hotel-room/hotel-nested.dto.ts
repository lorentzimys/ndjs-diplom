import { Expose } from 'class-transformer';

import { BaseDTO } from '../base.dto';

export class HotelNestedDTO extends BaseDTO {
  @Expose()
  title: string;

  @Expose()
  description: string;
}
