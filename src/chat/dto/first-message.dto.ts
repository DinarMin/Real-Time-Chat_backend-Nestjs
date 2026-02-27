import { IsEnum, IsString } from 'class-validator';
import { MessageType } from '../entities/enity.messages';
import { ApiProperty } from '@nestjs/swagger';

export class FirstMessageDto {
  @ApiProperty()
  @IsString({ message: 'The text must contain the line' })
  text: string;

  @ApiProperty()
  @IsEnum(MessageType, {
    message: ' Тип может содержать только text, image или call_log',
  })
  type: MessageType;
}
