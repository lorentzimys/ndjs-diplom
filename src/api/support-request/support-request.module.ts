import { Module } from '@nestjs/common';

import { SupportRequestModule } from '@base/support-request/support-request.module';

import { SupportRequestApiController } from './support-request.controller';

@Module({
  imports: [SupportRequestModule],
  controllers: [SupportRequestApiController],
})
export class SupportRequestApiModule {}
