import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RoomsModule } from 'src/rooms/rooms.module';

@Global()
@Module({
  imports: [RoomsModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
