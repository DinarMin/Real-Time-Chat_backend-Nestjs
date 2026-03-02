import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Participant } from './participant.entity';
import { Messages } from 'src/chat/entities/messages.entity';
import { Calls } from 'src/calls/entities/calls.entity';

export enum RoomType {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

@Entity()
export class Rooms {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: RoomType,
  })
  type: RoomType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;

  @OneToMany(() => Participant, (participant) => participant.rooms)
  participants: Participant[];

  @OneToMany(() => Messages, (messages) => messages.rooms)
  messages: Messages[];

  @OneToMany(() => Calls, (calls) => calls.rooms)
  calls: Calls[];
}
