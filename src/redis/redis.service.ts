import { Injectable } from '@nestjs/common';
import Redis, { Redis as RedisType } from 'ioredis';
import * as dotenv from 'dotenv';
import { RoomsService } from 'src/rooms/rooms.service';

const ENV_FILE = `.env`;

dotenv.config({ path: ENV_FILE });

@Injectable()
export class RedisService {
  private client: RedisType;
  constructor(private readonly roomService: RoomsService) {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
      password: process.env.REDIS_PASSWORD,
    });
  }

  async setOnline(userId: string): Promise<void> {
    await this.client.set(`presence:userid:${userId}`, '1', 'EX', 60);
  }

  async getOnline(userId: string) {
    const result = await this.client.get(`presence:userid:${userId}`);
    return !!result;
  }

  async setOffline(userId: string) {
    const result = await this.client.del(`presence:userid:${userId}`);
  }

  async onlineUsers(roomIds: string[], userId: string) {
    const relatedUsers: string[] = await this.roomService.getAllRelatedUserId(
      roomIds,
      userId,
    );
    const onlineUsers: string[] | null = [];
    for (const id of relatedUsers) {
      if (await this.getOnline(id)) {
        onlineUsers.push(id);
      }
    }
    return onlineUsers;
  }
}
