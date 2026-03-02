/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

import { User } from 'src/users/entities/user.entity';

import { UsersService } from '../users/users.service';

import type { LoginUser } from '../users/interfaces/login-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * Registers a new user.
   * Accepts data in the CreateUserDto format, checks for the existence of a user with the specified email address,
   * hashes the password, and stores the new user in the database. Returns a message
   * about successful registration and the new user's email address.
   *
   * @param {CreateUserDto} userDto
   * @return {*}
   * @memberof AuthService
   */
  async signUp(userDto: CreateUserDto) {
    const candidate = await this.userService.findOneByEmail(userDto.email);
    if (candidate) return null;

    const hashedPassword: string = await bcrypt.hash(userDto.password, 7);

    const user: User = await this.userService.create({
      ...userDto,
      password: hashedPassword,
    });
    return {
      message: 'User registered.',
      email: user.email,
    };
  }
  /**
   * User authentication.
   * Accepts data as a LoginUser type, generates an accessToken and refreshToken, and returns it as an object.
   *
   * @param {LoginUser} userData
   * @return {*}
   * @memberof AuthService
   */
  async singIn(userData: LoginUser) {
    const tokens = await this.genereatedTokens(userData.id);

    return tokens;
  }
  /**
   * Validates authentication data.
   * Accepts data in the LoginUserDto format, checks for the existence of a user with the specified email address,
   * compares the passed password with the hashed password in the database, and returns the user data if the verification is successful.
   *
   * @param {LoginUserDto} userDto
   * @return {*}
   * @memberof AuthService
   */
  async validateUser(userDto: LoginUserDto) {
    const user = await this.userService.findOneByEmail(userDto.email);

    if (!user) {
      throw new NotFoundException('Incorrect login or password.');
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (!passwordEquals) {
      throw new UnauthorizedException({
        message: 'Incorrect login or password.',
      });
    }

    return user;
  }
  /**
   * Token generation.
   * Accepts a user ID, generates an accessToken and refreshToken using the JwtService, and returns them as an object.
   *
   * @private
   * @param {string} id
   * @return {*}
   * @memberof AuthService
   */
  private async genereatedTokens(id: string) {
    const payload = { id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRE'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRE'),
    });

    const tokens = { accessToken, refreshToken };

    return tokens;
  }
  /**
   * Verification of refresh token.
   * Accepts a refreshToken, verifies it using the JwtService, and returns the payload if the verification is successful.
   *
   * @param {string} refreshToken
   * @return {*}
   * @memberof AuthService
   */
  verifyRefreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
    });

    return payload;
  }
  /**
   * Access token update.
   * Accepts a refresh token, verifies the token's authenticity, generates an access token, and returns.
   *
   *
   * @param {string} refreshToken
   * @return {*}
   * @memberof AuthService
   */
  async updateAccessToken(refreshToken: string) {
    try {
      const userId = this.verifyRefreshToken(refreshToken);

      const tokens = await this.genereatedTokens(userId);

      return tokens.accessToken;
    } catch (e) {
      return null;
    }
  }
  /**
   * Access token verification.
   * Accepts an accessToken, verifies it using the JwtService, and returns a payload if verification is successful.
   *
   * @param {*} accessToken
   * @return {*}
   * @memberof AuthService
   */
  async verifyAccessToken(accessToken) {
    try {
      const decoded = this.jwtService.verify(
        accessToken,
        this.configService.getOrThrow('JWT_ACCESS_EXPIRE'),
      );
      return decoded;
    } catch (error) {
      console.error(error);
    }
  }
}
