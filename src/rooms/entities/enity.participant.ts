import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Rooms } from './enity.rooms';
import { User } from 'src/users/entities/entity.user';

export enum RoleType {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity()
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  roomId: string;

  @ManyToOne(() => User, (user) => user.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Rooms, (rooms) => rooms.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roomId' })
  rooms: Rooms;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.MEMBER,
  })
  role: RoleType;

  @Column({ type: 'timestamp', name: 'last_read_at', nullable: true })
  lastReadAt: Date | null;
}
