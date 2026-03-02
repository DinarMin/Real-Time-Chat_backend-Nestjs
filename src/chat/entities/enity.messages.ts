import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Rooms } from 'src/rooms/entities/enity.rooms';
import { User } from 'src/users/entities/entity.user';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  CALL_LOG = 'call_log',
}

@Entity()
export class Messages {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomId: string;

  @Column()
  senderId: string;

  @ManyToOne(() => Rooms, (rooms) => rooms.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  rooms: Rooms;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  user: User;

  @Column()
  text: string;

  @Column({
    type: 'enum',
    enum: MessageType,
  })
  type: MessageType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}
