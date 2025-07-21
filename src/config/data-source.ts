import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { SmartBox } from '../entities/SmartBox';
import { Package } from '../entities/Package';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Bestnet@2002',
  database: 'smartbox_db',
  synchronize: true, 
  logging: false,
  entities: [User, SmartBox, Package],
});
