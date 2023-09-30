import { Test, TestingModule } from '@nestjs/testing';
import { HotelApiController } from './hotel-api.controller';
import { HotelApiService } from './hotel-api.service';

describe('HotelApiController', () => {
  let controller: HotelApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelApiController],
      providers: [HotelApiService],
    }).compile();

    controller = module.get<HotelApiController>(HotelApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
