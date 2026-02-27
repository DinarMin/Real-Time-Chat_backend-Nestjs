import { WebSocketGateway } from '@nestjs/websockets';
import { CallsService } from './calls.service';

@WebSocketGateway()
export class CallsGateway {
  constructor(private readonly callsService: CallsService) {}
}
