import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponseDto {
  @ApiProperty({
    example:
      'eyJhbGckjsadhfiweuyrJ9.eyJpZCI6IjYyZjQ0;lskdhjgkldfjhgjljdfkjgasdfI6MTc2OTY4NzQxMiwiZXhwIjoxNzY5NjkxMDEyfQ.fswWfRMrpvfslkdjflsdjlfksdlJIGeJE',
  })
  accessToken: string;
}
