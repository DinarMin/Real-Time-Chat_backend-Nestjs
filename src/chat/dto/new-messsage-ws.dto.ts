import { IsEnum, IsString } from 'class-validator';
import { MessageType } from '../entities/enity.messages';
import { ApiProperty } from '@nestjs/swagger';

export class NewMessageWSDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  roomId: string;

  @ApiProperty()
  @IsEnum(MessageType)
  type: MessageType;
}
