import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import migrations from 'src/migrations';
import { User } from 'src/users/entities/entity.user';
import { Rooms } from 'src/rooms/entities/enity.rooms';
import { Participant } from 'src/rooms/entities/enity.participant';
import { Messages } from 'src/chat/entities/enity.messages';
import { Calls } from 'src/calls/entities/enity.calls';

const ENV_FILE = `.env`;

dotenv.config({ path: ENV_FILE });

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  entities: [User, Rooms, Participant, Messages, Calls],
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
  migrationsTransactionMode: 'all',
  migrations,
});
