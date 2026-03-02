import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from './entities/enity.messages';
import { EntityManager, Repository } from 'typeorm';
import { NewTextMessageDto } from './dto/new-message.dto';
import { WsException } from '@nestjs/websockets';
import { RoomsService } from 'src/rooms/rooms.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Messages)
    private readonly messageRepository: Repository<Messages>,
    private readonly roomService: RoomsService,
  ) {}
  /**
   * Writes a new message to the database.
   * Accepts a DTO with the new message data, creates a Messages entity, and saves it to the database.
   * If an error occurs while saving, the error is logged to the console.
   *
   * @param {NewMessageDto} data
   * @return {*}  {Promise<void>}
   * @memberof ChatService
   */
  async createMessageText(
    data: NewTextMessageDto,
    manager?: EntityManager,
  ): Promise<Messages | void> {
    try {
      const repo = manager
        ? manager.getRepository(Messages)
        : this.messageRepository;

      const message: Messages = repo.create(data);

      const savedMessages = await repo.save(message);
      return savedMessages;
    } catch (error) {
      if (error.code === '23502') {
        throw new Error('Not enough data to save message');
      }
      throw error;
    }
  }

  async deleteMessage(messageId: string) {
    try {
      await this.messageRepository.update(messageId, {
        deletedAt: new Date(),
      });
      console.log('Message deleted');
    } catch (error) {
      throw new WsException('Message not found');
    }
  }

  async getAllMessagesFromRoom(data: { roomId: string }) {
    try {
      const result = await this.messageRepository
        .createQueryBuilder('messages')
        .where('messages.roomId = :roomId', { roomId: data.roomId })
        .andWhere('messages.deletedAt IS NULL')
        .orderBy('messages.createdAt', 'DESC')
        .take(20)
        .getMany();
      return result;
    } catch (error) {
      throw new WsException('Server error');
    }
  }

  async readMessage(data) {
    await this.roomService.updateLastReadAt(data);
  }

  async unreadCount(data: { userId: string; roomIds: string[] }) {
    const countArray: { roomId: string; count: number }[] = await Promise.all(
      data.roomIds.map(async (roomId) => {
        const count = await this.messageRepository
          .createQueryBuilder('m')
          .innerJoin(
            'participant',
            'p',
            'p.roomId = m.roomId AND p.userId = :userId',
            { userId: data.userId },
          )
          .where('m.roomId = :id', { id: roomId })
          .andWhere("m.createdAt > COALESCE(p.lastReadAt, '1970-01-01')")
          .andWhere('m.deletedAt IS NULL')
          .getCount();

        return { roomId, count };
      }),
    );
    return countArray;
  }
}
