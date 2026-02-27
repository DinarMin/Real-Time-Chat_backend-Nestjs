import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Имя пользователя',
    minimum: 1,
    type: String,
  })
  @IsString()
  readonly username: string;

  @ApiProperty({
    description: 'Почта пользователя',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
  })
  @IsNotEmpty()
  readonly password: string;
}
