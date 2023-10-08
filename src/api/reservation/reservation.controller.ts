import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { ReservationDTO, CreateReservationDTO } from '@common/dto';

import { HotelDocument } from '@base/hotel/schema/hotel.schema';
import { HotelRoomDocument } from '@base/hotel/schema/hotelRoom.schema';
import { HotelRoomService } from '@base/hotel/service';
import { ReservationService } from '@base/reservation/service';

const mockUserId = '650ebfd5e103168079a1d653';

@Controller()
export class ReservationApiController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Get('client/reservations')
  async getClientReservations(): Promise<ReservationDTO[]> {
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

  @Get('manager/reservations/:userId')
  async getManagerClientReservations(
    @Param('userId') userId: string,
  ): Promise<ReservationDTO[]> {
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
  async createClientReservation(
    @Body() data: CreateReservationDTO,
  ): Promise<ReservationDTO> {
    const { startDate, endDate } = data;
    const userId = mockUserId;
    const hotelRoom: HotelRoomDocument = await (
      await this.hotelRoomService.findById(data.hotelRoom)
    ).populate('hotel');

    const hotel = hotelRoom.hotel as HotelDocument;
    const roomId = hotelRoom._id;
    const hotelId = (hotel as HotelDocument)._id;

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

  @Delete('client/reservations/:id')
  async deleteClientReservation(@Param('íd') id: string): Promise<void> {
    await this.reservationService.removeReservation(id);
  }

  @Delete('manager/reservations/:userId')
  async deleteManagerClientReservation(
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.reservationService.removeReservation(userId);
  }
}
