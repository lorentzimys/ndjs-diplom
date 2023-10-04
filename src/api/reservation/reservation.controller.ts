import { Body, Controller, Post } from '@nestjs/common';
import { HotelDocument } from 'src/base/hotel/schema/hotel.schema';
import { HotelRoomDocument } from 'src/base/hotel/schema/hotelRoom.schema';
import { HotelRoomService } from 'src/base/hotel/service';
import { ReservationService } from 'src/base/reservation/service';
import { CreateReservationDto } from 'src/common/dto/reservation/create-reservation.dto';
import { ReservationDTO } from 'src/common/dto/reservation/reservation.dto';

@Controller()
export class ReservationApiController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Post('client/reservations')
  async createReservation(
    @Body() data: CreateReservationDto,
  ): Promise<ReservationDTO> {
    const { startDate, endDate } = data;
    const userId = '5f9c0b3b9d3e9c1b7c9b4c7b';
    const hotelRoom: HotelRoomDocument = await (
      await this.hotelRoomService.findById(data.hotelRoom)
    ).populate('hotel');

    const hotel = hotelRoom.hotel as HotelDocument;
    const roomId = hotelRoom._id;
    const hotelId = hotel._id;

    const { dateStart, dateEnd } = await this.reservationService.addReservation(
      {
        userId,
        hotelId,
        roomId,
        dateStart: new Date(startDate),
        dateEnd: new Date(endDate),
      },
    );

    return {
      startDate: dateStart.toISOString(),
      endDate: dateEnd.toISOString(),
      hotelRoom: {
        images: hotelRoom.images,
        description: hotelRoom.description,
      },
      hotel: {
        title: hotel.title,
        description: hotel.description,
      },
    };
  }
}
