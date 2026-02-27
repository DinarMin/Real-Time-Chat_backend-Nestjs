import {
  Body,
  ConflictException,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreatePrivateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import { User } from 'src/users/entities/entity.user';
import { ApiBearerAuth, ApiHeader, ApiResponse } from '@nestjs/swagger';
import {
  IParticipant,
  IParticipantRes,
  IRoomResponse,
} from './interfaces/room-response.interface';
import { CreateRoomResponseDto } from './dto/create-room-response.dto';
@Controller('room')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 201,
    description: 'Response body',
    type: CreateRoomResponseDto,
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer <your_access_token>',
    required: true,
  })
  @Post('create/private')
  async create(
    @Req() { user }: Request,
    @Body() roomDto: CreatePrivateRoomDto,
  ): Promise<IRoomResponse | undefined | string> {
    const userId: string = (user as User).id;
    const { memberId }: { memberId: string } = roomDto;

    const existsRoom = await this.roomsService.existsPrivateRoom(
      userId,
      memberId,
    );

    if (existsRoom) throw new ConflictException('The chat already exists');

    const roomData = await this.roomsService.createPrivate(roomDto, userId);

    return {
      room: {
        id: roomData.room.id,
        name: roomData.room.name,
        type: roomData.room.type,
      },
      participant: Object.values(roomData.participant as IParticipant[]).map(
        (p): IParticipantRes => ({
          id: p.id,
          userId: p.user.id,
          role: p.role,
        }),
      ),
      firstMessage: { ...roomData.firstMessage },
    };
  }
}
