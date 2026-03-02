import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

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
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
  migrationsTransactionMode: 'all',
});
