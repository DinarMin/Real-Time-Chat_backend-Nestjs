import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from './entities/enity.messages';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Rooms } from 'src/rooms/entities/enity.rooms';
import { NewTextMessageDto } from './dto/new-message.dto';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Messages)
    private readonly messageRepository: Repository<Messages>,
    @InjectRepository(Rooms)
    private readonly roomsRepository: Repository<Rooms>,
    private readonly dataSource: DataSource,
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

      console.log(data);
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

  async getAllMessagesFromRoom(data) {
    try {
      const result = await this.messageRepository
        .createQueryBuilder('messages')
        .where('messages.roomId = :roomId', { roomId: data.roomId })
        .andWhere('messages.senderId = :senderId', { senderId: data.senderId })
        .andWhere('messages.deletedAt IS NULL')
        .getMany();
      return result;
    } catch (error) {
      throw new WsException('Server error');
    }
  }
}
