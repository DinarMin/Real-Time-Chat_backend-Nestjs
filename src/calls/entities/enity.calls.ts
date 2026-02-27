import { Rooms } from 'src/rooms/entities/enity.rooms';
import { User } from 'src/users/entities/entity.user';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StatusCallType {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  MISSED = 'missed',
  BUSY = 'busy',
  REJECTED = 'rejected',
}

@Entity()
export class Calls {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Rooms, (rooms) => rooms.calls)
  @JoinColumn({ name: 'roomId' })
  rooms: Rooms;

  @ManyToOne(() => User, (user) => user.calls)
  @JoinColumn({ name: 'senderId' })
  user: User;

  @Column({
    type: 'enum',
    enum: StatusCallType,
  })
  status: StatusCallType;

  @CreateDateColumn({ name: 'started_at' })
  startedAt!: Date;

  @Column({ name: 'ended_at', type: 'timestamp', nullable: true })
  endedAt?: Date;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
