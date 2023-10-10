import { WebSocketGateway } from '@nestjs/websockets';

import { SupportRequestService } from '@base/support-request/service';

@WebSocketGateway()
export class SupportRequestGateway {
  constructor(private readonly supportRequestService: SupportRequestService) {}
}
