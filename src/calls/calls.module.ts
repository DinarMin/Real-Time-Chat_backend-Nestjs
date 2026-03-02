import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsGateway } from './calls.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calls } from './entities/calls.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Calls])],
  providers: [CallsGateway, CallsService],
})
export class CallsModule {}
