import { forwardRef, Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rooms } from './entities/rooms.entity';
import { Participant } from './entities/participant.entity';
import { Repository } from 'typeorm';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rooms, Participant]),
    forwardRef(() => ChatModule),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, Repository],
  exports: [RoomsService],
})
export class RoomsModule {}
