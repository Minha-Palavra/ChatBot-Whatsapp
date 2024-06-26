import * as dotenv from 'dotenv';

import * as path from 'path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from './src/database/strategies/snake-naming.strategy';

dotenv.config({ path: __dirname + '/.env' });

export const dataSource: DataSource = new DataSource({
  type: 'postgres',
  name: 'default',
  host: process.env.DB_HOST || 'postgres',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'postgres',
  namingStrategy: new SnakeNamingStrategy(),
  entities: [
    path.join(__dirname, 'src/**/*.entity{.ts,.js}'),
    path.join(__dirname, 'src/**/*.view-entity{.ts,.js}'),
  ],
  migrations: [path.join(__dirname, 'src/database/migrations/*{.ts,.js}')],
  subscribers: [path.join(__dirname, '/src/**/*.subscriber{.ts,.js}')],
});
