interface GetHotelsQueryParams {
  limit: number;
  offset: number;
}

interface CreateHotelParams {
  title: string;
  description: string;
}

interface UpdateHotelParams extends CreateHotelParams {}

interface CreateHotelRoomParams {
  description: string;
  hotelId: string;
  images: Express.Multer.File[];
}

interface UpdateHotelRoomParams extends CreateHotelRoomParams {
  images: string[];
}
