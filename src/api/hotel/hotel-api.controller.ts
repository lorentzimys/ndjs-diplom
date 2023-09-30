import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { HotelService, HotelRoomService } from 'src/base/hotel/service';
import { ID } from 'src/types';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Controller()
export class HotelApiController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Get('common/hotel-rooms')
  async getHotelRooms(@Query() query: GetHotelRoomsQueryParams) {
    const hotelRooms = await this.hotelRoomService.search(query);

    return hotelRooms;
  }

  @Get('common/hotel-rooms/:id')
  async getHotelRoom(@Param('id') id: ID) {
    const hotelRoom = await this.hotelRoomService.findById(id);

    return hotelRoom;
  }

  @Post('admin/hotels')
  async createHotel(@Body() data: CreateHotelDto) {
    const hotel = await this.hotelService.create(data);
    const { _id, title, description } = hotel;

    return { id: _id.toString(), title, description };
  }

  @Get('admin/hotels')
  async getHotels(@Query() query: GetHotelsQueryParams) {
    const hotels = await this.hotelService.search(query);

    return hotels.map(({ _id, title, description }) => ({
      id: _id.toString(),
      title,
      description,
    }));
  }

  @Put('admin/hotels/:id')
  async updateHotel(@Param('id') id: ID, @Body() data: UpdateHotelParams) {
    const hotel = await this.hotelService.update(id, data);
    const { _id, title, description } = hotel;

    return { id: _id.toString(), title, description };
  }

  // @Post('admin/hotel-rooms')
  // async addHotelRoom(@Body() data: CreateHotelRoomDto) {}
}
