import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { HotelService, HotelRoomService } from 'src/base/hotel/service';
import { ID } from 'src/types';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Controller('api/common')
export class HotelApiController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Get('hotel-rooms')
  async getHotelRooms(@Query() query: GetHotelRoomsQueryParams) {
    const hotelRooms = await this.hotelRoomService.search(query);

    return hotelRooms;
  }

  @Get('hotel-rooms/:id')
  async getHotelRoom(@Param('id') id: ID) {
    const hotelRoom = await this.hotelRoomService.findById(id);

    return hotelRoom;
  }

  @Post('hotel')
  async createHotel(@Body() data: CreateHotelDto) {
    const hotel = await this.hotelService.create(data);
    const { _id, title, description } = hotel;

    return { id: _id.toString(), title, description };
  }

  // @Get('hotels')
  // async getHotels(@Query() query: GetHotelsQueryParams) {
  //   const hotels = await this.hotelService.search(query);

  //   return hotels;
  // }

  // @Post()
  // create(@Body() createHotelApiDto: CreateHotelApiDto) {
  //   return this.hotelApiService.create(createHotelApiDto);
  // }

  // @Get()
  // findAll() {
  //   return this.hotelApiService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.hotelApiService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateHotelApiDto: UpdateHotelApiDto,
  // ) {
  //   return this.hotelApiService.update(+id, updateHotelApiDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.hotelApiService.remove(+id);
  // }
}
