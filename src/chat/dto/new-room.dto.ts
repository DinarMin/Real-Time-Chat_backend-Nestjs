import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NewRoomDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Sender ID is required' })
  @IsString()
  senderId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Room ID is required' })
  @IsString()
  roomId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Room name is required' })
  @IsString()
  roomName: string;
}
