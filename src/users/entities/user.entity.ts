import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { Participant } from 'src/rooms/entities/participant.entity';
import { Messages } from 'src/chat/entities/messages.entity';
import { Calls } from 'src/calls/entities/calls.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 40, unique: true })
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
