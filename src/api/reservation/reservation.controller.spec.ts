import { Test, TestingModule } from '@nestjs/testing';
import { ReservationApiController } from './reservation.controller';
import { ReservationService } from 'src/base/reservation/service';

describe('ReservationApiController', () => {
  let controller: ReservationApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationApiController],
      providers: [ReservationService],
    }).compile();

    controller = module.get<ReservationApiController>(ReservationApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
