import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsGateway } from './calls.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calls } from './entities/enity.calls';

@Module({
  imports: [TypeOrmModule.forFeature([Calls])],
  providers: [CallsGateway, CallsService],
})
export class CallsModule {}
