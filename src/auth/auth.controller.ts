import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { ApiBody, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { LocalAuthGuard } from './guards/local-auth-guard';

import type { LoginUser } from '../users/interfaces/login-user.interface';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { LoginUserResponseDto } from 'src/users/dto/login-user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * Registers a new user.
   * Accepts the new user's data as a CreateUserDto object.
   * Calls the signUp method of the AuthService to create a new user.
   *
   * @param {CreateUserDto} userDto
   * @return {*}
   * @memberof AuthController
   */
  @Post('signup')
  @ApiResponse({
    status: 201,
    description:
      'A user with the email address example@mail.com has been registered!',
  })
  @ApiResponse({
    status: 400,
    description: 'A user with this email address is already registered!',
  })
  @ApiResponse({
    status: 409,
    description: 'Duplicate username',
  })
  @ApiBody({ type: [CreateUserDto] })
  async signUp(@Body() userDto: CreateUserDto) {
    const user = await this.authService.signUp(userDto);

    if (!user) {
      throw new HttpException(
        'A user with this email address is already registered!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      message: `User with email: ${user.email} has been registered!`,
    };
  }
  /**
   * Authentication
   * Accepts login data (username and password) as a LoginUserDto object.
   * Uses LocalAuthGuard to verify the login data is correct.
   * If the data is correct, generates a token pair (an access token and a refresh token) using the AuthService.
   * Stores the refresh token in an httpOnly cookie named 'refreshToken' with an expiration date of 7 days.
   * Returns the access token in the response body.
   *
   * @param {LoginUserDto} dto
   * @param {(Request & { user: LoginUser })} req
   * @param {Response} res
   * @return {*}  {Promise<LoginUserResponseDto>}
   * @memberof AuthController
   */
  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 201,
    description: 'Response body',
    type: LoginUserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Incorrect login or password.' })
  @ApiResponse({ status: 404, description: 'Incorrect login or password.' })
  async signIn(
    @Body() dto: LoginUserDto,
    @Req() req: Request & { user: LoginUser },
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginUserResponseDto> {
    const tokens = await this.authService.singIn(req.user);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      path: '/auth/update',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken: tokens.accessToken };
  }
  /**
   * Refreshing the access token using the refresh token stored in the httpOnly cookie.
   * If the refresh token is invalid or missing, a 401 Unauthorized error is returned.
   *
   * @param {Request} req
   * @return {*}  {Promise<{ accessToken: string }>}
   * @memberof AuthController
   */
  @Post('update')
  @ApiResponse({ status: 201, description: '{ <access_token> }' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateTokens(@Req() req: Request): Promise<{ accessToken: string }> {
    const refreshToken: string = req.cookies.refreshToken;
    const accessToken: string | null =
      await this.authService.updateAccessToken(refreshToken);

    if (!accessToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return { accessToken };
  }
}
