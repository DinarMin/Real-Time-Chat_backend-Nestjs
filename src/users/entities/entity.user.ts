import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { Participant } from 'src/rooms/entities/enity.participant';
import { Messages } from 'src/chat/entities/enity.messages';
import { Calls } from 'src/calls/entities/enity.calls';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 20, unique: true })
  username: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Participant, (participant) => participant.user)
  participants: Participant[];

  @OneToMany(() => Messages, (messages) => messages.user)
  messages: Messages[];

  @OneToMany(() => Calls, (calls) => calls.user)
  calls: Calls[];
}
