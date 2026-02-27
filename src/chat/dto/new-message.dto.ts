import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '../entities/enity.messages';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class NewTextMessageDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Text field is required' })
  @IsString()
  text: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Room ID is required' })
  @IsString()
  roomId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Message type is required' })
  @IsEnum(MessageType)
  type: MessageType;

  @ApiProperty()
  @IsNotEmpty({ message: 'Sender ID is required' })
  @IsString()
  senderId: string;
}
