import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { RoomType } from '../entities/enity.rooms';

class RoomDto {
  @ApiProperty({ example: '02c948f5-a994-488e-b171-fc5e76c9c12c' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Room-name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'private' })
  @IsString()
  type: string;
}

class ParticipantDto {
  @ApiProperty({ example: '02c948f5-a994-488e-b171-fc5e76c9c12c' })
  @IsString()
  id: string;

  @ApiProperty({ example: '02c948f5-a994-488e-b171-fc5e76c9c12c ' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'admin | member' })
  @IsString()
  role: string;
}

export class CreateRoomResponseDto {
  @ApiProperty({ type: RoomDto })
  @IsEnum(RoomType)
  room: RoomDto;

  @ApiProperty({ type: [ParticipantDto] })
  @IsArray()
  participant: ParticipantDto;
}
