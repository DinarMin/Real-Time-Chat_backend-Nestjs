import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ReponseSearchUsernameDto } from './interfaces/response-searchUsername.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SearchUsernameDto } from './dto/search-username.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Response body',
    type: ReponseSearchUsernameDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Username not found',
  })
  @Get()
  async searchUsername(
    @Query() query: SearchUsernameDto,
  ): Promise<ReponseSearchUsernameDto[] | undefined> {
    return await this.usersService.searchUsername(query.username);
  }
}
