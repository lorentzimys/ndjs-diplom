import { Body, Controller, Get, Post } from '@nestjs/common';
import { HotelDocument } from 'src/base/hotel/schema/hotel.schema';
import { HotelRoomDocument } from 'src/base/hotel/schema/hotelRoom.schema';
import { HotelRoomService } from 'src/base/hotel/service';
import { ReservationService } from 'src/base/reservation/service';
import { CreateReservationDto } from 'src/common/dto/reservation/create-reservation.dto';
import { ReservationDTO } from 'src/common/dto/reservation/reservation.dto';

const mockUserId = '650ebfd5e103168079a1d653';

@Controller()
export class ReservationApiController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Get('client/reservations')
  async getReservations(): Promise<ReservationDTO[]> {
    const userId = mockUserId;
    const reservations = await this.reservationService.getReservations(
      {
        userId,
      },
      ['hotelId', 'roomId'],
    );

    return reservations.map((reservation) => {
      const { dateStart, dateEnd } = reservation;
      const hotel = reservation.hotelId as HotelDocument;
      const hotelRoom = reservation.roomId as HotelRoomDocument;

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
    });
  }

  @Post('client/reservations')
  async createReservation(
    @Body() data: CreateReservationDto,
  ): Promise<ReservationDTO> {
    const { startDate, endDate } = data;
    const userId = mockUserId;
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
