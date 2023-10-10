import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

import { CurrentUser } from '@common/decorators';
import { SupportRequestDTO, SupportRequestManagerDTO } from '@common/dto';
import { MongooseClassSerializerInterceptor } from '@common/interceptors';

import {
  SupportRequestClientService,
  SupportRequestEmployeeService,
  SupportRequestService,
} from '@base/support-request/service';

@Controller()
@SerializeOptions({ strategy: 'excludeAll' })
export class SupportRequestApiController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  @Post('client/support-requests')
  @UseInterceptors(MongooseClassSerializerInterceptor(SupportRequestDTO))
  async createSupportRequest(
    @Body() body: CreateSupportRequestParams,
    @CurrentUser() user,
  ) {
    return await this.supportRequestClientService.createSupportRequest({
      ...body,
      user: user._id,
    });
  }

  @Get('client/support-requests')
  @UseInterceptors(MongooseClassSerializerInterceptor(SupportRequestDTO))
  async getClientSupportRequests(
    @CurrentUser() user,
    @Query() params: GetSupportRequestsQueryParams,
  ) {
    const requests = await this.supportRequestService.findSupportRequests({
      ...params,
      user: user._id,
    });

    return requests;
  }

  @Get('manager/support-requests')
  @UseInterceptors(MongooseClassSerializerInterceptor(SupportRequestManagerDTO))
  async getSupportRequests(@Query() params: GetSupportRequestsQueryParams) {
    return await this.supportRequestService.findSupportRequests({
      ...params,
    });
  }
}
