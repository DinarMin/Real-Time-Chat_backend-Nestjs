import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Participant } from './enity.participant';
import { Messages } from 'src/chat/entities/enity.messages';
import { Calls } from 'src/calls/entities/enity.calls';

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
