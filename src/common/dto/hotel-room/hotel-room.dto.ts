import { Expose, Type } from 'class-transformer';

import { HotelNestedDTO } from './hotel-nested.dto';
import { BaseDTO } from '../base.dto';

export class HotelRoomDTO extends BaseDTO {
  @Expose()
  description: string;

  @Expose()
  images: string[];

  @Expose()
  @Type(() => HotelNestedDTO)
  hotel?: HotelNestedDTO;
}
