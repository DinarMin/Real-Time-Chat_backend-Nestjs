import { ApiProperty } from '@nestjs/swagger';

class RoomDto {
  @ApiProperty({ example: '02c948f5-a994-488e-b171-fc5e76c9c12c' })
  id: string;

  @ApiProperty({ example: 'Room-name' })
  name: string;

  @ApiProperty({ example: 'private' })
  type: string;
}

class ParticipantDto {
  @ApiProperty({ example: '02c948f5-a994-488e-b171-fc5e76c9c12c' })
  id: string;

  @ApiProperty({ example: '02c948f5-a994-488e-b171-fc5e76c9c12c ' })
  userId: string;

  @ApiProperty({ example: 'admin | member' })
  role: string;
}

export class CreateRoomResponseDto {
  @ApiProperty({ type: RoomDto })
  room: RoomDto;

  @ApiProperty({ type: [ParticipantDto] })
  participant: ParticipantDto;
}
