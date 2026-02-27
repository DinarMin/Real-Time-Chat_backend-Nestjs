import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchUsernameDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'username is required' })
  @IsString()
  username: string;
}
