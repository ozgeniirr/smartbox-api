import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Package } from '../entities/Package';
import { SmartBox } from '../entities/SmartBox';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Package, SmartBox],
  synchronize: true,
  logging: false,
});
