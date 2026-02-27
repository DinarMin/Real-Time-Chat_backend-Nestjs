import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export interface ReponseSearchUsername {
  id: string;
  username: string;
}

export class ReponseSearchUsernameDto {
  @ApiProperty({
    example: '123456fswWfRMrpvfslkdjflsdjlfksdlJIGeJE',
  })
  id: string;

  @ApiProperty({
    example: 'username123',
  })
  username: string;
}
