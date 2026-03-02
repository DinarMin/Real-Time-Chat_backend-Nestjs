import { IsEnum, IsObject, IsString } from 'class-validator';
import { RoomType } from '../entities/rooms.entity';
import { ApiProperty } from '@nestjs/swagger';
import { FirstMessageDto } from 'src/chat/dto/first-message.dto';

export class CreateRoomPrivateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @IsEnum(RoomType)
  @ApiProperty({ enum: RoomType, description: 'Тип комнаты (чата)' })
  type: RoomType;

  @ApiProperty()
  @IsString()
  memberId: string;

  @ApiProperty()
  @IsObject()
  message: FirstMessageDto;
}
