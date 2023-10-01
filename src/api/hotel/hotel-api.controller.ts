import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { HotelService, HotelRoomService } from 'src/base/hotel/service';
import { ID } from 'src/common/types';
import { CreateHotelDto } from '../../common/dto/create-hotel.dto';
import { CreateHotelRoomDto } from '../../common/dto/create-hotel-room.dto';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { HotelDocument } from 'src/base/hotel/schema/hotel.schema';
import { UpdateHotelRoomDto } from 'src/common/dto/update-hotel-room.dto';

@Controller()
export class HotelApiController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Get('common/hotel-rooms')
  async getHotelRooms(@Query() query: GetHotelRoomsQueryParams) {
    const hotelRooms = await this.hotelRoomService.search(query);

    return hotelRooms.map(
      ({ _id: id, description, images, isEnabled, hotel }) => ({
        id,
        description,
        images,
        isEnabled,
        hotel: hotel
          ? {
              id: (hotel as HotelDocument)._id,
              title: hotel.title,
              description: hotel.description,
            }
          : null,
      }),
    );
  }

  @Get('common/hotel-rooms/:id')
  async getHotelRoom(@Param('id') id: ID) {
    const hotelRoom = await this.hotelRoomService.findById(id);

    return hotelRoom;
  }

  @Post('admin/hotels')
  async createHotel(@Body() data: CreateHotelDto) {
    const hotel = await this.hotelService.create(data);
    const { _id: id, title, description } = hotel;

    return { id, title, description };
  }

  @Get('admin/hotels')
  async getHotels(@Query() query: GetHotelsQueryParams) {
    const hotels = await this.hotelService.search(query);

    return hotels.map(({ _id: id, title, description }) => ({
      id,
      title,
      description,
    }));
  }

  @Put('admin/hotels/:id')
  async updateHotel(@Param('id') id: ID, @Body() data: UpdateHotelParams) {
    const hotel = await this.hotelService.update(id, data);
    const { title, description } = hotel;

    return { id, title, description };
  }

  @Post('admin/hotel-rooms')
  @UseInterceptors(FilesInterceptor('images', 10))
  async addHotelRoom(
    @Body() data: CreateHotelRoomDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const hotelRoom = await this.hotelRoomService.create({
      ...data,
      images: files,
    });

    const hotelRoomPopulated = await hotelRoom.populate('hotel');
    const {
      _id: id,
      description,
      images,
      isEnabled,
      hotel: { title: hotelTitle, description: hotelDescription },
    } = hotelRoomPopulated;
    const hotelId = (hotelRoomPopulated.hotel as HotelDocument)._id;

    return {
      id,
      description,
      images,
      isEnabled,
      hotel: {
        id: hotelId,
        title: hotelTitle,
        description: hotelDescription,
      },
    };
  }

  @Put('admin/hotel-rooms/:id')
  @UseInterceptors(FilesInterceptor('images', 10))
  async updateHotelRoom(
    @Param('id') id: ID,
    @Body() data: UpdateHotelRoomDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    console.log(images);
    console.log(data);
    // const hotelRoom = await this.hotelRoomService.update(id, data);
    // const {
    //   _id: id,
    //   description,
    //   images,
    //   isEnabled,
    //   hotel: { title: hotelTitle, description: hotelDescription },
    // } = hotelRoom;
    // const hotelId = (hotelRoom.hotel as HotelDocument)._id;

    // return {
    //   id,
    //   description,
    //   images,
    //   isEnabled,
    //   hotel: {
    //     id: hotelId,
    //     title: hotelTitle,
    //     description: hotelDescription,
    //   },
    // };
  }
}
