import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rooms, RoomType } from './entities/rooms.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Participant, RoleType } from './entities/participant.entity';
import { ChatService } from 'src/chat/chat.service';
import { Messages } from 'src/chat/entities/messages.entity';
import { CreateRoomPrivateDto } from './dto/create-room-private.dto';
import { RelatedUsers } from './interfaces/related-users.interface';
import { CreateRoomPublicDto } from './dto/create-room-public.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Rooms)
    private readonly roomsRepository: Repository<Rooms>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
    private dataSource: DataSource,
  ) {}

  async createPrivate(
    roomDto: CreateRoomPrivateDto,
    userId: string,
  ): Promise<any> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const roomRepo = queryRunner.manager.getRepository(Rooms);
      const participantRepo = queryRunner.manager.getRepository(Participant);

      const { name, type, message, memberId } = roomDto;
      const room = roomRepo.create({ name, type });
      const savedRoom = await roomRepo.save(room);

      const participant: Participant[] = participantRepo.create([
        {
          user: { id: userId },
          rooms: savedRoom,
          role: RoleType.ADMIN,
          lastReadAt: new Date(),
        },
        {
          user: { id: memberId },
          rooms: savedRoom,
          lastReadAt: new Date(),
        },
      ]);

      await participantRepo.save(participant);

      const firstMessage: Messages | void =
        await this.chatService.createMessageText(
          {
            ...message,
            roomId: savedRoom.id,
            senderId: userId,
          },
          queryRunner.manager,
        );

      await queryRunner.commitTransaction();
      return {
        room: { ...room },
        participant: { ...participant },
        firstMessage: { ...firstMessage },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error creating chat', err.code);
    } finally {
      await queryRunner.release();
    }
  }
  async createPublic(
    roomDto: CreateRoomPublicDto,
    userId: string,
  ): Promise<any> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const roomRepo = queryRunner.manager.getRepository(Rooms);
      const participantRepo = queryRunner.manager.getRepository(Participant);

      const { name, type, message, memberId } = roomDto;
      const room = roomRepo.create({ name, type });
      const savedRoom = await roomRepo.save(room);

      const participantAdmin: Participant = participantRepo.create({
        user: { id: userId },
        rooms: savedRoom,
        role: RoleType.ADMIN,
        lastReadAt: new Date(),
      });

      await participantRepo.save(participantAdmin);

      const participantMember: Participant[] = memberId.map((id) =>
        participantRepo.create({
          user: { id },
          rooms: savedRoom,
          lastReadAt: new Date(),
        }),
      );
      await participantRepo.save(participantMember);

      const firstMessage: Messages | void =
        await this.chatService.createMessageText(
          {
            ...message,
            roomId: savedRoom.id,
            senderId: userId,
          },
          queryRunner.manager,
        );

      await queryRunner.commitTransaction();
      return {
        room: { ...room },
        participant: { participantAdmin, ...participantMember },
        firstMessage: { ...firstMessage },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error creating chat', err.code);
    } finally {
      await queryRunner.release();
    }
  }

  async getAllRoomId(userId: string) {
    const roomsId = await this.participantRepository.find({
      select: ['roomId'],
      where: { userId },
    });

    return roomsId.map((r) => r.roomId);
  }

  async existsPrivateRoom(userId: string, memberId: string) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    try {
      return await queryRunner.manager
        .createQueryBuilder(Rooms, 'rooms')
        .innerJoin('rooms.participants', 'p1')
        .innerJoin('rooms.participants', 'p2')
        .where('rooms.type = :type', { type: RoomType.PRIVATE })
        .andWhere('p1.userId = :userId', { userId })
        .andWhere('p2.userId = :memberId', { memberId })
        .getOne();
    } catch (error) {
      queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
    }
  }

  async deleteRoom(roomId: string) {
    try {
      await this.roomsRepository.delete(roomId);
      return 'Room deleted successfully';
    } catch (error) {
      console.error(error?.message);
      throw new InternalServerErrorException('Failed to delete room');
    }
  }

  async getAllRelatedUserId(
    roomIds: string[],
    userId: string,
  ): Promise<string[]> {
    const result: RelatedUsers[] = await this.participantRepository
      .createQueryBuilder('p')
      .select('DISTINCT p.userId', 'userId')
      .where('p.roomId IN (:...roomIds)', { roomIds })
      .andWhere('p.userId != :id', { id: userId })
      .getRawMany();

    return result.map((r) => r.userId);
  }

  async updateLastReadAt(data: { roomId: string; userId: string }) {
    await this.participantRepository.update(
      { roomId: data.roomId, userId: data.userId },
      { lastReadAt: new Date() },
    );
  }
}
