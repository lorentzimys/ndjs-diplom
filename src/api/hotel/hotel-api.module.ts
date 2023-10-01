import { join } from 'path';
import { diskStorage } from 'multer';

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express/multer';

import { HotelModule } from 'src/base/hotel/hotel.module';
import { editFileName } from 'src/utils/file';

import { HotelApiController } from './hotel-api.controller';
import { PUBLIC_DIR } from 'src/common/constants';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(PUBLIC_DIR, 'upload'),
        filename: editFileName,
      }),
    }),
    HotelModule,
  ],
  controllers: [HotelApiController],
})
export class HotelApiModule {}
