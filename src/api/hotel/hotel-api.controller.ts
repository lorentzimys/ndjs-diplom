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
  Request,
} from '@nestjs/common';
import { HotelService, HotelRoomService } from 'src/base/hotel/service';
import { ID } from 'src/common/types';
import { CreateHotelDto } from '../../common/dto/create-hotel.dto';
import { CreateHotelRoomDto } from '../../common/dto/create-hotel-room.dto';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { HotelDocument } from 'src/base/hotel/schema/hotel.schema';
import { UpdateHotelRoomDto } from 'src/common/dto/update-hotel-room.dto';
import { PUBLIC_DIR } from 'src/common/constants';
import { HotelRoomDTO } from 'src/common/dto/hotel-room.dto';
import { USER_ROLE } from 'src/common/enums';

@Controller()
export class HotelApiController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Get('common/hotel-rooms')
  async getHotelRooms(
    @Query() query: SearchRoomsParams,
    @Request() req: ObjectWith<'user', IUser>,
  ): Promise<HotelRoomDTO[]> {
    const { user } = req;
    let { isEnabled } = query;

    if (!user || user?.role == USER_ROLE.CLIENT) {
      isEnabled = true;
    }

    const hotelRooms = await this.hotelRoomService.search({
      ...query,
      isEnabled,
    });

    return hotelRooms.map(({ _id, description, images, isEnabled, hotel }) => ({
      id: _id.toString(),
      description,
      images,
      isEnabled,
      hotel: hotel
        ? {
            id: (hotel as HotelDocument)._id.toString(),
            title: hotel.title,
            description: hotel.description,
          }
        : null,
    }));
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
    @Param('id') roomId: ID,
    @Body() data: UpdateHotelRoomDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const images = [
      ...data.images,
      ...(files
        ? files.map((image) => image.path.replace(PUBLIC_DIR, ''))
        : []),
    ];
    const hotelRoom = await this.hotelRoomService.update(roomId, {
      ...data,
      images,
    });

    const hotelRoomPopulated = await hotelRoom.populate('hotel');

    const { _id: id, description, isEnabled, hotel } = hotelRoomPopulated;
    const {
      _id: hotelId,
      title: hotelTitle,
      description: hotelDescription,
    } = hotel as HotelDocument;

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
}
