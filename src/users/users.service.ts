import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/entity.user';
import { ReponseSearchUsername } from './interfaces/response-searchUsername.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /* Сохранение нового юзера */
  async create(createUserDto: CreateUserDto) {
    const exist = await this.userRepository.exists({
      where: { username: createUserDto.username },
    });
    if (exist) {
      throw new ConflictException('Duplicate username');
    }

    const user = this.userRepository.create({ ...createUserDto });

    return this.userRepository.save(user);
  }

  /* Поиск юзера по email */
  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    return user;
  }

  /* Очишение всей таблицы User, использовать только в dev режиме и только при тестах! */
  async clearUserTable() {
    await this.userRepository.clear();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`There is no user under id ${id}`);
    }
    return user;
  }

  async searchUsername(username: string): Promise<ReponseSearchUsername[]> {
    const result = await this.userRepository.find({
      where: {
        username: Like(`%${username}%`),
      },
      take: 3,
    });

    if (result.length === 0) {
      throw new NotFoundException('Username not found');
    }

    return result.map(
      (user: User): ReponseSearchUsername => ({
        id: user.id,
        username: user.username,
      }),
    );
  }

  async renameUsername(userId: string, newUsername: string) {
    const exist = await this.userRepository.exists({
      where: { username: newUsername },
    });

    if (exist) {
      throw new ConflictException('This username already exists.');
    }

    const updateUsername = await this.userRepository.update(userId, {
      username: newUsername,
    });

    if (updateUsername.affected == 1) {
      return { message: 'Username changed successfully', status: 200 };
    }

    return updateUsername;
  }
}
