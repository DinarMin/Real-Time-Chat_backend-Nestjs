import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ReponseSearchUsernameDto } from './interfaces/response-searchUsername.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SearchUsernameDto } from './dto/search-username.dto';
import { ApiResponse } from '@nestjs/swagger';
import { User } from './decorators/user.decorator';

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

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUsername(
    @User('id') userId: string,
    @Body('username') username: string,
  ) {
    return this.usersService.renameUsername(userId, username);
  }
}
