export class CreateHotelRoomDto {
  description: string;
  hotelId: string;
  images: Express.Multer.File[];
}
